import { config } from '../config'
import { getField, getFieldContainer } from './field'

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
export function isRequired (field) {
  field = getField(field, { returnArray: true })

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
export function addRequired (field, options) {
  options = {
    ...config,
    ...options
  }

  field = getField(field, { returnArray: true })

  if (!field) return

  const container = getFieldContainer(field, options.container)

  field.forEach(fieldElement => {
    fieldElement.setAttribute('required', 'S')
    fieldElement.removeAttribute(options.requiredAttr)
  })

  if (options.toggleRequiredClass && container) {
    container.classList.add(options.requiredClass)
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
export function removeRequired (field, options) {
  options = {
    ...config,
    ...options
  }

  field = getField(field, { returnArray: true })

  if (!field) return

  const container = getFieldContainer(field, options.container)

  field.forEach(fieldElement => {
    fieldElement.setAttribute('required', 'N')
    fieldElement.setAttribute(options.requiredAttr, true)
  })

  if (options.toggleRequiredClass && container) {
    container.classList.remove(options.requiredClass)
  }

  return field
}
