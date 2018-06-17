import React, { Component } from 'react'
import styled from 'styled-components'

const StyledForm = styled.form`
  text-align:right;
  direction:rtl;
  display: flex;
  flex-direction: column;
  max-width: 360px;
  margin:  0 auto;
  > label>input[type="radio"]{
    margin-right: 1.5em;
  }
  > input{
    line-height: 1.4em;
    box-sizing: border-box;
    font-size: normal;
    padding: 5px 8px;
    }
  >label{
    margin-top: 1.5em;
    margin-bottom: .4em;

  }
`
const Radio = styled.input.attrs({ type: 'radio' })`
  margin: 8px;
`

export default class Form extends Component {
  state = {
    userFullName: '',
    nationalID: '',
    gender: ''
  }
  onChange = e => {
    this.props.onChange({
      [e.target.name]: e.target.value
    })
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.state)
    console.log(e)
    this.setState({
      userFullName: '',
      nationalID: '',
      gender: ''
    })
    e.target.reset()
  }

  render () {
    const { loading } = this.props
    return (
      <StyledForm onSubmit={this.onSubmit}>
        <label htmlFor='userFullName'>
          الاسم الكامل:
        </label>
        <input
          type='text'
          name='userFullName'
          onChange={e => this.onChange(e)}
        />
        <label htmlFor='nationalID'>
          رقم الهوية:
        </label>
        <input type='text' name='nationalID' onChange={e => this.onChange(e)} />

        <label htmlFor='gender'>
          الجنس:

          <Radio name='gender' value='ذكر' onChange={e => this.onChange(e)} />
          ذكر
          <Radio name='gender' value='أنثى' onChange={e => this.onChange(e)} />
          أنثى
        </label>

        <p>
          <button type='submit' disabled={loading}>
            {loading ? 'Sending data...' : 'Submit'}
          </button>
        </p>
      </StyledForm>
    )
  }
}
