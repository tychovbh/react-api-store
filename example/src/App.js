import React, {useEffect} from 'react'
import Router, {ApiProvider, useApiStore} from 'react-api-store'

Router.baseUrl('https://jsonplaceholder.typicode.com')
Router.index('/todos', 'todos')
Router.show('/todos/{id}', 'todo')

const Todos = () => {
    const {state, dispatch} = useApiStore()

    useEffect(() => {
        dispatch({
            method: 'index',
            type: 'index',
            route: 'todos'
        })

        dispatch({
            method: 'show',
            route: 'todo',
            params: {
                id: 1
            }
        })
    }, [])

    return (
      <div>
          <p>Todo with ID 1: {state.todo.title}</p>
          <p>Loading: {state.todos.loading ? 'true ' : 'false'}</p>
          <ul>
              {state.todos.data.map((item, index) => (
                <li key={index}>
                    <p>{item.title}</p>
                </li>
              ))}
          </ul>
      </div>
    )
}

export default () => <ApiProvider Router={Router}>
    <Todos/>
</ApiProvider>
