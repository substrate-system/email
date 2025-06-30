import { test } from '@substrate-system/tapzero'
import { html } from '../src/html.js'

test('serverside render', t => {
    const h = html({ placeholder: 'abc@123.com', label: 'hello', required: true })
    t.equal(typeof h, 'string', 'should return a string')
    t.ok(h.includes('<substrate-email>'),
        'should return the tag because we are in node')
    t.ok(h.includes('placeholder="abc@123.com"'))
})
