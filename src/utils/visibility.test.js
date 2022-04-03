/**
 * @jest-environment jsdom
 */

import { createField } from '../tests/dom'

import {
  getFieldContainer
} from './field'

import {
  showField,
  hideField
} from './visibility'

describe('showField', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const field = showField('')
    expect(field).toBeUndefined()
  })

  it('deve retornar undefined quando o container não for encontrado', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId })

    const field = showField(fieldId)

    expect(field).toBeUndefined()
  })

  it('deve retornar undefined quando o campo não for encontrado', () => {
    const field = showField('campoNaoExiste')

    expect(field).toBeUndefined()
  })

  it('deve remover a classe auxiliar de visibilidade do container do campo', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'
    const hideClass = 'hidden'

    document.body.innerHTML = `<div class="${containerClass} ${hideClass}">
      ${createField({ id: fieldId, required: false })}
    </div>`

    showField(fieldId, {
      hideClass,
      container: `.${containerClass}`
    })

    const container = getFieldContainer(fieldId, `.${containerClass}`)

    expect(container.classList.contains(hideClass)).toBeFalsy()
  })

  it('deve re-adicionar o atributo required="S" em um campo com a propriedade data-was-required', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, dataWasRequired: true })}
    </div>`

    const [field] = showField(fieldId, { container: `.${containerClass}` })

    expect(field.getAttribute('required')).toBe('S')
  })
})

describe('hideField', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const field = hideField('')
    expect(field).toBeUndefined()
  })

  it('deve retornar undefined quando o container não for encontrado', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId })

    const field = hideField(fieldId)

    expect(field).toBeUndefined()
  })

  it('deve retornar undefined quando o campo não for encontrado', () => {
    const field = hideField('campoNaoExiste')

    expect(field).toBeUndefined()
  })

  it('deve adicionar a classe auxiliar de visibilidade do container do campo', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'
    const hideClass = 'hidden'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, required: false })}
    </div>`

    hideField(fieldId, {
      hideClass,
      container: `.${containerClass}`
    })

    const container = getFieldContainer(fieldId, `.${containerClass}`)

    expect(container.classList.contains(hideClass)).toBeTruthy()
  })

  it('deve adicionar o atributo required="N" em um campo obrigatorio', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, required: true })}
    </div>`

    const [field] = hideField(fieldId, { container: `.${containerClass}` })

    expect(field.getAttribute('required')).toBe('N')
  })
})

/**
 * @todo
 * - adicionar testes para showGroup
 * - adicionar testes para hideGroup
 */
