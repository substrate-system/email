import { expect, test } from 'vitest'
import { SubstrateEmail } from '../src/index.js'

test('Render the element', async () => {
    expect(SubstrateEmail.tag).toEqual('substrate-email')
    // document.body.innerHTML += `
    //     <substrate-email></substrate-email>
    // `

    // const el = await waitFor('substrate-email')
    // expect(el).toBeTruthy()
})

// import { test } from '@substrate-system/tapzero'
// import { waitFor, type } from '@bicycle-codes/dom'
// import '../src/index.js'

// let el
// test('Create the element', async t => {
//     document.body.innerHTML += `
//         <substrate-email class="test">
//         </substrate-email>
//     `

//     el = await waitFor('substrate-email')

//     t.ok(el, 'should find an element')
// })

// test('events', async t => {
//     t.plan(1)

//     el.addEventListener('invalid', ev => {
//         t.ok(true, 'should get an event')
//         console.log('**inv ev**', ev)
//     })

//     type(el, 'hello')
// })
