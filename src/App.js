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
    user_metadata: null,
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
      this.setState({
        user_metadata: netlifyIdentity.currentUser().user_metadata
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
      userinfoFields: {
        ...this.state.userinfoFields,
        ...updatedValue
      }
    })
  }
  onSubmit () {
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
    const { loading, error, success, user_metadata } = this.state
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
          userinfo={user_metadata}
          loading={loading}
          onChange={updatedValue => this.onChange(updatedValue)}
          onSubmit={fields => this.onSubmit(fields)}
        />
      </StyledApp>
    )
  }
}

export default App
