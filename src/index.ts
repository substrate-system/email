import { signal, computed, effect } from 'alien-signals'
import { Input } from '@substrate-system/input'
// import Debug from '@substrate-system/debug'
// const debug = Debug()

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'substrate-email': SubstrateEmail
    }
}

export class SubstrateEmail extends Input {
    static observedAttributes = ['name', 'disabled']
    static TAG = 'substrate-email'

    _email:{
        hasValue:ReturnType<typeof signal<boolean>>;
        emailOk:ReturnType<typeof signal<boolean>>;
        hasFocused:ReturnType<typeof signal<boolean>>;
        hasBlurred:ReturnType<typeof signal<boolean>>;
        isFocused:ReturnType<typeof signal<boolean>>;
    }

    _shouldShowErr:ReturnType<typeof computed<boolean>>
    _hasInput:boolean = false
    _lastEvent:'invalid'|'valid'|null = null

    constructor () {
        super()
        this._email = {
            hasValue: signal(false),
            emailOk: signal<boolean>(this.isValid),
            hasFocused: signal(false),
            hasBlurred: signal(false),
            isFocused: signal(false)
        }

        this._shouldShowErr = computed<boolean>(() => {
            return (
                this._email.hasFocused() &&
                this._email.hasBlurred() &&
                this._email.emailOk() === false &&
                !(this._email.isFocused())
            )
        })

        // non-required email input
        // if it has a value, and is invalid,
        // then emit an 'invalid' event when it changes from valid to invalid
        // that is, when you enter some text

        // show error UI
        effect(() => {
            if (!this._shouldShowErr()) {
                return this.unRenderError()
            }

            // else, show the error message
            this.renderError()
        })

        // emit events
        // call this whenever emailOk changes
        // that is, whenever validity changes
        effect(() => {
            const ok = this._email.emailOk()

            if (!ok && this._lastEvent === 'valid') {
                // if we are invalid, and previously were valid
                this.dispatchEvent(new CustomEvent('invalid'))
                this._lastEvent = 'invalid'
            }

            if (ok && this._lastEvent === 'invalid') {
                // valid, and previously were invalid
                this.dispatchEvent(new CustomEvent('valid'))
                this._lastEvent = 'valid'
            }

            if (this._lastEvent === null) {
                const value = ok ? 'valid' : 'invalid'
                const ev = new CustomEvent(value)
                this.dispatchEvent(ev)
                this._lastEvent = value
            }
        })
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
        if (!this.innerHTML) {
            this.render()
        }
        const input = this.input

        input?.addEventListener('blur', () => {
            this._email.hasBlurred(true)
            this._email.isFocused(false)
        })

        input?.addEventListener('focus', () => {
            this._email.hasFocused(true)
            this._email.isFocused(true)
        })

        input?.addEventListener('input', (ev) => {
            const email = (ev.target as HTMLInputElement).value

            if (!this._hasInput) this._hasInput = true

            if (this.hasAttribute('required') && !email) {
                this._email.emailOk(false)
            }

            const isOk = isValid(email, this.hasAttribute('required'))

            // if validity does not match current validity, then set it
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
            return isValid(this.input?.value, false)
        }
    }

    /**
     * Remove error message.
     */
    unRenderError () {
        const email = this.querySelector('input')
        const label = this.querySelector('label')

        email?.classList.remove('error')
        email?.setAttribute('aria-invalid', 'false')
        label?.classList.remove('error')
        if (this.classList.contains('error')) {
            // if there is an error message, then remove it
            const msg = label?.querySelector('span.errormsg')
            msg?.remove()
            this.classList.remove('error')
        }
    }

    renderError () {
        const email = this.querySelector('input')
        const label = this.querySelector('span.label')
        let msg
        if (this.hasAttribute('required')) {
            if (!this.hasValue) {
                msg = this.getAttribute('requiredmsg') || 'Email is required.'
                email?.classList.add('error')
                label?.classList.add('error')
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

        const el = label?.querySelector('.errormsg')
        if (el) {
            el.innerHTML = msg
        } else {
            label!.innerHTML += `<span class="errormsg">${msg}</span>`
        }

        this.classList.add('error')
    }

    render ():void {
        this.innerHTML = `
            <label>
                <span class="label">${this.getAttribute('label')}</span>
                ${super.render()}
            </label>
        `

        const el = this.querySelector('input')
        el?.setAttribute('aria-invalid', '' + !this.isValid)
    }
}

export function isValid (email:string, required:boolean = true):boolean {
    if (!email && !required) return true
    const parts = email.split('.')

    return (email.split('@').filter(Boolean).length === 2 &&
        parts.flatMap(part => part.split('@')).filter(Boolean).length > 2 &&
        parts.length > 1 &&
        parts.reduce((ok, part) => {
            // no consecutive dots, no start or end with dot
            return !!(ok && part)
        }, true)
    )
}
