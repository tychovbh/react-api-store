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

    setRoute(type, url, name, wrap = false) {
        this.routes[type][name] = {
            url: this.fullUrl(url),
            wrap: wrap
        }
    }

    route(method, name) {
        return this.routes[method][name]
    }

    get(url, name, wrap = false) {
        this.setRoute('get', url, name, wrap)
    }

    index(url, name, wrap = false) {
        this.setRoute('index', url, name, wrap)
    }

    show(url, name, wrap = false) {
        this.setRoute('show', url, name, wrap)
    }

    post(url, name, wrap = false) {
        this.setRoute('post', url, name, wrap)
    }

    put(url, name, wrap = false) {
        this.setRoute('put', url, name, wrap)
    }

    delete(url, name, wrap = false) {
        this.setRoute('delete', url, name, wrap)
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
