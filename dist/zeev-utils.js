(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Utils = {}));
})(this, (function (exports) { 'use strict';

  const config = {
    container: 'tr',
    hideClass: 'hidden',
    toggleRequiredClass: false,
    requiredClass: 'execute-required',
    requiredAttr: 'data-was-required'
  };

  /* istanbul ignore file */
  function log (message, level = 'warn') {
    const logger = logLevels[level] || console.log;

    logger(`[zeev-utils] ${message}`);
  }

  const logLevels = {
    warn: console.warn,
    error: console.error,
    log: console.log
  };

  const FIELD_TYPES_VALUE_BASED = [
    'text',
    'textarea',
    'select-one',
    'hidden'
  ];

  // ------------------------------------------------------------------------------------
  // 🔑 Funções Públicas
  // ------------------------------------------------------------------------------------

  /**
   * @public
   * Busca campos de formulário do Zeev
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @param {Object=} options - configurações
   * @param {Boolean=} options.returnArray - força que o retorno seja um array mesmo quando houver somente 1 campo
   * @returns {HTMLElement|HTMLElement[]} - campo ou array com os campos encontrados
   */
  function getField (field, { returnArray } = {}) {
    returnArray = returnArray || false;

    if (field.jquery) {
      return returnArray || field.length > 0
        ? [...field]
        : field[0]
    }

    if (field instanceof HTMLElement) {
      return returnArray
        ? [field]
        : field
    }

    if (
      field instanceof HTMLCollection ||
      field instanceof NodeList ||
      Array.isArray(field)
    ) {
      return [...field]
    }

    if (typeof field === 'string') {
      return getFieldById(field, { returnArray })
    }
  }

  /**
   * @public
   * Busca o container de um campo de formulário do Zeev
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @param {String} containerSelector - seletor do elemento que contém o campo de formulário
   * @returns {HTMLElement} container do campo de formulário
   */
  function getFieldContainer (field, containerSelector) {
    field = getField(field, { returnArray: true });

    if (!field || !containerSelector) {
      log('Os parâmetros field e containerSelector devem ser informados');
      return null
    }

    const [fieldElement] = field;
    const container = fieldElement.closest(containerSelector);
    const fieldId = fieldElement.getAttribute('xname').substring(3);

    if (!container) {
      log(`Não foi encontrado nenhum elemento para referência ${containerSelector} a partir do campo ${fieldId}`);
      return null
    }

    return container
  }

  /**
   * @public
   * Retorna o(s) valor(es) selecionado(s) de um campo de formulário
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @returns {String|String[]} valor(es) do campo
   */
  function getFieldValue (field) {
    field = getField(field, { returnArray: true });

    if (!field) return

    const [firstField] = field;
    const type = firstField.type;

    if (type === 'checkbox') {
      return field
        .filter(field => field.checked)
        .map(field => field.value)
    }

    if (type === 'radio') {
      return field.find(field => field.checked)?.value || null
    }

    return field.length > 1
      ? field.map(field => field.value)
      : firstField.value
  }

  /**
   * @public
   * Limpa o valor de um campo de formulário do Zeev
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @returns {HTMLElement[]} - campos encontrados
   */
  function clearField (field) {
    field = getField(field, { returnArray: true });

    if (!field) return

    field.forEach(fieldElement => {
      const fieldType = fieldElement.type;
      const xType = fieldElement.getAttribute('xtype');

      if (FIELD_TYPES_VALUE_BASED.includes(fieldType)) {
        if (xType === 'FILE') {
          clearFileField(fieldElement);
        } else {
          fieldElement.value = '';
        }
      } else {
        fieldElement.checked = false;
      }

      fieldElement.dispatchEvent(new Event('change'));
    });

    return field
  }

  /**
   * @public
   * Dispara uma função de callback quando um campo do tipo `Arquivo` é alterado
   * @param {String|HTMLElement|jQuery} field - campo de formulário Zeev
   * @param {Function} callback - função de callback
   * @returns {HTMLElement} - campo encontrado
   */
  function onFileChange (field, callback) {
    field = getField(field, { returnArray: true });

    if (!field) return

    if (!(callback instanceof Function)) {
      log('O parâmetro callback deve obrigatoriamente ser uma função');
      return
    }

    const [fieldElement] = field;
    const xType = fieldElement.getAttribute('xtype');
    const id = fieldElement.getAttribute('xname').substring(3);
    const attachBtn = fieldElement.nextElementSibling;

    if (xType !== 'FILE') {
      log(`Para observar mudanças o campo deve ser do tipo Arquivo e o tipo informado foi ${xType}`);
      return
    }

    const observer = new MutationObserver((mutationsList) => {
      handleFileChange({
        mutationsList,
        id,
        fieldElement,
        callback
      });
    });

    observer.observe(attachBtn, { attributes: true });

    return fieldElement
  }

  // ------------------------------------------------------------------------------------
  // 🔒 Funções Privadas
  // ------------------------------------------------------------------------------------

  /**
   * @private
   * Encontra um campo de formulário a partir do seu identificador
   * @param {String} fieldId - identificador do campo no Zeev
   * @param {Object=} options - configurações
   * @param {Boolean=} options.returnArray - força que o retorno seja um array mesmo quando houver somente 1 campo
   * @returns {HTMLElement|HTMLElement[]} - campo ou array com os campos encontrados
   */
  function getFieldById (fieldId, { returnArray } = {}) {
    returnArray = returnArray || false;

    if (!fieldId) {
      log('O parâmetro fieldId deve ser informado');
      return null
    }

    const xname = fieldId.substring(0, 3) === 'inp'
      ? fieldId
      : `inp${fieldId}`;

    const fields = document.querySelectorAll(`[xname="${xname}"]`);

    if (!fields.length) {
      log(`Nehum campo de formulário encontrado para o identificador ${fieldId}`);
      return null
    }

    if (returnArray || fields.length > 1) {
      return [...fields]
    }

    return fields[0]
  }

  /**
   * @private
   * Limpa o valor de um campo de formulário do tipo `Arquivo`
   * @param {HTMLElement} field - campo de formulário Zeev
   */
  function clearFileField (field) {
    const fieldId = field.getAttribute('xname').substring(3);
    const deleteBtn = field.parentElement
      .querySelector(`[xid=div${fieldId}] > a:last-of-type`);

    if (deleteBtn) {
      deleteBtn.click();
    }
  }

  /**
   * @private
   * Observa a remoção ou inclusão de anexos em campos do tipo Arquivo
   * @param {MutationRecord[]} mutationsList - lista de mutations ocorridas
   * @param {String} id - identificador do campo de formulário Zeev
   * @param {HTMLElement} fieldElement - campo de formulário Zeev
   * @param {Function} callback - função de callback quando o campo arquivo for alterado
   */
  function handleFileChange ({ mutationsList, id, fieldElement, callback }) {
    mutationsList.forEach(mutation => {
      if (mutation.type === 'attributes') {
        const deleteBtn = fieldElement.parentElement
          .querySelector(`[xid=div${id}] > a:last-of-type`);

        const filepath = fieldElement.value;

        if (deleteBtn) {
          deleteBtn
            .addEventListener('click', () => callback());
        }

        callback(filepath, deleteBtn);
      }
    });
  }

  // ------------------------------------------------------------------------------------
  // 🔑 Funções Públicas
  // ------------------------------------------------------------------------------------

  /**
   * @public
   * Verifica se o campo de formulário é obrigatório a partir da propriedade
   * `required="S"` utilizada pelo Zeev, ou então pelo atributo temporário
   * `data-was-required` adicionado pela função `hideField` do Zeev-Utils
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @returns {Boolean} se o campo é obrigatório
   */
  function isRequired (field) {
    field = getField(field, { returnArray: true });

    if (!field) return

    return field.some(
      field =>
        field.hasAttribute(config.requiredAttr) ||
        field.getAttribute('required') === 'S'
    )
  }

  /**
   * @public
   * Adiciona obrigatoriedade a um campo de forumário Zeev
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @param {Object=} options - configurações
   * @param {Boolean=} options.toggleRequiredClass - habilita a adição de classe auxiliar ao container do campo
   * @param {String=} options.requiredClass - classe auxiliar quando obrigatório
   * @param {String=} options.requiredAttr - atributo auxiliar quando obrigatório
   * @param {String=} options.container - seletor do elemento que contém o campo de formulário
   * @returns {HTMLElement[]} - campos encontrados
   */
  function addRequired (field, options) {
    options = {
      ...config,
      ...options
    };

    field = getField(field, { returnArray: true });

    if (!field) return

    const container = getFieldContainer(field, options.container);

    field.forEach(fieldElement => {
      fieldElement.setAttribute('required', 'S');
      fieldElement.removeAttribute(options.requiredAttr);
    });

    if (options.toggleRequiredClass && container) {
      container.classList.add(options.requiredClass);
    }

    return field
  }

  /**
   * @public
   * Remove obrigatoriedade a um campo de forumário Orquestra
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @param {Object=} options - configurações
   * @param {Boolean=} options.toggleRequiredClass - habilita a adição de classe auxiliar ao container do campo
   * @param {String=} options.requiredClass - classe auxiliar quando obrigatório
   * @param {String=} options.requiredAttr - atributo auxiliar quando obrigatório
   * @param {String=} options.container - seletor do elemento que contém o campo de formulário
   * @returns {HTMLElement[]} - campos encontrados
   */
  function removeRequired (field, options) {
    options = {
      ...config,
      ...options
    };

    field = getField(field, { returnArray: true });

    if (!field) return

    const container = getFieldContainer(field, options.container);

    field.forEach(fieldElement => {
      fieldElement.setAttribute('required', 'N');
      fieldElement.setAttribute(options.requiredAttr, true);
    });

    if (options.toggleRequiredClass && container) {
      container.classList.remove(options.requiredClass);
    }

    return field
  }

  // ------------------------------------------------------------------------------------
  // 🔑 Funções Públicas
  // ------------------------------------------------------------------------------------

  /**
   * @public
   * Exibe um campo de formulário Zeev removendo a classe auxiliar indicada
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @param {Object=} options - configurações
   * @param {String=} options.container - seletor do elemento que contém o campo de formulário
   * @param {String=} options.hideClass - classe auxiliar utilizada pra ocultar o campo
   * @returns {HTMLElement[]} - campos encontrados
   */
  function showField (field, options) {
    options = {
      ...config,
      ...options
    };

    if (!field) return

    const {
      elements,
      container,
      required
    } = handleField(field, options.container);

    if (!elements || !container) return

    if (required) addRequired(elements, options);

    container.classList.remove(options.hideClass);

    return elements
  }

  /**
   * @public
   * Oculta um campo de formulário Zeev adicionando a classe auxiliar indicada e limpando seu valor
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
   * @param {Object=} options - configurações
   * @param {String=} options.container - seletor do elemento que contém o campo de formulário
   * @param {String=} options.hideClass - classe auxiliar utilizada pra ocultar o campo
   * @returns {HTMLElement[]} - campos encontrados
   */
  function hideField (field, options) {
    options = {
      ...config,
      ...options
    };

    if (!field) return

    const {
      elements,
      container,
      required
    } = handleField(field, options.container);

    if (!elements || !container) return

    if (required) removeRequired(elements, options);

    container.classList.add(options.hideClass);
    clearField(elements);

    return elements
  }

  /**
   * @public
   * Exibe um conjunto de campos de formulário Zeev removendo a classe auxiliar do container
   * @param {String|HTMLElement} container - container dos campos de formulário
   * @param {Object=} options - configurações
   * @param {String=} options.hideClass - classe auxiliar utilizada pra ocultar o campo
   * @returns {HTMLElement[]} - campos encontrados
   */
  function showGroup (container, options) {
    options = {
      ...config,
      ...options
    };

    if (!container) return

    const group = handleFieldGroup(container);

    if (!group.container || !group.fields) return

    group.fields.forEach(field => {
      if (isRequired(field)) addRequired(field, { container });
    });

    group.container.classList.remove(options.hideClass);

    return group.fields
  }

  /**
   * @public
   * Oculta um conjunto de campos de formulário Zeev adicionando a classe auxiliar do container
   * @param {String|HTMLElement} container - container dos campos de formulário
   * @param {Object=} options - configurações
   * @param {String=} options.hideClass - classe auxiliar utilizada pra ocultar o campo
   * @returns {HTMLElement[]} - campos encontrados
   */
  function hideGroup (container, options) {
    options = {
      ...config,
      ...options
    };

    if (!container) return

    const group = handleFieldGroup(container);

    if (!group.container || !group.fields) return

    group.fields.forEach(field => {
      clearField(field);
      if (isRequired(field)) removeRequired(field, { container });
    });

    group.container.classList.add(options.hideClass);

    return group.fields
  }

  // ------------------------------------------------------------------------------------
  // 🔒 Funções Privadas
  // ------------------------------------------------------------------------------------

  /**
   * @private
   * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Orquestra
   * @param {String} containerSelector - seletor do elemento que contém o campo de formulário
   * @returns {Object} campo de formulário e informações auxiliares utilizadas internamente
   */
  function handleField (field, containerSelector) {
    field = getField(field, { returnArray: true });

    if (!field) return {}

    const container = getFieldContainer(field, containerSelector);

    if (!container) return {}

    return {
      container,
      elements: field,
      required: isRequired(field)
    }
  }

  /**
   * @private
   * @param {String|HTMLElement|} container - elemento que contém os campos de formulário
   * @returns {Object} campos de formulário encontrados e o container
   */
  function handleFieldGroup (container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (!(container instanceof HTMLElement)) return {}

    const fields = [...container.querySelectorAll('[xname]')];

    if (!fields.length) {
      log('Nenhum campo de formulário encontrado no container informado');
      return {}
    }

    return { container, fields }
  }

  function setup (options) {
    const overriddenOptions = {
      ...config,
      ...options
    };

    return {
      // Field
      getField,
      getFieldContainer,
      getFieldValue,
      clearField,
      onFileChange,

      // Requirement
      isRequired,
      addRequired: (field, executionOptions = {}) => addRequired(field, { ...overriddenOptions, ...executionOptions }),
      removeRequired: (field, executionOptions = {}) => removeRequired(field, { ...overriddenOptions, ...executionOptions }),

      // Visibility
      showField: (field, executionOptions = {}) => showField(field, { ...overriddenOptions, ...executionOptions }),
      hideField: (field, executionOptions = {}) => hideField(field, { ...overriddenOptions, ...executionOptions }),
      showGroup: (field, executionOptions = {}) => showGroup(field, { ...overriddenOptions, ...executionOptions }),
      hideGroup: (field, executionOptions = {}) => hideGroup(field, { ...overriddenOptions, ...executionOptions })
    }
  }

  exports.addRequired = addRequired;
  exports.clearField = clearField;
  exports.getField = getField;
  exports.getFieldContainer = getFieldContainer;
  exports.getFieldValue = getFieldValue;
  exports.hideField = hideField;
  exports.hideGroup = hideGroup;
  exports.isRequired = isRequired;
  exports.onFileChange = onFileChange;
  exports.removeRequired = removeRequired;
  exports.setup = setup;
  exports.showField = showField;
  exports.showGroup = showGroup;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
