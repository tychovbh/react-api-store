import 'isomorphic-unfetch'

async function post(request, params) {
        const res = await fetch(request, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })

        const json = await res.json()
        return res.ok ? json : {errors: json}
}

export default {
    post: post
}
