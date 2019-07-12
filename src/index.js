import {request} from './helpers'
export * from './useStore'

class Router {
    constructor() {
        this.routes = {
            get: {},
            show: {},
            index: {}
        }
        this.base_url = ''
    }

    baseUrl(url) {
        this.base_url = url
    }

    fullUrl(url) {
        return url.indexOf('http') === -1 ? this.base_url + url : url
    }

    get(url, name) {
        this.routes.get[name] = this.fullUrl(url)
    }

    index(url, name) {
        this.routes.index[name] = this.fullUrl(url)
    }

    show(url, name) {
        this.routes.show[name] = this.fullUrl(url)
    }

    request(method, route, params = {}) {
        const types = {
            index: 'get',
            show: 'get',
            get: 'get'
        }

        return request(types[method], this.routes[method][route], params || {})
    }
}

const router = new Router()
export default router
