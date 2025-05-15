# email
![tests](https://github.com/substrate-system/email/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate/email?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://packagephobia.com/badge?p=@substrate/email)](https://packagephobia.com/result?p=@substrate/email)
[![GZip size](https://img.badgesize.io/https%3A%2F%2Fesm.sh%2F%40substrate-system%2Fbutton%2Fes2022%2Fbutton.mjs?compression=gzip&style=flat-square)](https://esm.sh/@substrate-system/button/es2022/button.mjs)
[![GZip size](https://img.badgesize.io/https%3A%2F%2Fesm.sh%2F%40substrate-system%2Femail%2Fes2022%2Femail.mjs?compression=gzip&style=flat-square)](https://esm.sh/@substrate-system/email/es2022/email.mjs)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)

Web component for email inputs.

**_featuring:_**

* robust client-side validation -- check that email is of the form `abc@domain.tld`
* good UX for validation
  - errors are only shown if the input has been focused
  - errors are not shown until the input blurs
* add a class to the element when it is not valid


[See a live demo](https://substrate-system.github.io/email/)

<!-- toc -->

## Install

```sh
npm i -S @substrate/email
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import { email } from '@substrate/email'
```

### Common JS
```js
const { email } = require('@substrate/email')
```

## CSS

### Bundler

The `package.json` exposes css, suitable for `vite` or `esbuild`:

```js
import '@substrate/email/css'
```

Or minified:
```js
import '@substrate/email/css/min'
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
import { SubstrateButton } from '@substrate-system/button'

// create a web component named `substrate-email`
SubstrateButton.define()
```

Override the `tag` property to change the tag name:
```js
import { SubstrateButton } from '@substrate-system/button'

// set a custom name
SubstrateButton.tag = 'cool-input'

SubstrateButton.define()
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
cp ./node_modules/@substrate/email/dist/index.min.js ./public/substrate-email.min.js
cp ./node_modules/@substrate/email/dist/style.min.css ./public/substrate-email.css
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
