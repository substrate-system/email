import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'

test('Can use the UMD module', async t => {
    t.plan(1)
    document.body.innerHTML = `<${'substrate-email'}></${'substrate-email'}>`
    console.log('*****')
    try {
        const input = await waitFor('substrate-email input', { timeout: 3000 })
        console.log('*****')
        t.ok(input, 'should render the input element')
    } catch (err) {
        t.fail(err)
    }
})
