import 'isomorphic-unfetch'
import {form} from '../helpers'

async function put(request, params, headers = {}) {
    let formData = form(params)
    formData.append('_method', 'put')
    const res = await fetch(request, {
        method: 'POST',
        body: formData,
        headers: headers
    })

    const json = await res.json()
    return res.ok ? json : {errors: json}
}

export default {
    put: put
}
