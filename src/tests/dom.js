const createInput = config => `
<input
  xname="inp${config.id}"
  type="${config.type}"
  value="${config.value}"
  ${config.required === true
      ? 'required="S"'
      : config.required === false
        ? 'required="N"'
        : ''
  }
  ${config.checked ? 'checked' : ''}
  ${config.dataWasRequired ? 'data-was-required' : ''}
>
`

export const createField = props => {
  if (!props.id) return

  const config = {
    type: 'text',
    value: '',
    values: [],
    length: 1,
    required: false,
    ...props
  }

  const checkedUntilIndex = (config.checkeds || 0) - 1

  const input = createInput(config)

  if (config.length > 1) {
    return Array.from({ length: config.length })
      .fill(null)
      .map((_, i) => {
        const value = config.values[i] || config.value
        const input = createInput({ ...config, value })

        if (config.checked === false) {
          return input
        }
        if (config.type === 'checkbox' && i <= checkedUntilIndex) {
          return createInput({ ...config, value, checked: true })
        }
        if (config.type === 'radio' && i === 0) {
          return createInput({ ...config, value, checked: true })
        }

        return input
      })
      .join('')
  }

  return input
}
