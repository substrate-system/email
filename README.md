# email
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/email/nodejs.yml?style=flat-square)](https://github.com/substrate-system/email/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/email?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/email?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/email)
[![GZip size](https://img.shields.io/bundlephobia/minzip/@substrate-system/email?style=flat-square)](https://bundlephobia.com/package/@substrate-system/email)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


Web component for email inputs.

**_featuring:_**

* robust client-side validation -- check that email is of the form `abc@domain.tld`
* good UX for validation
  - errors are only shown if the input has been focused
  - errors are not shown until the input blurs
* add a class to the element when it is not valid
* emit `valid` and `invalid` events when validity changes


[See a live demo](https://substrate-system.github.io/email/)

<!-- toc -->

- [Install](#install)
- [Modules](#modules)
  * [ESM](#esm)
  * [Common JS](#common-js)
- [Example](#example)
- [CSS](#css)
  * [Bundler](#bundler)
  * [CSS imports](#css-imports)
  * [Customize CSS via some variables](#customize-css-via-some-variables)
- [Use](#use)
  * [HTML](#html)
  * [pre-built](#pre-built)

<!-- tocstop -->

## Install

```sh
npm i -S @substrate-system/email
```

## Modules

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import { email } from '@substrate-system/email'
```

### Common JS
```js
const { email } = require('@substrate-system/email')
```

## Example

See [./example](./example/), and [the demo page](https://substrate-system.github.io/email/).

```js
import { SubstrateEmail } from '@substrate-system/email'
import { SubstrateButton } from '@substrate-system/button'
SubstrateEmail.define()
SubstrateButton.define()
const qs = document.querySelector

const input = qs('form substrate-email')
input?.addEventListener('valid', ev => {
    console.log('We are valid!', ev)
    qs('substrate-button')!.disabled = false
})

input?.addEventListener('invalid', ev => {
    console.log('no longer valid....', ev)
    qs('substrate-button')!.disabled = true
})
```

## CSS

### Bundler

The `package.json` exposes css, suitable for `vite` or `esbuild`:

```js
import '@substrate-system/email/css'
```

Or minified:
```js
import '@substrate-system/email/css/min'
```

### CSS imports

If using a CSS processor, you can import from the CSS files:
```css
@import url("../node_modules/@substrate-system/email/dist/index.min.css");
```

### Customize CSS via some variables

```css
substrate-email {
    --bgc: #fafafa;
    --color: black;
    --focus: #005fcc;
    --error-color: red;
}
```

------------------------------------------------------------------------

## Use
You can set a name for this custom element with the static method
`define`. To use the default name, `substrate-email`, just import and
call `.define()`.

> [!CAUTION]  
> If you change the name of the web component, it will break the CSS.


```js
import { SubstrateEmail } from '@substrate-system/email'

// create a web component named `substrate-email`
SubstrateEmail.define()
```

Override the `tag` property to change the tag name:
```js
import { SubstrateEmail } from '@substrate-system/email'

// set a custom name
SubstrateEmail.TAG = 'cool-input'

SubstrateEmail.define()
```

### HTML
```html
<div>
    <substrate-email></substrate-email>
</div>
```

### pre-built
This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/email/dist/index.min.js ./public/substrate-email.min.js
cp ./node_modules/@substrate-system/email/dist/style.min.css ./public/substrate-email.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./substrate-email.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./substrate-email.min.js"></script>
</body>
```
