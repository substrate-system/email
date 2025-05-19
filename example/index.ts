import { SubstrateButton } from '@substrate-system/button'
import { SubstrateEmail } from '../src/index.js'
import './style.css'
import '../src/index.css'
import '@substrate-system/css-normalize'
import '@substrate-system/button/css'
import Debug from '@substrate-system/debug'
const debug = Debug()

SubstrateEmail.define()
SubstrateButton.define()
const qs = document.querySelector.bind(document)

// @ts-expect-error dev
window.qs = document.querySelector.bind(document)

document.getElementById('main')!.innerHTML += `
    <form>
        <substrate-email label="email" name="alice" label="email"></substrate-email>
        <div id="controls">
            <substrate-button disabled>Submit</substrate-button>
        </div>
    </form>
`

const input = qs('substrate-email')
debug('the email input', input)

input?.addEventListener('valid', ev => {
    debug('We are valid!', ev)
})

input?.addEventListener('invalid', ev => {
    debug('no longer valid....', ev)
})
