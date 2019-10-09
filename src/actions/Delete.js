import 'isomorphic-unfetch'

async function deleteRequest(request, params = {}, headers = {}) {
    const res = await fetch(request, {
        method: 'DELETE',
        headers: headers
    })

    return await res.json()
}

export default {
    delete: deleteRequest
}
