import React, { Component } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import Form from './components/Form'
import styled from 'styled-components'
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants'
// import './App.css'

const StyledApp = styled.div`
  text-align: center;
`
const AppHeader = styled.header`
  background-color: #322;
  height: 10px;
  padding: 20px;
  color: white;
  > h1{
    font-size: 1em;
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
    user_metadata: null,
    formStep: 1,
    login: false,
    loading: false,
    error: null,
    success: false,
    fullName: null,
    userinfoFields: {},
    donationFields: {}
  }
  componentDidMount () {
    netlifyIdentity.init()
    if (netlifyIdentity.currentUser()) {
      this.setState({ login: true })
      this.setState({
        user_metadata: netlifyIdentity.currentUser().user_metadata
      })
    }

    netlifyIdentity.on('login', user => {
      if (user) {
        this.setState({
          user_metadata: user.user_metadata
        })
      }
      this.setState({ login: true })
    })
    netlifyIdentity.on('logout', () => {
      this.setState({ user_metadata: null, login: false })
    })
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
    const statusFields = this.state.formStep === 1
      ? 'userinfoFields'
      : 'donationFields'

    this.setState({
      [statusFields]: {
        ...this.state[statusFields],
        ...updatedValue
      }
    })
  }
  onSubmit = () => {
    const { donationFields, user_metadata } = this.state
    this.setState({
      success: false,
      error: null,
      userinfoFields: {},
      loading: true
    })

    this.generateHeaders().then(headers => {
      fetch('/.netlify/functions/googlesheet', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_metadata,
          donationFields
        })
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(err => {
              throw err
            })
          }
        })
        .then(() => {
          this.setState({
            loading: false,
            success: true,
            error: null,
            formStep: 0
          })
        })
        .catch(err =>
          this.setState({
            loading: false,
            success: false,
            error: err.toString()
          })
        )
    })
  }
  onSave = () => {
    const { userinfoFields } = this.state
    this.setState({
      success: false,
      error: null,
      userinfoFields: {},
      loading: true
    })

    this.generateHeaders().then(headers => {
      fetch('/.netlify/functions/userInfo', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userinfoFields
        })
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(err => {
              throw err
            })
          }
        })
        .then(() => {
          this.setState({
            loading: false,
            success: true,
            error: null,
            formStep: 2
          })
          // update localstorage with the current user metadata
          const localStorageRef = localStorage.getItem('gotrue.user')
          if (localStorageRef) {
            let localstorageObj = JSON.parse(localStorageRef)
            localstorageObj.user_metadata = {
              ...localstorageObj.user_metadata,
              ...userinfoFields
            }
            localStorage.setItem('gotrue.user', JSON.stringify(localstorageObj))
            this.setState({ user_metadata: localstorageObj.user_metadata })
          }
        })
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
    const {
      login,
      loading,
      error,
      success,
      formStep,
      user_metadata
    } = this.state
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
        {login &&
          <Form
            userinfo={user_metadata}
            loading={loading}
            formStep={formStep}
            success={success}
            onChange={updatedValue => this.onChange(updatedValue)}
            onSave={fields => this.onSave(fields)}
            onSubmit={fields => this.onSubmit(fields)}
          />}
      </StyledApp>
    )
  }
}

export default App
