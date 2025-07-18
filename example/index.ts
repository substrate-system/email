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
const qsa = document.querySelectorAll.bind(document)

// @ts-expect-error dev
window.qs = document.querySelector.bind(document)
// @ts-expect-error dev
window.qsa = qsa

document.getElementById('main')!.innerHTML += `
    <form class="demo-one">
        <div>
            Here the email input is not required.
        </div>

        <substrate-email label="email" name="alice" label="email" id="fooo">
        </substrate-email>
        <div id="controls">
            <substrate-button>Submit</substrate-button>
        </div>
    </form>

    <form class="demo-two">
        <div>
            Here the email input *is* required.
        </div>

        <substrate-email
            placeholder="123@abc.com"
            label="email"
            name="alice"
            label="email"
            required
            requiredmsg="Mandatory!"
        ></substrate-email>
        <div id="controls">
            <substrate-button disabled>Submit</substrate-button>
        </div>
    </form>
`

const input = qs('form.demo-one substrate-email')
// @ts-expect-error dev
window.input = input

const forms = qsa('form')
forms.forEach(form => {
    form.addEventListener('submit', ev => {
        ev.preventDefault()
    })
})

input?.addEventListener('valid', ev => {
    debug('We are valid!', ev)
    qs('substrate-button')!.disabled = false
})

input?.addEventListener('invalid', ev => {
    debug('no longer valid....', ev)
    qs('substrate-button')!.disabled = true
})

const inputTwo = qs('form.demo-two substrate-email')
inputTwo?.addEventListener('valid', (ev) => {
    debug('form two is valid!', ev);
    (qs('.demo-two substrate-button') as SubstrateButton).disabled = false
})

inputTwo?.addEventListener('invalid', ev => {
    debug('form two is invalid......', ev);
    (qs('.demo-two substrate-button') as SubstrateButton).disabled = true
})
