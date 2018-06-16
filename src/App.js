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
    :hover{
      background-color:lawngreen;
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
    formFields: null,
    text: null,
    error: null,
    success: false,
    fullName: null
  }
  componentDidMount () {
    netlifyIdentity.init()
    if (netlifyIdentity.currentUser()) {
      this.state.fullName = netlifyIdentity.currentUser().user_metadata.full_name
    }
  }

  generateHeaders () {
    const headers = { 'Content-Type': 'application/json' }
    console.log(`hello this is to see ${netlifyIdentity}`)
    console.table(netlifyIdentity)
    console.table(netlifyIdentity.currentUser())
    if (netlifyIdentity.currentUser()) {
      // this.state.fullName = netlifyIdentity.currentUser().user_metadata.full_name
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
  onSubmit (fields) {
    console.log(fields)
    this.setState({ loading: true })
    this.generateHeaders().then(headers => {
      fetch('/.netlify/functions/slack', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          // text: this.state.text,
          formFields: this.state.formFields
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
            text: null,
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
        <Form onSubmit={fields => this.onSubmit(fields)} />
      </StyledApp>
    )
  }
}

export default App
