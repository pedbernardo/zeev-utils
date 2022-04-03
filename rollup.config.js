import pkg from './package.json'

export default {
  input: './src/index.js',
  output: [
    {
      file: pkg.module,
      format: 'esm'
    },
    {
      name: 'Utils',
      file: pkg.browser,
      format: 'umd'
    }
  ]
}
