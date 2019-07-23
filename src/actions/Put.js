import 'isomorphic-unfetch'
import {form} from '../helpers'

async function put(request, params, headers = {}) {
    let formData = form(params)
    formData.append('_method', 'put')
    const res = await fetch(request, {
        method: 'PUT',
        body: formData,
        headers: headers
    })

    return await res.json()
}

export default {
    put: put
}
