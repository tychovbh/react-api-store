import App, {Container} from 'next/app'
import Head from 'next/head'
import React from 'react'
import store, {withApiStore, ApiStoreProvider} from 'react-hook-api-store'

store.router.baseUrl('https://jsonplaceholder.typicode.com')
store.router.index('/todos', 'todos', true)
store.router.show('/todos/{id}', 'todo', true)
store.router.post('/todos', 'todos', true)
store.router.put('/todos/{id}', 'todos', true)
store.router.delete('/todos/{id}', 'todos', true)


class MyApp extends App {
    render() {
        const {Component, pageProps, store} = this.props

        return <Container>
            <Head>
                <title>Todos</title>
            </Head>
            <ApiStoreProvider store={store}>
                <Component {...pageProps}/>
            </ApiStoreProvider>
        </Container>
    }
}

export default withApiStore(store)(MyApp)
