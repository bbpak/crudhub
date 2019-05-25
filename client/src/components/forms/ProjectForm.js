import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Form, Dropdown, Button } from 'semantic-ui-react'
import ImageUploader from 'react-images-upload'
import { camelCase } from 'lodash'
import '../styles/form.css'

let reposData = {}

const ProjectForm = (props) => {
	const [ inputs, setInputs ] = useState({ user_id: props.currentUser.id })
	const [ repoOptions, setRepoOptions ] = useState([])
	const [ tagOptions, setTagOptions ] = useState([])
	const [ selectedRepo, setSelectedRepo ] = useState(null)
	const [ coverImage, setCoverImage ] = useState(null)
	const [ isLoading, setIsLoading ] = useState(true)
	const [ redirect, setRedirect ] = useState(false)
	const { currentUser: { username } } = props

	// Replace _, -, camelCase with whitespace for legible name
	const namify = (text) => {
		return (
			camelCase(text)
				// insert a space before all caps
				.replace(/([A-Z])/g, ' $1')
				// uppercase the first character
				.replace(/^./, function(str) {
					return str.toUpperCase()
				})
		)
	}

	useEffect(() => {
		let repos = sessionStorage.getItem('repos')

		if (!repos) {
			const reposURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
			repos = []

			// Go through 300 repos w/ 100 per page limit for FI students with a ton of labs...
			// Switch to GraphQL stretch goal 🤞
			for (let i = 1; i <= 3; i++) {
				// Fetch user's public github repos
				fetch(reposURL + `&page=${i}`).then((res) => res.json()).then((data) => {
					// For-loop instead of forEach so I can break
					// Filter only relevant properties
					for (let j = 0; j < data.length; j++) {
						const repo = data[j]

						// Don't include forks
						if (!repo.fork) {
							if (repos.includes(repo)) break

							console.log(repo)
							repos.push({
								key: j,
								text: repo.name,
								value: repo.name
							})

							// To pre-fill form with selected repo
							reposData[repo.name] = {
								name: namify(repo.name),
								repo_url: repo.html_url,
								language: repo.language
							}
						}
					}

					setRepoOptions(repos)
					sessionStorage.setItem('repoOptions', repos)

					// Done with all 3 fetch requests, set loading false
					if (i === 3) setIsLoading(false)
				})
			}
		} else {
			setRepoOptions(repos)
		}
	}, [])

	const handleInputChange = (e) => {
		e.persist()
		setInputs((inputs) => ({
			...inputs,
			[e.target.name]: e.target.value
		}))
	}

	const handleDropdownChange = (e) => {
		const repo = e.target.textContent
		setSelectedRepo(repo)
		setInputs((inputs) => ({
			...reposData[repo]
		}))
	}

	const handleCancel = () => {
		setRedirect(true)
	}

	const handleImageDrop = (files, URLs) => {
		console.log(files, URLs)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		// Create project
		fetch(window._API_URL_ + 'projects', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
				// Authorization: `Bearer ${props.currentUser.token}`
			},
			body: JSON.stringify(inputs)
		})
			.then((res) => res.json())
			.then((data) => {
				setRedirect(true)
			})
	}

	const renderFormField = (name) => {
		return (
			<Form.Field>
				<Form.Input label={namify(name)} name={name} value={inputs[name]} onChange={handleInputChange} />
			</Form.Field>
		)
	}

	const renderForm = () => {
		return (
			<React.Fragment>
				<div className='project-form animated fadeInUp'>
					<Form.Field className='project-form-image'>
						<label className='label'>Cover Image</label>
						<ImageUploader
							withIcon
							buttonText='Upload image'
							onChange={handleImageDrop}
							imgExtension={[ '.jpg', '.gif', '.png' ]}
							maxFileSize={5242880}
						/>
					</Form.Field>
					<div className='project-form-details'>
						{renderFormField('name')}
						{renderFormField('repo_url')}
						{renderFormField('project_url')}
					</div>
				</div>
				<Dropdown fluid multiple search selection options={[ { key: 1, name: '' } ]} />
			</React.Fragment>
		)
	}

	return (
		<div className='project-form-container'>
			<h1>New Project</h1>
			<Dropdown
				placeholder='repository'
				onChange={handleDropdownChange}
				value={selectedRepo}
				options={repoOptions}
				loading={isLoading}
				selection
			/>
			<Form onSubmit={handleSubmit}>
				{selectedRepo && renderForm()}

				<div className='project-form-buttons'>
					{redirect && <Redirect to='/' />}
					<Button primary type='submit'>
						Create Project
					</Button>
					<Button secondary>Cancel</Button>
				</div>
			</Form>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser
	}
}

export default connect(mapStateToProps)(ProjectForm)
