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
    user_fullName: '',
    nationalID: ''
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (this.props.getFormFields) {
      setTimeout(_ => this.props.getFormFields(this.state))
    }
  }
  render () {
    return (
      <StyledForm>
        <label htmlFor='user_fullName'>
          الاسم الكامل:
        </label>
        <input
          type='text'
          name='user_fullName'
          onChange={e => this.change(e)}
        />
        <label htmlFor='nationalID'>
          رقم الهوية:
        </label>
        <input type='text' name='nationalID' onChange={e => this.change(e)} />

        <label htmlFor='gender'>
          الجنس:
          <Radio name='gender' value='ذكر' onChange={e => this.change(e)} />
          ذكر
          <Radio name='gender' value='أنثى' onChange={e => this.change(e)} />
          أنثى
        </label>
      </StyledForm>
    )
  }
}
