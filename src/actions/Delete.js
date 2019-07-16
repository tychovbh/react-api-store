async function deleteRequest(request) {
    const res = await fetch(request, {
        method: 'DELETE'
    })

    return await res.json()
}

export default {
    delete: deleteRequest
}
