import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { SubstrateEmail } from '../src/index.js'

let el:SubstrateEmail
test('Input renders', async t => {
    t.plan(2)
    SubstrateEmail.define()

    document.body.innerHTML += `
        <substrate-email class="test">
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
