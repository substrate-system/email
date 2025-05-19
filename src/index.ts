import { signal, computed, effect } from 'alien-signals'
import { Input } from '@substrate-system/input'

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'substrate-email': SubstrateEmail
    }
}

export class SubstrateEmail extends Input {
    static observedAttributes = ['name', 'disabled']
    static tag = 'substrate-email'

    _email
    _shouldShowErr
    _prev:{ emailOk:boolean|null }

    constructor () {
        super()
        this._email = {
            hasValue: signal(false),
            emailOk: signal(false),
            hasFocused: signal(false),
            hasBlurred: signal(false)
        }

        this._shouldShowErr = computed<boolean>(() => {
            return (
                this._email.hasFocused() &&
                this._email.hasBlurred() &&
                this._email.emailOk() === false
            )
        })

        // show error UI
        effect(() => {
            if (!this._shouldShowErr()) {
                return this.unRenderError()
            }

            // else, show the error message
            this.renderError()
        })

        this._prev = {
            emailOk: null  // null means it has not been set yet
        }

        // emit events
        // call this whenever emailOk changes
        // that is, whenever validity changes
        effect(() => {
            const ok = this._email.emailOk()
            if (!ok && this._prev.emailOk) {
                this.dispatchEvent(new CustomEvent('invalid'))
            }

            if (ok && this._prev.emailOk === false) {
                this.dispatchEvent(new CustomEvent('valid'))
            }

            this._prev.emailOk = ok
        })
    }

    get label () {
        return this.getAttribute('label')
    }

    get hasValue ():boolean {
        return !!(this.input?.value)
    }

    /**
     * @see {@link https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/#organizing-your-code Go Make Things article}
     */
    handleChange_name (_oldValue, newValue) {
        if (!this.input) return
        this.input.name = newValue
    }

    connectedCallback () {
        this.render()
        const input = this.input

        input?.addEventListener('blur', () => {
            this._email.hasBlurred(true)
        })

        input?.addEventListener('focus', () => {
            this._email.hasFocused(true)
        })

        input?.addEventListener('input', (ev) => {
            const email = (ev.target as HTMLInputElement).value

            if (this.hasAttribute('required') && !email) {
                this._email.emailOk(false)
            }

            const isOk = isValid(email, this.hasAttribute('required'))
            if (isOk !== this._email.emailOk()) {
                this._email.emailOk(isOk)
            }
        })
    }

    get isValid ():boolean {
        if (this.hasAttribute('required')) {
            return !!(this.input?.value && isValid(this.input.value, true))
        } else {
            // is not required
            if (!this.input?.value) {
                return true
            }
            return isValid(this.input!.value, false)
        }
    }

    unRenderError () {
        const email = this.querySelector('input')
        const label = this.querySelector('label')

        email?.classList.remove('error')
        email?.setAttribute('aria-invalid', 'false')
        label?.classList.remove('error')
        if (this.classList.contains('error')) {
            // if there is an error message, then remove it
            label?.removeChild(label.lastChild!)
            this.classList.remove('error')
        }
    }

    renderError () {
        const email = this.querySelector('input')
        const label = this.querySelector('label')
        let msg
        if (this.hasAttribute('required')) {
            if (!this.hasValue) {
                msg = this.getAttribute('requiredmsg') || 'Email is required.'
                email?.classList.add('error')
                email?.setAttribute('aria-invalid', 'true')
            } else {
                // is required, and has value, but the value is invalid
                email?.classList.add('error')
                label?.classList.add('error')
                email?.setAttribute('aria-invalid', 'true')
                msg = (this.getAttribute('errormsg') ||
                    'Please use a valid email address.')
            }
        } else {
            // not required, but should show error
            email?.classList.add('error')
            label?.classList.add('error')
            email?.setAttribute('aria-invalid', 'true')
            msg = (this.getAttribute('errormsg') ||
                'Please use a valid email address.')
        }

        const el = label?.querySelector('.error')
        if (el) {
            el.innerHTML = msg
        } else {
            label?.insertAdjacentHTML(
                'beforeend',
                `<span class="error">${msg}</span>`
            )
        }

        this.classList.add('error')
    }

    render ():void {
        this.innerHTML = `
            <label>
                <span>${this.label}</span>
            </label>
            ${super.render()}
        `
    }
}

export function isValid (email:string, required:boolean = true):boolean {
    if (!email && !required) return true
    const parts = email.split('.')

    return (email.split('@').length === 2 &&
        parts.length > 1 &&
        parts.reduce((ok, part) => {
            // no consecutive dots, no start or end with dot
            return !!(ok && part)
        }, true)
    )
}
