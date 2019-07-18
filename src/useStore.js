import React, {createContext, useReducer, useContext} from 'react'
import 'js-expansion'

const StoreContext = createContext({})
function reducer(state, action) {
    return {...state, ...action.update}
}

let globalStore = {}

function getStateFromRoutes  (state, type, single) {
    const routes = globalStore.router.routes[type]

    for (let name in routes) {
        let data = single ? {data: {}} : {data: []}

        if (globalStore.data.hasOwnProperty(name)) {
            data = globalStore.data[name]
        }

        if (!routes.hasOwnProperty(name)) {
            continue
        }

        state[name] = routes[name].wrap ? {
            ...data,
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
    let data = state[action.route][append].clone()
    if (action.method === 'post') {
        response = [route.wrap ? response : response[append]]
    }
    if (action.method === 'put') {
        data = data.save(route.wrap ? response : response[append])
        return route.wrap ? data : {...response, [append]: data}
    }
    data = route.wrap ? data.concat(response) : {...response, [append]: data.concat(response[append])}

    return data
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
        const route = globalStore.router.route(action.method, action.route)

        dispatch({
            update: {
                [action.route]: {...state[action.route], loading: true}
            }
        })

        globalStore.dispatch(action).then((response) => {
            if (Array.isArray(response)) {
                response = response.splice(1, 5)
            }

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
