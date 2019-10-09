import {request} from './helpers'
export default class Router {
    constructor(router = {}) {
        this.routes = router.routes || {
            get: {},
            show: {},
            index: {},
            post: {},
            put: {},
            delete: {}
        }

        this.base_url = router.base_url || ''
    }

    baseUrl(url) {
        this.base_url = url
    }

    fullUrl(url) {
        return url.indexOf('http') === -1 ? this.base_url + url : url
    }

    setRoute(type, url, name, options = {}) {
        this.routes[type][name] = {
            url: this.fullUrl(url),
            options: options
        }
    }

    route(method, name) {
        return this.routes[method][name]
    }

    get(url, name, options = {}) {
        this.setRoute('get', url, name, options)
    }

    index(url, name, options = {}) {
        this.setRoute('index', url, name, options)
    }

    show(url, name, options = {}) {
        this.setRoute('show', url, name, options)
    }

    post(url, name, options = {}) {
        this.setRoute('post', url, name, options)
    }

    put(url, name, options = {}) {
        this.setRoute('put', url, name, options)
    }

    delete(url, name, options = {}) {
        this.setRoute('delete', url, name, options)
    }

    request(method, route, params = {}) {
        const types = {
            index: 'get',
            show: 'get',
            get: 'get'
        }

        return request(types[method], this.routes[method][route].url, params || {})
    }
}
