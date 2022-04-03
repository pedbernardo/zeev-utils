import { config } from './config'

import {
  getField,
  getFieldContainer,
  getFieldValue,
  clearField,
  onFileChange
} from './utils/field'

import {
  isRequired,
  addRequired,
  removeRequired
} from './utils/require'

import {
  showField,
  hideField
} from './utils/visibility'

function setup (options) {
  options = {
    ...config,
    ...options
  }

  const addRequired = field => addRequired(field, options)
  const removeRequired = field => removeRequired(field, options)
  const showField = field => showField(field, options)
  const hideField = field => hideField(field, options)

  return {
    getField,
    getFieldContainer,
    getFieldValue,
    clearField,
    onFileChange,
    isRequired,
    addRequired,
    removeRequired,
    showField,
    hideField
  }
}

export {
  setup,
  getField,
  getFieldContainer,
  getFieldValue,
  clearField,
  onFileChange,
  isRequired,
  addRequired,
  removeRequired,
  showField,
  hideField
}
