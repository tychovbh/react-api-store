async function get(request) {
    const res = await fetch(request)
    return await res.json()
}

export default {
    get: get,
    show: get,
    index: get,
}
