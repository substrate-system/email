import { test } from '@substrate-system/tapzero'
import { waitFor, sleep } from '@substrate-system/dom'
import { SubstrateEmail, isValid } from '../src/index.js'

let el:SubstrateEmail

test('Input renders', async t => {
    t.plan(2)
    SubstrateEmail.define()

    document.body.innerHTML += `
        <substrate-email class="test" name="test">
        </substrate-email>
    `

    el = await waitFor('substrate-email') as SubstrateEmail
    t.ok(el, 'should find an element')

    const input = await waitFor('substrate-email input')
    t.ok(input, 'should find nested input')
})

test('Attributes', async t => {
    t.equal(el.disabled, false, 'Can access `.disabled`, and it returns a boolean')
})

test('Email validation function', async t => {
    t.plan(7)

    // Valid emails
    t.equal(isValid('test@example.com', true), true,
        'Valid email passes validation')
    t.equal(isValid('name.last@domain.co.uk', true), true,
        'Complex valid email passes validation')

    // Invalid emails
    t.equal(isValid('not-an-email', true), false,
        'String without @ fails validation')
    t.equal(isValid('missing@.com', true), false,
        'Email with missing domain part fails validation')
    t.equal(isValid('@domain.com', true), false,
        'Email with missing username fails validation')
    t.equal(isValid('user@domain', true), false,
        'Email without TLD fails validation')

    // Empty with required=false
    t.equal(isValid('', false), true,
        'Empty email with required=false is considered valid')
})

test('Required attribute behavior', async t => {
    t.plan(3)

    // Clear previous elements
    document.body.innerHTML = ''

    // Create a required email input
    document.body.innerHTML += `
        <substrate-email required label="Required Email" name="tester">
        </substrate-email>
    `

    const requiredEl = await waitFor('substrate-email') as SubstrateEmail
    t.ok(requiredEl.hasAttribute('required'), 'Element has required attribute')

    // Check initial validity (should be invalid because it's required but empty)
    t.equal(requiredEl.isValid, false, 'Required email with no value is invalid')

    // Add value and check again
    const input = requiredEl.querySelector('input') as HTMLInputElement
    input.value = 'test@example.com'
    const event = new Event('input')
    input.dispatchEvent(event)

    t.equal(requiredEl.isValid, true, 'Required email with valid value is valid')
})

test('Error display logic', async t => {
    t.plan(5)

    // Clear previous elements
    document.body.innerHTML = ''

    document.body.innerHTML += `
        <substrate-email label="Test Email" name="abc">
        </substrate-email>
    `

    const emailEl = await waitFor('substrate-email') as SubstrateEmail
    const input = emailEl.querySelector('input') as HTMLInputElement

    // Initially no error should be shown
    t.equal(emailEl.classList.contains('error'), false, 'No error class initially')

    // Type invalid email but don't blur yet - should not show error
    input.value = 'invalid-email'
    input.dispatchEvent(new Event('input'))
    t.equal(
        emailEl.classList.contains('error'),
        false,
        'No error before focus+blur'
    )

    // Focus and then blur to trigger validation
    input.dispatchEvent(new Event('focus'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    t.equal(
        emailEl.classList.contains('error'),
        true,
        'Error shows after focus+blur with invalid value'
    )

    // Fix the email
    input.value = 'valid@example.com'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    t.equal(
        emailEl.classList.contains('error'),
        false,
        'Error disappears when valid email is entered'
    )

    // Empty the input (which is valid for non-required)
    input.value = ''
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    t.equal(
        emailEl.classList.contains('error'),
        false,
        'No error for empty email when not required'
    )
})

test('Custom error messages', async t => {
    t.plan(2)

    // Clear previous elements
    document.body.innerHTML = ''

    // Create element with custom error message
    const customErrorMsg = 'Please provide a proper email address!'
    document.body.innerHTML += `
        <substrate-email label="Custom Error" errormsg="${customErrorMsg}" name="def">
        </substrate-email>
    `

    const emailEl = await waitFor('substrate-email') as SubstrateEmail
    const input = emailEl.querySelector('input') as HTMLInputElement

    // Type invalid email, focus and blur to trigger validation
    input.value = 'invalid-email'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('focus'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    const errorSpan = emailEl.querySelector('span.errormsg') as HTMLSpanElement
    t.ok(errorSpan, 'Error message element exists')
    t.equal(errorSpan.textContent, customErrorMsg,
        'Custom error message is displayed')
})

test('Required error message', async t => {
    t.plan(1)

    // Clear previous elements
    document.body.innerHTML = ''

    // Create required element with custom required message
    const requiredMsg = 'Email is mandatory!'
    document.body.innerHTML += `
        <substrate-email 
            name="ghi"
            label="the required email" 
            required 
            requiredmsg="${requiredMsg}">
        </substrate-email>
    `

    const emailEl = await waitFor('substrate-email') as SubstrateEmail
    const input = emailEl.querySelector('input') as HTMLInputElement

    // Focus and blur without entering anything to trigger required validation
    input.dispatchEvent(new Event('focus'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    const errorSpan = emailEl.querySelector('.errormsg') as HTMLSpanElement
    t.equal(errorSpan?.textContent, requiredMsg,
        'Custom required message is displayed')
})

test('Event dispatching', async t => {
    t.plan(2)

    // Clear previous elements
    document.body.innerHTML = ''

    document.body.innerHTML += `
        <substrate-email label="Events Test" name="foo">
        </substrate-email>
    `

    const emailEl = await waitFor('substrate-email') as SubstrateEmail
    const input = emailEl.querySelector('input') as HTMLInputElement

    // Set up event listeners
    let invalidFired = false
    let validFired = false

    emailEl.addEventListener('invalid', () => {
        invalidFired = true
    })

    emailEl.addEventListener('valid', () => {
        validFired = true
    })

    // Enter invalid email and blur
    input.value = 'invalid'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))

    // Wait for events to fire
    await sleep(50)
    t.equal(invalidFired, true, 'Invalid event fires for invalid email')

    // Enter valid email and blur
    input.value = 'valid@example.com'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))

    // Wait for events to fire
    await sleep(50)
    t.equal(validFired, true, 'Valid event fires when email becomes valid')

    // Trigger another validation
    input.value = 'another@test.com'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))

    // Wait for events to fire
    await sleep(50)
})

test('Accessibility attributes', async t => {
    t.plan(3)

    // Clear previous elements
    document.body.innerHTML = ''

    document.body.innerHTML += `
        <substrate-email label="Accessibility Test" name="bar">
        </substrate-email>
    `

    const emailEl = await waitFor('substrate-email') as SubstrateEmail
    const input = emailEl.querySelector('input') as HTMLInputElement

    // Initially should not have aria-invalid
    t.equal(input.getAttribute('aria-invalid'), 'false',
        'Input starts with aria-invalid="false"'
    )

    // Enter invalid email and blur
    input.value = 'invalid'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('focus'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    t.equal(
        input.getAttribute('aria-invalid'),
        'true',
        'Invalid input gets aria-invalid="true"'
    )

    // Enter valid email and blur
    input.value = 'valid@example.com'
    input.dispatchEvent(new Event('input'))
    input.dispatchEvent(new Event('blur'))

    // Wait for effects to run
    await new Promise(resolve => setTimeout(resolve, 50))

    t.equal(
        input.getAttribute('aria-invalid'),
        'false',
        'Valid input gets aria-invalid="false"'
    )
})
