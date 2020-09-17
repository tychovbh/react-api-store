import 'isomorphic-unfetch'

async function get(request, params = {}, headers = {}, defaults = {}) {
    const res = await fetch(request, {
        ...defaults,
        headers: headers
    })

    const json = await res.json()
    return res.ok ? json : {errors: json}
}

export default {
    get: get,
    show: get,
    index: get,
}
