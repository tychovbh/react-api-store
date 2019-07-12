const get = async (request) => {
    const res = await fetch(request)
    return await res.json()
}

export const getActions = {
    get: get,
    show: get,
    index: get,
}
