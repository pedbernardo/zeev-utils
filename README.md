[![](https://data.jsdelivr.com/v1/package/gh/pedbernardo/zeev-utils/badge)](https://www.jsdelivr.com/package/gh/pedbernardo/zeev-utils)
[![Node version](https://img.shields.io/node/v/zeev-utils.svg?style=flat)](http://nodejs.org/download/zeev-utils)
# 📎 Zeev Utils
Biblioteca utilitária de javascript para interagir com formulários no Zeev

## Instalação
Utilizando package managers

```bash
npm install zeev-utils

# ou com yarn

yarn add zeev-utils
```

Utilizando CDN
```html
<script src="https://cdn.jsdelivr.net/gh/pedbernardo/orquestra-utils@latest/dist/zeev-utils.js"></script>

<!-- ou minificado -->

<script src="https://cdn.jsdelivr.net/gh/pedbernardo/orquestra-utils@latest/dist/zeev-utils.min.js"></script>
```


## Como Utilizar

```js
// importe todas as funções com namespace
import Utils from 'zeev-utils'

Utils.showField('meuCampo')

// importe as funções separadamente
import { showField, hideField } from 'zeev-utils'

showField('meuCampo')
```

## Configuração

**Configuração Padrão**
```js
const config = {
  container: 'tr',
  hideClass: 'hidden',
  toggleRequiredClass: false,
  requiredClass: 'execute-required',
  requiredAttribute: 'data-was-required'
}
```
## Construtor

### Como modificar os parâmetros padrão?
Ao importar a biblioteca (seja através da CDN ou NPM) ela irá dispor das funções utilitárias com a configuração padrão acima. Embora os métodos permitam que a configuração seja redefinida nos parâmetros, você pode utilizar o construtor para criar uma nova instância com os parâmetros desejados de forma fixa.
<br>

### `setup`
Cria uma nova instância de Utils com os parâmetros padrão que desejar

> _Utils.setup( Object )_

**Exemplo de uso**
```js
const UtilsForm = Utils.setup({
  container: '.form-group',
  hideClass: 'is-hidden',
  requiredClass: 'is-required',
})

UtilsForm.hideField(document.querySelector('[xname=inpfieldId]'))
```

> Importante perceber que ao utilizar o construtor os métodos não irão suportar o objeto de configuração dos parâmetros, utilizando sempre a configuração do setup.

<br>

## Métodos

### `showField`
Exibe um campo de formulário e recoloca sua obrigatoriedade (caso possua)

> _Utils.showField( string | HTMLElement | Node, Object [optional] )_

**Exemplo de uso**
```js
Utils.showField('meuCampoId')
Utils.showField(document.querySelector('[xname=inpmeuCampoId]'), { container: '.group' })
```

<br>

### `hideField`
Oculta um campo de formulário, limpa o seu valor e remove sua obrigatoriedade (caso possua)

> _Utils.hideField( string | HTMLElement | Node, Object [optional] )_

**Exemplo de uso**
```js
Utils.hideField('meuCampoId')
Utils.hideField(document.querySelector('[xname=inpmeuCampoId]'), { container: '.group' })
```

<br>

### `showGroup`
Exibe um conjunto de campos de formulário a partir do seu container e recoloca sua obrigatoriedade (caso possuam)

> _Utils.showGroup( string | HTMLElement | Node, Object [optional] )_

**Exemplo de uso**
```js
Utils.showGroup('.meu-grupo-de-campos')
Utils.showGroup(document.querySelector('.meu-grupo-de-campos'))
```

<br>

### `hideGroup`
Oculta um conjunto de campos de formulário a partir do seu container, limpando todos os valores e removendo a obrigatoriedade (caso possuam)

> _Utils.hideGroup( string | HTMLElement | Node, Object [optional] )_

**Exemplo de uso**
```js
Utils.hideGroup('.meu-grupo-de-campos')
Utils.hideGroup(document.querySelector('.meu-grupo-de-campos'))
```

<br>

### `isRequired`
Verifica se um campo de formulário é obrigatório, observando também a propriedade especial `data-was-required` em campos obrigatórios ocultados, ainda que estejam com a propriedade `required=N`

> _Utils.isRequired( string | HTMLElement | Node)_

**Exemplo de uso**
```js
Utils.isRequired('meuCampoId')
Utils.isRequired(document.querySelector('[xname=inpmeuCampoId]'))
```

<br>

### `addRequired`
Adiciona obrigatoriedade a um campo de formulário

> _Utils.showField( string | HTMLElement | Node)_

**Exemplo de uso**
```js
Utils.addRequired('meuCampoId')
Utils.addRequired(document.querySelector('[xname=inpmeuCampoId]'))
```

<br>

### `removeRequired`
Remove obrigatoriedade de um campo de formulário

> _Utils.showField( string | HTMLElement | Node)_

**Exemplo de uso**
```js
Utils.removeRequired('meuCampoId')
Utils.removeRequired(document.querySelector('[xname=inpmeuCampoId]'))
```

<br>

### `clearField`
Limpa os valores de um campo de formulário

> _Utils.showField( string | HTMLElement | Node)_

**Exemplo de uso**
```js
Utils.clearField('meuCampoId')
Utils.clearField(document.querySelector('[xname=inpmeuCampoId]'))
```

<br>

### `onFileChange`
Trigger disparado quando um campo do tipo **Arquivo** é modificado

> _Utils.onFileChange( string | HTMLElement | Node, function [callback] )_

**Callbacks**
> **Adição de Arquivo** _Callback( string [filepath], HTMLElement [delete button] )_ <br>
> **Remoção de Arquivo** _Callback( null )_ 
 
**Exemplo de uso**
```js
Utils.onFileChange('meuCampoId', (filepath, deleteBtn) => {
  console.log({ filepath, deleteBtn })
})
```

<br>

### `getField`
Busca campos de formulário do Zeev, podendo ser a partir do seu identificador, com ou sem o prefixo `inp`

> _Utils.getField( string | HTMLElement | Node, Object [optional] )_

**Exemplo de uso**
```js
Utils.getField('meuCampoId')
Utils.getField('inpmeuCampoId')
Utils.getField(document.querySelector('[xname=inpmeuCampoId]'))

// retorna array mesmo que seja apenas um campo
Utils.getField('fieldId', { returnArray: true })
```

<br>

### `getFieldContainer`
Busca o container de um campo de formulário do Zeev

> _Utils.getFieldContainer( string | HTMLElement | Node, String)_

**Exemplo de uso**
```js
Utils.getFieldContainer('fieldId', '.form-group')
Utils.getFieldContainer(document.querySelector('[xname=inpfieldId]'), '.form-group')
```

<br>

### `getFieldValue`
Retorna o(s) valor(es) selecionado(s) de um campo de formulário

> _Utils.getFieldValue( string | HTMLElement | Node)_

**Exemplo de uso**
```js
Utils.getFieldValue('meuCampoTexto')                // 'valor do campo' ou ''
Utils.getFieldValue('meuCampoCaixaSelecao')         // 'valor do campo' ou ''
Utils.getFieldValue('meuCampoAreaTexto')            // 'valor do campo' ou ''
Utils.getFieldValue('meuCampoHidden')               // 'valor do campo' ou ''
Utils.getFieldValue('meuCampoArquivo')              // 'url pública do arquivo' ou ''
Utils.getFieldValue('meuCampoRadio')                // 'valor da opção selecionada'
Utils.getFieldValue('meuCampoCheckbox')             // ['opção A selecionada', 'opção B selecionada'] ou []
Utils.getFieldValue('meuCampoTextoEmMultivalorada') // ['valor linha 1', 'valor linha 2'] ou ['', '']
```
