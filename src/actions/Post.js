import 'isomorphic-unfetch'
import {form} from '../helpers'

async function post(request, params, headers = {}) {
        let formData = form(params)
        formData.append('_method', 'post')

        const res = await fetch(request, {
            method: 'POST',
            body: formData,
            headers: headers
        })

        const json = await res.json()
        return res.ok ? json : {errors: json}
}

export default {
    post: post
}
