import 'isomorphic-unfetch'

async function put(request, params) {
    const res = await fetch(request, {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })

    return await res.json()
}

export default {
    put: put
}
