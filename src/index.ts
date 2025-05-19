import { Input } from '@substrate-system/input'
import { createDebug } from '@substrate-system/debug'
const debug = createDebug()

// for docuement.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'substrate-email': SubstrateEmail
    }
}

export class SubstrateEmail extends Input {
    // Define the attributes to observe
    // need this for `attributeChangedCallback`
    static observedAttributes = ['name', 'id']
    static tag = 'substrate-email'

    hasFocused:boolean
    hasBlurred:boolean
    _shouldErr:boolean = false

    constructor () {
        super()
        this.hasFocused = false
        this.hasBlurred = false
    }

    get label () {
        return this.getAttribute('label')
    }

    get hasValue ():boolean {
        return !!(this.input?.value)
    }

    // /**
    //  * @see {@link https://gomakethings.com/how-to-detect-when-attributes-change-on-a-web-component/#organizing-your-code Go Make Things article}
    //  */
    // handleChange_name (_oldValue, newValue) {
    //     if (!this.input) return
    //     this.input.name = newValue
    // }

    /**
     * Runs when the value of an observed attribute is changed
     *
     * @param  {string} name     The attribute name
     * @param  {string} oldValue The old attribute value
     * @param  {string} newValue The new attributhis, te value
     */
    attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        const handler = this[`handleChange_${name}`];
        (handler && handler.call(this, oldValue, newValue))
        this.render()
    }

    disconnectedCallback () {
        debug('disconnected')
    }

    connectedCallback () {
        this.render()
        const input = this.input
        input?.addEventListener('blur', () => {
            this.hasBlurred = true
            this._showError()
        })

        input?.addEventListener('focus', () => {
            this.hasBlurred = false
            this.hasFocused = true
            this._showError()
        })

        input?.addEventListener('input', () => {
            this._showError()
        })
    }

    get isValid ():boolean {
        if (this.hasAttribute('required')) {
            return !!(this.input?.value && isValid(this.input.value))
        } else {
            // is not required
            if (!this.input?.value) {
                return true
            }
            return isValid(this.input!.value)
        }
    }

    _shouldShowError ():boolean {
        this._shouldErr = (
            !this.isValid &&
            this.hasFocused &&
            this.hasBlurred
        )

        return this._shouldErr
    }

    _showError () {
        const email = this.querySelector('input')
        const label = this.querySelector('label')
        const shouldErr = this._shouldShowError()

        if (!shouldErr) {
            // don't show an error
            email?.classList.remove('error')
            label?.classList.remove('error')
            if (this.classList.contains('error')) {
                // if there is an error message, then remove it
                label?.removeChild(label.lastChild!)
                this.classList.remove('error')
            }

            return
        }

        // else, shouldErr is true; we are invalid, should show message
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

// // check email validity
// email?.addEventListener('input', (ev) => {
//     const input = ev.currentTarget as HTMLInputElement
//     const email = input?.value.trim()
//     if (!email) {
//         startBatch()
//         emailHasValue(false)
//         emailOk(false)
//         endBatch()
//     }
//     const parts = email.split('.')

//     const isValid = (
//         email.split('@').length === 2 &&
//         parts.length > 1 &&
//         parts.reduce((ok, part) => {
//             // no consecutive dots, no start or end with dot
//             return !!(ok && part)
//         }, true)
//     )

//     if (isValid !== emailOk()) {
//         startBatch()
//         emailHasValue(!!email)
//         emailOk(isValid)
//         endBatch()
//     }

//     emailHasValue(!!email)
// })

export function isValid (email:string):boolean {
    const parts = email.split('.')

    return (email.split('@').length === 2 &&
        parts.length > 1 &&
        parts.reduce((ok, part) => {
            // no consecutive dots, no start or end with dot
            return !!(ok && part)
        }, true)
    )
}
