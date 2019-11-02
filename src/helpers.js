const qs = require('qs')

export const query = (filters) => {
    return filters && JSON.stringify(filters) !== '{}' ? '?' + qs.stringify(filters) : ''
}

export const request = (type, route, filters = {}) => {
    let params = Object.assign({}, filters) || {}
    for (let key in params) {
        if (!params.hasOwnProperty(key) || route.indexOf(`{${key}}`) === -1) {
            continue
        }
        route = route.replace(`{${key}}`, params[key])
        delete params[key]
    }

    return type === 'get' ? route + query(params) : route
}

export const createForm = (formData, params, key = null) => {
    for (let i in params) {
        if (!params.hasOwnProperty(i)) {
            continue
        }

        let formKey = key ? key + `[${i}]` : i

        if ((Array.isArray(params[i]) || typeof params[i] === 'object') && !(params[i] instanceof File)) {
            formData = createForm(formData, params[i], formKey)
            continue;
        }

        formData.append(formKey, params[i])
    }

    return formData
}

export const form = (params) => {
    let formData = new FormData()
    return createForm(formData, params)
}

