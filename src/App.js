import React, { Component } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import Form from './components/Form'
import styled from 'styled-components'
// import './App.css'

const StyledApp = styled.div`
  text-align: center;
`
const AppHeader = styled.header`
  background-color: #322;
  height: 150px;
  padding: 20px;
  color: white;
  > h1{
    font-size: 2em;
    }
  }
`
const LoginBtn = styled.a`
    text-decoration:none;
    color: #322;
    background-color:lightblue;
    border-radius: .7em;
    padding: 5px 10px;
    :active,:hover{
      outline:none;
      border:none;
      background-color:lightskyblue;
    }
  `

class App extends Component {
  state = {
    user_fullName: '',
    nationalID: '',
    loading: false,
    fields: null,
    error: null,
    success: false,
    fullName: null
  }
  componentDidMount () {
    netlifyIdentity.init()
    if (netlifyIdentity.currentUser()) {
      this.setState({
        fullName: netlifyIdentity.currentUser().user_metadata.full_name
      })
    }
  }

  generateHeaders () {
    const headers = { 'Content-Type': 'application/json' }
    if (netlifyIdentity.currentUser()) {
      return netlifyIdentity.currentUser().jwt().then(token => {
        return { ...headers, Authorization: `Bearer ${token}` }
      })
    }
    return Promise.resolve(headers)
  }

  handleIdentity = e => {
    e.preventDefault()
    netlifyIdentity.open()
  }
  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    })
  }
  onSubmit () {
    const formFields = this.state.fields
    this.setState({ success: false, error: null })

    this.setState({ fields: {} })
    this.setState({ loading: true })
    this.generateHeaders().then(headers => {
      fetch('/.netlify/functions/slack', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          formFields
        })
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(err => {
              throw err
            })
          }
        })
        .then(() =>
          this.setState({
            loading: false,
            success: true,
            error: null
          })
        )
        .catch(err =>
          this.setState({
            loading: false,
            success: false,
            error: err.toString()
          })
        )
    })
  }
  render () {
    const { loading, error, success } = this.state
    return (
      <StyledApp>
        <AppHeader>
          <h1>.. ... ..</h1>
        </AppHeader>
        <p>
          <LoginBtn href='#' onClick={this.handleIdentity}>
            User state{' '}
          </LoginBtn>
        </p>
        {error && <p><strong>Error sending message: {error}</strong></p>}
        {success && <p><strong>Done! thank you for submitting</strong></p>}
        <Form
          loading={loading}
          onChange={updatedValue => this.onChange(updatedValue)}
          onSubmit={fields => this.onSubmit(fields)}
        />
      </StyledApp>
    )
  }
}

export default App
