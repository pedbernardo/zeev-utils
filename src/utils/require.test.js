/**
 * @jest-environment jsdom
 */

import { createField } from '../tests/dom'

import {
  getFieldContainer
} from './field'

import {
  isRequired,
  addRequired,
  removeRequired
} from './require'

describe('isRequired', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const required = isRequired('')
    expect(required).toBeUndefined()
  })

  it('deve retornar true quando o campo estiver com a propriedade required="S"', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: true })

    const required = isRequired(fieldId)
    expect(required).toBeTruthy()
  })

  it('deve retornar true quando o campo estiver com a propriedade data-was-required', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, dataWasRequired: true })

    const required = isRequired(fieldId)
    expect(required).toBeTruthy()
  })

  it('deve retornar true quando o campo estiver com a propriedade required="N" e com a propriedade data-was-required', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: false, dataWasRequired: true })

    const required = isRequired(fieldId)
    expect(required).toBeTruthy()
  })

  it('deve retornar false quando o campo estiver com a propriedade required="N" e sem a propriedade data-was-required', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: false })

    const required = isRequired(fieldId)
    expect(required).toBeFalsy()
  })

  it('deve retornar false quando o campo não estiver com as propriedades required e data-was-required', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId })

    const required = isRequired(fieldId)
    expect(required).toBeFalsy()
  })
})

describe('addRequired', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const field = addRequired('')
    expect(field).toBeUndefined()
  })

  it('deve alterar o atributo required para "S" em um campo de formulário', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: false })

    const [field] = addRequired(fieldId)

    expect(field.getAttribute('required')).toBe('S')
  })

  it('deve remover o atributo data-was-required ao adicionar obrigatoriedade em um campo de formulário', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: false })

    const [field] = addRequired(fieldId)

    expect(field.hasAttribute('data-was-required')).toBeFalsy()
  })

  it('deve remover o atributo informado nas options ao adicionar obrigatoriedade em um campo de formulário', () => {
    const fieldId = 'meuCampo'
    const requiredAttr = 'attr-required'

    document.body.innerHTML = createField({ id: fieldId, required: false })
    document.querySelector(`[xname=inp${fieldId}]`).setAttribute(requiredAttr, '')

    const [field] = addRequired(fieldId, { requiredAttr })

    expect(field.hasAttribute(requiredAttr)).toBeFalsy()
  })

  it('deve adicionar a classe auxiliar ao container quando configurado nas options', () => {
    const fieldId = 'meuCampo'
    const myClass = 'obrigatorio'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, required: false })}
    </div>`

    addRequired(fieldId, {
      toggleRequiredClass: true,
      requiredClass: myClass,
      container: `.${containerClass}`
    })

    const container = getFieldContainer(fieldId, `.${containerClass}`)

    expect(container.classList.contains(myClass)).toBeTruthy()
  })
})

describe('removeRequired', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const field = removeRequired('')
    expect(field).toBeUndefined()
  })

  it('deve alterar o atributo required para "N" em um campo de formulário', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: false })

    const [field] = removeRequired(fieldId)

    expect(field.getAttribute('required')).toBe('N')
  })

  it('deve adicionar o atributo data-was-required ao remover obrigatoriedade em um campo de formulário', () => {
    const fieldId = 'meuCampo'

    document.body.innerHTML = createField({ id: fieldId, required: false })

    const [field] = removeRequired(fieldId)

    expect(field.hasAttribute('data-was-required')).toBeTruthy()
  })

  it('deve adicionar o atributo informado nas options ao remover obrigatoriedade em um campo de formulário', () => {
    const fieldId = 'meuCampo'
    const requiredAttr = 'attr-required'

    document.body.innerHTML = createField({ id: fieldId, required: false })

    const [field] = removeRequired(fieldId, { requiredAttr })

    expect(field.hasAttribute(requiredAttr)).toBeTruthy()
  })

  it('deve remover a classe auxiliar do container quando configurado nas options', () => {
    const fieldId = 'meuCampo'
    const myClass = 'obrigatorio'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass} ${myClass}">
      ${createField({ id: fieldId, required: false })}
    </div>`

    removeRequired(fieldId, {
      toggleRequiredClass: true,
      requiredClass: myClass,
      container: `.${containerClass}`
    })

    const container = getFieldContainer(fieldId, `.${containerClass}`)

    expect(container.classList.contains(myClass)).toBeFalsy()
  })
})
