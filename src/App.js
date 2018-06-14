import React, { Component } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import Form from './components/Form'
import styled from 'styled-components'
// import './App.css'

class SlackMessage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      formFields: null,
      text: null,
      error: null,
      success: false,
      fullName: null
    }
  }

  getFormFields (fields) {
    this.setState({ formFields: fields })
  }

  generateHeaders () {
    const headers = { 'Content-Type': 'application/json' }
    console.log(`hello this is to see ${netlifyIdentity}`)
    console.table(netlifyIdentity)
    console.table(netlifyIdentity.currentUser())
    if (netlifyIdentity.currentUser()) {
      this.state.fullName = netlifyIdentity.currentUser().user_metadata.full_name
      return netlifyIdentity.currentUser().jwt().then(token => {
        return { ...headers, Authorization: `Bearer ${token}` }
      })
    }
    return Promise.resolve(headers)
  }

  handleText = e => {
    this.setState({ text: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

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
    const { loading, text, error, success } = this.state

    return (
      <div>
        <span> {this.state.fullName}</span>
        <Form getFormFields={fields => this.getFormFields(fields)} />
        <form onSubmit={this.handleSubmit}>
          {error && <p><strong>Error sending message: {error}</strong></p>}
          {success && <p><strong>Done! Message sent to Slack</strong></p>}
          <p>
            <label>
              Your Message: <br />
              <textarea onChange={this.handleText} value={text} />
            </label>
          </p>
          <p>
            <button type='submit' disabled={loading}>
              {loading ? 'Sending Slack Message...' : 'Send a Slack Message'}
            </button>
          </p>
        </form>
      </div>
    )
  }
}

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
  componentDidMount () {
    netlifyIdentity.init()
  }

  handleIdentity = e => {
    e.preventDefault()
    netlifyIdentity.open()
  }
  render () {
    return (
      <StyledApp>
        <AppHeader>
          <h1>Slack Messenger</h1>
        </AppHeader>
        <p>
          <LoginBtn href='#' onClick={this.handleIdentity}>
            User state{' '}
          </LoginBtn>
        </p>
        <SlackMessage />
      </StyledApp>
    )
  }
}

export default App
