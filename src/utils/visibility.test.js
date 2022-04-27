/**
 * @jest-environment jsdom
 */

import { createField } from '../tests/dom'

import {
  getFieldContainer
} from './field'
import { isRequired } from './require'

import {
  showField,
  hideField,
  showGroup,
  hideGroup
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

describe('showGroup', () => {
  it('deve retornar undefined quando o parâmetro container for vazio ou não informado', () => {
    const fields = showGroup('')
    expect(fields).toBeUndefined()
  })

  it('deve retornar undefined quando o container não for encontrado', () => {
    const fields = showGroup('#containerInexistente')
    expect(fields).toBeUndefined()
  })

  it('deve retornar undefined quando o nenhum campo for encontrado', () => {
    const containerId = 'containerExistente'

    document.body.innerHTML = `<div id="${containerId}"></div>`

    const fields = showGroup(`#${containerId}`)

    expect(fields).toBeUndefined()
  })

  it('deve remover a classe auxiliar de visibilidade do container do grupo', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'
    const hideClass = 'hidden'

    document.body.innerHTML = `<div class="${containerClass} ${hideClass}">
      ${createField({ id: fieldId, required: false })}
    </div>`

    const container = document.querySelector(`.${containerClass}`)

    showGroup(`.${containerClass}`, { hideClass })

    expect(container.classList.contains(hideClass)).toBeFalsy()
  })

  it('deve re-adicionar o atributo required="S" em todos os campos com a propriedade data-was-required', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, dataWasRequired: true })}
      ${createField({ id: fieldId, dataWasRequired: true })}
      ${createField({ id: fieldId, required: false })}
    </div>`

    const fields = showGroup(`.${containerClass}`)
    const requiredFields = fields.filter(field => isRequired(field))

    expect(requiredFields.length).toBe(2)
  })
})

describe('hideGroup', () => {
  it('deve retornar undefined quando o parâmetro container for vazio ou não informado', () => {
    const fields = hideGroup('')
    expect(fields).toBeUndefined()
  })

  it('deve retornar undefined quando o container não for encontrado', () => {
    const fields = hideGroup('#containerInexistente')
    expect(fields).toBeUndefined()
  })

  it('deve retornar undefined quando o nenhum campo for encontrado', () => {
    const containerId = 'containerExistente'

    document.body.innerHTML = `<div id="${containerId}"></div>`

    const fields = hideGroup(`#${containerId}`)

    expect(fields).toBeUndefined()
  })

  it('deve adicionar a classe auxiliar de visibilidade do container do grupo', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'
    const hideClass = 'hidden'

    document.body.innerHTML = `<div class="${containerClass} ${hideClass}">
      ${createField({ id: fieldId, required: false })}
    </div>`

    const container = document.querySelector(`.${containerClass}`)

    hideGroup(`.${containerClass}`, { hideClass })

    expect(container.classList.contains(hideClass)).toBeTruthy()
  })

  it('deve remover o atributo required="S" em todos os campos obrigatórios', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, required: true })}
      ${createField({ id: fieldId, required: true })}
      ${createField({ id: fieldId, required: true })}
    </div>`

    const fields = hideGroup(`.${containerClass}`)
    const requiredFields = fields.filter(field => field.getAttribute('required') === 'S')

    expect(requiredFields.length).toBe(0)
  })

  it('deve limpar os valores de todos dos campos', () => {
    const fieldId = 'meuCampo'
    const containerClass = 'meu-container'

    document.body.innerHTML = `<div class="${containerClass}">
      ${createField({ id: fieldId, required: true, value: 'teste1' })}
      ${createField({ id: fieldId, required: true, value: 'teste2' })}
      ${createField({ id: fieldId, required: true, value: 'teste3' })}
    </div>`

    const fields = hideGroup(`.${containerClass}`)
    const requiredFields = fields.filter(field => field.value === '')

    expect(requiredFields.length).toBe(3)
  })
})
