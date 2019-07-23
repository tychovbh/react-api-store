import 'isomorphic-unfetch'
import {form} from '../helpers'

async function put(request, params) {
    const res = await fetch(request, {
        method: 'PUT',
        body: form(params),
    })

    return await res.json()
}

export default {
    put: put
}
