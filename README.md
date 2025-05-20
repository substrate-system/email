# email
![tests](https://github.com/substrate-system/email/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/email?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/email?cache-control=no-cache)](https://packagephobia.com/result?p=@bicycle-codes/keys)
[![GZip size](https://img.badgesize.io/https%3A%2F%2Fesm.sh%2F%40substrate-system%2Femail%2Fes2022%2Femail.mjs?compression=gzip&style=flat-square)](https://esm.sh/@substrate-system/email/es2022/email.mjs)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Polyform_Small_Business-249fbc?style=flat-square)](LICENSE)


Web component for email inputs.

**_featuring:_**

* robust client-side validation -- check that email is of the form `abc@domain.tld`
* good UX for validation
  - errors are only shown if the input has been focused
  - errors are not shown until the input blurs
* add a class to the element when it is not valid
* emit `valid` and `invalid` events when the input's value changes validity


[See a live demo](https://substrate-system.github.io/email/)

<!-- toc -->

- [Install](#install)
- [API](#api)
  * [ESM](#esm)
  * [Common JS](#common-js)
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

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import { email } from '@substrate-system/email'
```

### Common JS
```js
const { email } = require('@substrate-system/email')
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
SubstrateEmail.tag = 'cool-input'

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
