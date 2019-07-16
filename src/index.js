import {request} from './helpers'
import getActions from './actions/Get'
import postActions from './actions/Post'
import putActions from './actions/Put'
import deleteActions from './actions/Delete'

export * from './useStore'

class Router {
    constructor() {
        this.routes = {
            get: {},
            show: {},
            index: {},
            post: {},
            put: {},
            delete: {}
        }
        this.base_url = ''
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

class createStore {
    constructor() {
        this.data = {}
        this.router = new Router()
        this.actions = {
            ...getActions,
            ...postActions,
            ...putActions,
            ...deleteActions
        }
    }

    dispatch(action) {
        const method = this.actions[action.method]
        const data = method(this.router.request(action.method, action.route, action.params))
        this.data[action.route] = data
        return data
    }
}

const store = new createStore()
export default store
