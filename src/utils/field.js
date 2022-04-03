import { log } from '../logger'

const FIELD_TYPES_VALUE_BASED = [
  'text',
  'textarea',
  'select-one',
  'hidden'
]

// ------------------------------------------------------------------------------------
// 🔑 Funções Públicas
// ------------------------------------------------------------------------------------

/**
 * @public
 * Busca campos de formulário do Zeev
 * @param {String|HTMLElement|HTMLCollection|jQuery} field - campo de formulário Zeev
 * @param {Object} options - configurações
 * @param {Boolean=} options.returnArray - força que o retorno seja um array mesmo quando houver somente 1 campo
 * @returns {HTMLElement|HTMLElement[]} - campo ou array com os campos encontrados
 */
export function getField (field, options = {}) {
  const returnArray = options.returnArray || false

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
export function getFieldContainer (field, containerSelector) {
  field = getField(field, { returnArray: true })

  if (!field || !containerSelector) {
    log('Os parâmetros field e containerSelector devem ser informados')
    return null
  }

  const [fieldElement] = field
  const container = fieldElement.closest(containerSelector)
  const fieldId = fieldElement.getAttribute('xname').substring(3)

  if (!container) {
    log(`Não foi encontrado nenhum elemento para referência ${containerSelector} a partir do campo ${fieldId}`)
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
export function getFieldValue (field) {
  field = getField(field, { returnArray: true })

  if (!field) return

  const [firstField] = field
  const type = firstField.type

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
export function clearField (field) {
  field = getField(field, { returnArray: true })

  if (!field) return

  field.forEach(fieldElement => {
    const fieldType = fieldElement.type
    const xType = fieldElement.getAttribute('xtype')

    if (FIELD_TYPES_VALUE_BASED.includes(fieldType)) {
      if (xType === 'FILE') {
        clearFileField(fieldElement)
      } else {
        fieldElement.value = ''
      }
    } else {
      fieldElement.checked = false
    }

    fieldElement.dispatchEvent(new Event('change'))
  })

  return field
}

/**
 * @public
 * Dispara uma função de callback quando um campo do tipo `Arquivo` é alterado
 * @param {String|HTMLElement|jQuery} field - campo de formulário Zeev
 * @param {Function} callback - função de callback
 * @returns {HTMLElement} - campo encontrado
 */
export function onFileChange (field, callback) {
  field = getField(field, { returnArray: true })

  if (!field) return

  if (!(callback instanceof Function)) {
    log('O parâmetro callback deve obrigatoriamente ser uma função')
    return
  }

  const [fieldElement] = field
  const xType = fieldElement.getAttribute('xtype')
  const id = fieldElement.getAttribute('xname').substring(3)
  const attachBtn = fieldElement.nextElementSibling

  if (xType !== 'FILE') {
    log(`Para observar mudanças o campo deve ser do tipo Arquivo e o tipo informado foi ${xType}`)
    return
  }

  const observer = new MutationObserver((mutationsList) => {
    handleFileChange({
      mutationsList,
      id,
      fieldElement,
      callback
    })
  })

  observer.observe(attachBtn, { attributes: true })

  return fieldElement
}

// ------------------------------------------------------------------------------------
// 🔒 Funções Privadas
// ------------------------------------------------------------------------------------

/**
 * @private
 * Encontra um campo de formulário a partir do seu identificador
 * @param {String} fieldId - identificador do campo no Zeev
 * @param {Boolean=} returnArray - força que o retorno seja um array mesmo quando houver somente 1 campo
 * @returns {HTMLElement|HTMLElement[]} - campo ou array com os campos encontrados
 */
function getFieldById (fieldId, { returnArray }) {
  returnArray = returnArray || false

  if (!fieldId) {
    log('O parâmetro fieldId deve ser informado')
    return null
  }

  const xname = fieldId.substring(0, 3) === 'inp'
    ? fieldId
    : `inp${fieldId}`

  const fields = document.querySelectorAll(`[xname="${xname}"]`)

  if (!fields.length) {
    log(`Nehum campo de formulário encontrado para o identificador ${fieldId}`)
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
  const fieldId = field.getAttribute('xname').substring(3)
  const deleteBtn = field.parentElement
    .querySelector(`[xid=div${fieldId}] > a:last-of-type`)

  if (deleteBtn) {
    deleteBtn.click()
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
        .querySelector(`[xid=div${id}] > a:last-of-type`)

      const filepath = fieldElement.value

      if (deleteBtn) {
        deleteBtn
          .addEventListener('click', () => callback())
      }

      callback(filepath, deleteBtn)
    }
  })
}
