import React, {createContext, useReducer, useContext} from 'react'
import {getActions} from './actions/Get'

const StoreContext = createContext({})

const Actions = {
    ...getActions
}

const reducer = (state, action) => {
    return {...state, ...action.update}
}

let ProjectRouter = {}

const getStateFromRoutes = (state, type, single) => {
    const names = ProjectRouter.routes[type]

    for (let i in names) {
        if (names.hasOwnProperty(i)) {
            state[i] = {
                data: single ? {} : [],
                errors: [],
                loading: false,
                updated: false
            }
        }
    }

    return state
}

export const ApiStoreProvider = ({children, Router}) => {
    ProjectRouter = Router
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

function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
    )
}

function wrapperDispatch(dispatch, state) {
    return function (action) {
        const method = Actions[action.method]
        const update = method(ProjectRouter.request(action.method, action.route, action.params))

        if (isPromise(update)) {
            dispatch({update: {
                [action.route]: {...state[action.route], loading: true}
            }})
            update.then(response => {
                let data = Array.isArray(response) ? {data: response} : response

                dispatch({update: {
                    [action.route]: {
                        ...state[action.route],
                        loading: false,
                        updated: true,
                        ...data
                    }
                }})
            })
        } else {
            dispatch({type: action.type, update})
        }
    }
}

export const useApiStore = store => {
    const {state, dispatch} = useContext(StoreContext)
    return {state, dispatch: wrapperDispatch(dispatch, state)}
}
