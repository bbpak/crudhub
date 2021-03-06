import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App'
import { loadState, saveState } from './localStorage'
import reducers from './reducers'
import './index.css'
import * as serviceWorker from './serviceWorker'

// const persistedState = loadState()
const store = createStore(reducers)

// store.subscribe(() => {
// 	saveState({ currentUser: store.getState().currentUser })
// })

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
