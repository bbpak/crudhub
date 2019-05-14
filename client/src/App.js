import React, { Component } from 'react'
import LoginForm from './components/forms/LoginForm'
import './App.css'

class App extends Component {
	state = {
		token: null
	}

	componentDidMount() {
		const query = window.location.search.substring(1)
		const pairs = query.split('&').map((str) => str.split('='))
		const token = pairs.reduce((memo, pair) => {
			memo[pair[0]] = pair[1]
			return memo
		}, {})

		this.setState({ token }, () => {
			console.log(token)
		})
	}

	handleLogIn = () => {
		fetch('https://localhost:3000/auth/github')
	}

	render() {
		return (
			<div className='App'>
				<main>
					<LoginForm handleLogIn={this.handleLogIn} />
				</main>
			</div>
		)
	}
}

export default App
