/**
 * @jest-environment jsdom
 */

import { createField } from '../tests/dom'

import {
  getField,
  getFieldContainer,
  getFieldValue,
  clearField,
  onFileChange
} from './field'

describe('getField', () => {
  it('deve retornar nulo quando o parâmetro for vazio', () => {
    const field = getField('')
    expect(field).toBeNull()
  })

  it('deve retornar nulo quando nenhum campo for encontrado', () => {
    const field = getField('meuCampoQueNaoExiste')
    expect(field).toBeNull()
  })

  it('deve retornar um elemento quando houver apenas um campo', () => {
    const fieldId = 'meuCampoUnico'

    document.body.innerHTML = createField({ id: fieldId })

    const field = getField(fieldId)

    expect(field.getAttribute('xname')).toBe(`inp${fieldId}`)
  })

  it('deve retornar um array quando utilizado o parâmetro returnArray', () => {
    const fieldId = 'meuCampoUnico'

    document.body.innerHTML = createField({ id: fieldId })

    const field = getField(fieldId, { returnArray: true })

    expect(field).toBeInstanceOf(Array)
  })

  it('deve retornar um array de elementos quando houver mais de um campo', () => {
    const fieldId = 'meuCampoMultiplo'

    document.body.innerHTML = createField({ id: fieldId, length: 3 })

    const field = getField(fieldId)

    expect(field.length).toBe(3)
  })

  it('deve retornar um elemento quando selecionado a partir de querySelector', () => {
    const fieldId = 'meuCampoQuerySelector'

    document.body.innerHTML = createField({ id: fieldId })

    const $field = document.querySelector(`[xname=inp${fieldId}]`)
    const field = getField($field)

    expect(field.getAttribute('xname')).toBe(`inp${fieldId}`)
  })

  it('deve retornar um array de elementos quando selecionado a partir de querySelectorAll', () => {
    const fieldId = 'meuCampoMultiplo'

    document.body.innerHTML = createField({ id: fieldId })

    const $field = document.querySelectorAll(`[xname=inp${fieldId}]`)
    const field = getField($field)

    expect(field.length).toBe(1)
  })
})

describe('getFieldContainer', () => {
  it('deve retornar nulo quando o parâmetro field for vazio', () => {
    const container = getFieldContainer('')
    expect(container).toBeNull()
  })

  it('deve retornar nulo quando o parâmetro containerSelector for vazio', () => {
    const container = getFieldContainer('')
    expect(container).toBeNull()
  })

  it('deve retornar nulo quando o nenhum container for encontrado a partir do campo', () => {
    const flatFieldId = 'meuCampoMultiplo'

    document.body.innerHTML = createField({ id: flatFieldId })

    const container = getFieldContainer(flatFieldId, '.containerInexistente')

    expect(container).toBeNull()
  })

  it('deve retornar o container a partir do campo informado', () => {
    const fieldId = 'meuCampo'
    const containerId = 'meuContainer'

    document.body.innerHTML = `<div class="${containerId}">${createField({ id: fieldId })}</div>`

    const container = getFieldContainer(fieldId, `.${containerId}`)

    expect(container.getAttribute('class')).toBe(containerId)
  })
})

describe('getFieldValue', () => {
  it('deve retornar undefined quando o parâmetro field for vazio', () => {
    const value = getFieldValue('')
    expect(value).toBeUndefined()
  })

  it('deve retornar o valor de um campo type text informado', () => {
    const fieldId = 'meuCampoTexto'
    const fieldValue = 'valor do campo'

    document.body.innerHTML = createField({ id: fieldId, type: 'text', value: fieldValue })

    const value = getFieldValue(fieldId)

    expect(value).toBe(fieldValue)
  })

  it('deve retornar um array de valores quando o houverem múltiplos campos do type text', () => {
    const fieldId = 'meuCampoTextoMultiplo'
    const fieldValue = 'valor do campo'

    document.body.innerHTML = createField({ id: fieldId, type: 'text', value: fieldValue, length: 3 })

    const values = getFieldValue(fieldId)

    expect(values.length).toBe(3)
  })

  it('deve retornar o valor de um campo type radio informado', () => {
    const fieldId = 'meuCampoRadio'
    const fieldValue = 'valor do campo'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'radio',
      value: fieldValue,
      length: 5
    })

    const value = getFieldValue(fieldId)

    expect(value).toBe(fieldValue)
  })

  it('deve retornar nulo quando um campo type radio não tiver nenhum valor selecionado', () => {
    const fieldId = 'meuCampoRadio'
    const fieldValue = 'valor do campo'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'radio',
      value: fieldValue,
      length: 5,
      checked: false
    })

    const value = getFieldValue(fieldId)

    expect(value).toBeNull()
  })

  it('deve retornar um array de valores selecionados (checked) de um campo type checkbox', () => {
    const fieldId = 'meuCampoCheckbox'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'checkbox',
      length: 3,
      checkeds: 2,
      values: ['valorA', 'valorB', 'valorC']
    })

    const values = getFieldValue(fieldId)

    expect(values.join(',')).toBe('valorA,valorB')
  })

  it('deve retornar um array vazio quando nenhum campo estiver selecionado com type checkbox', () => {
    const fieldId = 'meuCampoCheckbox'
    const fieldValue = 'valor do campo'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'checkbox',
      value: fieldValue,
      length: 3,
      checked: false
    })

    const values = getFieldValue(fieldId)

    expect(values.length).toBe(0)
  })
})

describe('clearField', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const value = clearField('')
    expect(value).toBeUndefined()
  })

  it('deve limpar o valor de um campo baseado em valor', () => {
    const fieldId = 'meuCampoTexto'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'text',
      value: 'valor do campo'
    })

    clearField(fieldId)

    const value = getFieldValue(fieldId)

    expect(value).toBe('')
  })

  it('deve limpar o valor de um campo type radio ', () => {
    const fieldId = 'meuCampoRadio'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'radio',
      value: 'valor do campo',
      length: 5
    })

    clearField(fieldId)

    const value = getFieldValue(fieldId)

    expect(value).toBeNull()
  })

  it('deve limpar o valor de um campo type checkbox', () => {
    const fieldId = 'meuCampoRadio'

    document.body.innerHTML = createField({
      id: fieldId,
      type: 'checkbox',
      value: 'valor do campo',
      length: 5,
      checkeds: 3
    })

    clearField(fieldId)

    const value = getFieldValue(fieldId)

    expect(value.length).toBe(0)
  })

  /**
   * @todo
   * - deve remover o anexo e limpar o campo do tipo arquivo
   */
})

describe('onFileChange', () => {
  it('deve retornar undefined quando o parâmetro field for vazio ou não informado', () => {
    const value = onFileChange('')
    expect(value).toBeUndefined()
  })

  it('deve retornar undefined quando o parâmetro callback não for uma função', () => {
    const value = onFileChange('campo', 10)
    expect(value).toBeUndefined()
  })

  /**
   * @todo
   * - deve chamar a função de callback ao adicionar um arquivo
   * - deve chamar a função de callback ao remover um arquivo
   * - deve injetar o filepath como parâmetro do callback ao adicionar arquivos
   * - deve injetar o botão de remoção do anexo como parâmetro do callback ao adicioanr arquivos
   */
})
