import { test } from '@bicycle-codes/tapzero'
import { waitFor } from '@bicycle-codes/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <substrate-email class="test">
        </substrate-email>
    `

    const el = await waitFor('substrate-email')

    t.ok(el, 'should find an element')
})
