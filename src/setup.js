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
  hideField,
  showGroup,
  hideGroup
} from './utils/visibility'

export function setup (options) {
  const overriddenOptions = {
    ...config,
    ...options
  }

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
