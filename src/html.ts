import { type Attrs, html as input } from '@substrate-system/input/html'

export function html (attrs:Attrs & { label:string, placeholder:string }):string {
    // running in node?
    return typeof window === 'undefined' ?
        `<substrate-email>
            <label>
                <span class="label">
                    ${attrs.label}
                </span>
                ${input(attrs)}
            </label>` :
            `<label>
                <span class="label">
                    ${attrs.label}
                </span>
                ${input(attrs)}
            </label>
        </substrate-email>`
}
