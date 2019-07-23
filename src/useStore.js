import React, {createContext, useReducer, useContext} from 'react'
import 'js-expansion'
import createStore from './createStore'

const StoreContext = createContext({})
function reducer(state, action) {
    return {...state, ...action.update}
}

let globalStore = {}

function getStateFromRoutes  (state, type, single) {
    const routes = globalStore.router.routes[type]

    for (let name in routes) {
        if (!routes.hasOwnProperty(name)) {
            continue
        }

        let data = single ? {} : []
        if (globalStore.data.hasOwnProperty(name)) {
            data = globalStore.data[name]
        }

        if (!routes.hasOwnProperty(name)) {
            continue
        }

        state[name] = routes[name].wrap ? {
            data: data,
            errors: [],
            loading: false,
            updated: false
        } : {
            ...data,
            errors: [],
            loading: false,
            updated: false,
        }

    }

    return state
}

export function ApiStoreProvider ({children, store}) {
    globalStore = store
    let initialState = getStateFromRoutes({}, 'get')
    initialState = getStateFromRoutes(initialState, 'show', true)
    initialState = getStateFromRoutes(initialState, 'index')

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
      <StoreContext.Provider value={{state, dispatch}}>
          {children}
      </StoreContext.Provider>
    )
}

function appendData (action, route, response, state) {
    const append = action.append || 'data'
    let index = state[action.route][append].clone()

    if (!route.wrap  && !response.hasOwnProperty(append)) {
        return {...response}
    }

    if (action.method === 'put') {
        index = index.save(route.wrap ? response : response[append])
        return route.wrap ? index : {...response, [append]: index}
    }

    return route.wrap ? index.concat(response) : {...response, [append]: index.concat(response[append])}
}

function deleteData (action, route, state) {
    const append = action.append || 'data'
    const keys = Object.keys(action.params)
    let data = state[action.route][append].clone()

    data = data.delete(keys[0], action.params[keys[0]])
    return route.wrap ? data : {[append]: data}
}

function wrapperDispatch(dispatch, state) {
    return function (action) {
        // Rebuild store because we lose the instance going from server to client
        globalStore = new createStore(globalStore)
        const route = globalStore.router.route(action.method, action.route)

        dispatch({
            update: {
                [action.route]: {...state[action.route], loading: true}
            }
        })

        globalStore.dispatch(action).then((response) => {
            if (action.type === 'append' || action.method === 'post' || action.method === 'put') {
                response = appendData(action, route, response, state)
            }

            if (action.method === 'delete') {
                response = deleteData(action, route, state)
            }

            response = route.wrap ? {data: response} : response

            dispatch({
                update: {
                    [action.route]: {
                        ...state[action.route],
                        loading: false,
                        updated: true,
                        ...response
                    }
                }
            })
        })
    }
}

export function withApiStore (store) {
    return (Component) => {
        const ApiStoreMiddleware = (props) => {
            return <Component {...props}/>
        }

        ApiStoreMiddleware.getInitialProps = async ({Component, ctx}) => {
            let pageProps = {}
            if (Component.getInitialProps) {
                ctx.store = store
                pageProps = await Component.getInitialProps(ctx)
            }

            return {pageProps, store}
        }

        return ApiStoreMiddleware
    }
}


export function useApiStore () {
    const {state, dispatch} = useContext(StoreContext)
    return {state, dispatch: wrapperDispatch(dispatch, state)}
}
