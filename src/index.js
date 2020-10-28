import React, {createContext, useReducer, useContext} from 'react'
import 'js-expansion'
import Router from './Router'
import getActions from './actions/Get'
import postActions from './actions/Post'
import putActions from './actions/Put'
import deleteActions from './actions/Delete'

const StoreContext = createContext({})

function reducer(state, action) {
    return {...state, ...action.update}
}

let globalStore = {}

function getStateFromRoutes(state, type, single) {
    const routes = globalStore.router.routes[type]

    for (let name in routes) {
        if (!routes.hasOwnProperty(name)) {
            continue
        }

        let data = single ? {data: {}} : {data: []}

        state[name] = {
            ...data,
            errors: {},
            loading: false,
            updated: false,
        }
    }

    return state
}

let refresh = true

export function ApiStoreProvider({children, store}) {
    globalStore = store

    let initialState = getStateFromRoutes(store.initialState, 'get')
    initialState = getStateFromRoutes(initialState, 'show', true)
    initialState = getStateFromRoutes(initialState, 'index')
    initialState = getStateFromRoutes(initialState, 'post')
    initialState = getStateFromRoutes(initialState, 'put')

    for (let i in globalStore.data) {
        initialState[i] = {...initialState[i], ...globalStore.data[i]}
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    if (refresh) {
        refresh = false
        dispatch({
            update: initialState,
        })
    }

    return (
      <StoreContext.Provider value={{state, dispatch}}>
          {children}
      </StoreContext.Provider>
    )
}

function appendData(action, route, response, state) {
    const append = action.append || 'data'
    if (!Array.isArray(state[action.route][append])) {
        return response
    }
    let index = state[action.route][append].clone()

    if (!route.options.wrap && !response.hasOwnProperty(append)) {
        return {...response}
    }

    if (action.method === 'put') {
        index = index.save(route.options.wrap ? response : response[append])
        return route.options.wrap ? index : {...response, [append]: index}
    }

    return route.options.wrap ? index.concat(response) : {...response, [append]: index.concat(response[append])}
}

function deleteData(action, route, state) {
    const append = action.append || 'data'
    const keys = Object.keys(action.params)
    let data = state[action.route][append].clone()

    data = data.delete(keys[0], action.params[keys[0]])
    return route.options.wrap ? data : {[append]: data}
}

function wrapperDispatch(dispatch, state) {
    return function (action) {
        const state_key = action.state || action.route
        // Rebuild store because we lose the instance going from server to client
        globalStore = new createStore(globalStore)
        if (action.method === 'setState') {
            const append = action.append || 'data'

            return dispatch({
                update: {
                    [action.name]: {...state[action.name], [append]: action.value},
                },
            })
        }

        const route = globalStore.router.route(action.method, action.route)
        const update = action.update !== false

        if (update) {
            dispatch({
                update: {
                    [action.route]: {...state[action.route], loading: true},
                },
            })
        }

        return globalStore.dispatch(action, false).then((response) => {
            const rawResponse = response
            if (action.type === 'append' || action.method === 'post' || action.method === 'put') {
                // TODO make prepend
                response = appendData(action, route, response, state)
            }

            if (action.method === 'delete') {
                response = deleteData(action, route, state)
            }

            let updatedState = {
                ...state[state_key],
                loading: false,
            }

            if (!response.errors) {
                updatedState.errors = {}
            }

            if (update) {
                updatedState = {...updatedState, updated: true, ...response}
                dispatch({
                    update: {
                        [state_key]: updatedState,
                    },
                })
            }

            return action.return === 'response' ? rawResponse : response
        })
    }
}

export function withApiStore(store) {
    return (Component) => {
        const ApiStoreMiddleware = (props) => {
            return <Component {...props}/>
        }

        ApiStoreMiddleware.getInitialProps = async ({Component, ctx}) => {
            let pageProps = {}
            if (ctx.req) {
                pageProps.query = ctx.req.query
                globalStore = {}
                store.data = {}
            }
            if (!ctx.res) {
                store = globalStore && globalStore.data ? new createStore(globalStore) : store
            }

            if (Component.getInitialProps) {
                ctx.store = store
                pageProps = await Component.getInitialProps(ctx)
            }

            return {pageProps, store, isServer: !!ctx.res}
        }

        return ApiStoreMiddleware
    }
}

export function useApiStore() {
    const {state, dispatch} = useContext(StoreContext)
    return {state, dispatch: wrapperDispatch(dispatch, state)}
}

class createStore {
    constructor(store = {}) {
        this.data = store.data || {}
        this.initialState = store.initialState || {}
        this.router = new Router(store.router || {})
        this.actions = {
            ...getActions,
            ...postActions,
            ...putActions,
            ...deleteActions,
        }
    }

    async dispatch(action, refreshable = true) {
        refresh = refreshable
        const method = this.actions[action.method]
        let data = await method(this.router.request(action.method, action.route, action.params), action.params, action.headers, action.defaults)

        // Todo rewrite this to something pretty
        const route = this.router.routes[action.method][action.route]
        let append = route.options.append || 'data'

        if (
          (action.method === 'show' || route.options.single) &&
          (Array.isArray(data[append]) && data[append][0])
        ) {
            data[append] = data[append][0]
        }

        if (route.options.wrap) {
            data = {[append]: data}
        }

        if (refresh) {
            this.data[action.route] = data
        }
        return data
    }

    setState(key, value) {
        this.initialState[key] = value
    }
}

export default new createStore()
