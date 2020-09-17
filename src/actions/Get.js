import 'isomorphic-unfetch'

async function get(request, params = {}, headers = {}, defaults = {}) {
    const res = await fetch(request, {
        ...defaults,
        headers: headers
    })
    return await res.json()
}

export default {
    get: get,
    show: get,
    index: get,
}
