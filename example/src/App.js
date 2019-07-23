import React, {useEffect, useState} from 'react'
import store, {ApiStoreProvider, useApiStore} from 'react-hook-api-store'

store.router.baseUrl('https://jsonplaceholder.typicode.com')
store.router.index('/todos', 'todos', true)
store.router.show('/todos/{id}', 'todo', true)
store.router.post('/todos', 'todos', true)
store.router.put('/todos/{id}', 'todos', true)
store.router.delete('/todos/{id}', 'todos', true)

const Todos = () => {
    const {state, dispatch} = useApiStore()
    const [todo, setTodo] = useState({
        title: '',
        completed: false,
        userId: 1
    })

    useEffect(() => {
        dispatch({
            method: 'index',
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
          <p><strong>Todo with ID 1: {state.todo.data.title}</strong></p>
          <p>Loading todo: {state.todo.loading ? 'true ' : 'false'}</p>

          <p><strong>{todo.id ? 'Edit' : 'Create'} Todo:</strong></p>
          <form onSubmit={(event) => {
              event.preventDefault()
              dispatch({
                  method: todo.id ? 'put' : 'post',
                  route: 'todos',
                  params: todo
              })
          }}>
              <div>
                  <label htmlFor={'title'}>Title</label>

                  <input
                    type={'text'}
                    name={'title'}
                    id={'title'}
                    onChange={(value) => setTodo({...todo, title: value.target.value})}
                    value={todo.title}/>
              </div>

              <div>
                  <label htmlFor={'completed'}>Completed</label>

                  <input
                    type={'checkbox'}
                    name={'completed'}
                    id={'completed'}
                    onChange={(value) => setTodo({...todo, completed: value.target.checked})}
                    value={todo.completed}/>
              </div>
              <div>
                  <input type={'submit'} name={'submit'} value={todo.id ? 'edit' : 'create'}/>
              </div>
          </form>

          <p><strong>Todos:</strong></p>
          <p>Loading todos: {state.todos.loading ? 'true ' : 'false'}</p>
          <table>
              <thead>
              <tr>
                  <th>ID</th>
                  <th style={{textAlign: 'left'}} colSpan={2}>Title</th>
              </tr>
              </thead>
              <tbody>
              {
                  state.todos.data.map((item, index) => <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.title || 'unknown'}</td>
                        <td>
                            <button onClick={() => setTodo(item)}>edit</button>
                        </td>
                      <td>
                          <button onClick={() => dispatch({
                              method: 'delete',
                              route: 'todos',
                              params: {
                                  id: item.id
                              }
                          })}>delete</button>
                      </td>
                    </tr>
                  )
              }
              </tbody>
          </table>
          <button onClick={() => {
              dispatch({
                  method: 'index',
                  type: 'append',
                  route: 'todos'
              })
          }}>load more
          </button>
      </div>
    )
}

export default () => <ApiStoreProvider store={store}>
    <Todos/>
</ApiStoreProvider>
