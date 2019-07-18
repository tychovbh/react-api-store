import React from 'react'
import {useApiStore} from 'react-hook-api-store'

const Home =  (props) => {
    const {state, dispatch} = useApiStore()

    return (
      <div>
          <button onClick={() => {
              dispatch({
                  method: 'show',
                  route: 'todo',
                  params: {
                      id: 1
                  }
              })
          }}>
              get todo
          </button>

          <p>Todo  {state.todo.data.title}</p>

          {props.todos.map((todo, index) => <p key={index}>{todo.title}</p>)}
      </div>
    )
}

Home.getInitialProps = async ({store}) => {
    const todos = await store.dispatch({
        method: 'index',
        route: 'todos'
    })

    return {todos}
}

export default Home
