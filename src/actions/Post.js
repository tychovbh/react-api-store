import 'isomorphic-unfetch'
import {form} from '../helpers'

async function post(request, params) {
        const res = await fetch(request, {
            method: 'POST',
            body: form(params),
        })

        const json = await res.json()
        return res.ok ? json : {errors: json}
}

export default {
    post: post
}
