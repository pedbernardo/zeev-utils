import { config } from '../config'
import { log } from '../logger'
import { getField, getFieldContainer, clearField } from './field'
import { addRequired, removeRequired, isRequired } from './require'

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
export function showField (field, options) {
  options = {
    ...config,
    ...options
  }

  if (!field) return

  const {
    elements,
    container,
    required
  } = handleField(field, options.container)

  if (!elements || !container) return

  if (required) addRequired(elements, options)

  container.classList.remove(options.hideClass)

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
export function hideField (field, options) {
  options = {
    ...config,
    ...options
  }

  if (!field) return

  const {
    elements,
    container,
    required
  } = handleField(field, options.container)

  if (!elements || !container) return

  if (required) removeRequired(elements, options)

  container.classList.add(options.hideClass)
  clearField(elements)

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
export function showGroup (container, options) {
  options = {
    ...config,
    ...options
  }

  if (!container) return

  const group = handleFieldGroup(container)

  if (!group.container || !group.fields) return

  const requiredFields = group.fields.filter(field =>
    field.hasAttribute(config.requiredAttr)
  )

  if (requiredFields.length) addRequired(requiredFields, options)

  group.container.classList.remove(options.hideClass)

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
export function hideGroup (container, options) {
  options = {
    ...config,
    ...options
  }

  if (!container) return

  const group = handleFieldGroup(container)

  if (!group.container || !group.fields) return

  const requiredFields = group.fields.filter(field =>
    field.getAttribute('required') === 'S'
  )

  if (requiredFields.length) addRequired(requiredFields, options)

  container.classList.remove(options.hideClass)

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
  field = getField(field, { returnArray: true })

  if (!field) return {}

  const container = getFieldContainer(field, containerSelector)

  if (!container) return {}

  return {
    container,
    elements: field,
    required: isRequired(field)
  }
}

function handleFieldGroup (container) {
  if (container instanceof String) {
    container = document.querySelector(container)
  }

  if (!(container instanceof HTMLElement)) return {}

  const fields = [...container.querySelectorAll('[xname]')]

  if (fields.length) {
    log('Nenhum campo de formulário encontrato no container informado')
    return {}
  }

  return { container, fields }
}
