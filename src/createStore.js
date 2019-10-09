import Router from './Router'
import getActions from './actions/Get'
import postActions from './actions/Post'
import putActions from './actions/Put'
import deleteActions from './actions/Delete'

export default class createStore {
    constructor(store = {}) {
        this.data = store.data || {}
        this.initialState = store.initialState || {}
        this.router = new Router(store.router || {})
        this.actions = {
            ...getActions,
            ...postActions,
            ...putActions,
            ...deleteActions
        }
    }

    async dispatch(action) {
        const method = this.actions[action.method]
        const data = await method(this.router.request(action.method, action.route, action.params), action.params, action.headers)

        this.data[action.route] = data
        return data
    }

    setState(key, value) {
        this.initialState[key] = value
    }
}
