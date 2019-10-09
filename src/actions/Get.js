import 'isomorphic-unfetch'

async function get(request, params = {}, headers = {}) {
    const res = await fetch(request, {
        headers: headers
    })
    return await res.json()
}

export default {
    get: get,
    show: get,
    index: get,
}
