import 'isomorphic-unfetch'

async function deleteRequest(request, params = {}, headers = {}) {
    const res = await fetch(request, {
        method: 'DELETE',
        headers: headers
    })

    const json = await res.json()
    return res.ok ? json : {errors: json}
}

export default {
    delete: deleteRequest
}
