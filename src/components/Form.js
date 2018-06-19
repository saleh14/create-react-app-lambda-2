import React, { Component } from 'react'
import styled from 'styled-components'

const StyledForm = styled.form`

`
const TextInput = styled.input.attrs({ type: 'text' })`
    line-height: 1.4em;
    box-sizing: border-box;
    max-width:360px;
    font-size: normal;
    padding: 5px 8px;
    margin-left: 1em;
`

const Section = styled.div`
margin: 0 auto;
max-width: 860px;
display: flex;
/* background-color:khaki; */
margin-top:22px;
border-top: solid 2px #cc9 ;
> form{
  /* background-color:ivory; */
  width:100%;
}
`
const SectionTitle = styled.div`
margin: 26px 12px;
text-align:right;
/* background-color:lavenderblush; */
font-size:120%;
font-weight:bold;
width:33%;
box-sizing:border-box;
color:#555;
`
const SectionBody = styled.div`
  text-align:right;
  direction:rtl;
  /* background-color: lavender; */
  display: flex;
  width:66%;
  flex-direction: column;
  margin:  0 auto;
  > input{
    line-height: 1.4em;
    box-sizing: border-box;
    max-width:360px;
    font-size: normal;
    padding: 5px 8px;
    }
  >label{
    margin-top: 1.5em;
    margin-bottom: .4em;

  }
`

const Radio = styled.input.attrs({ type: 'radio' })`
  margin: 10px;
`

/*
 *  Form Component
 */

export default class Form extends Component {
  state = {
    userFullName: '',
    nationalID: '',
    gender: '',
    work: null,
    education: null
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
      gender: '',
      work: '',
      education: ''
    })
    e.target.reset()
  }

  render () {
    const { loading } = this.props
    return (
      <form onSubmit={this.onSubmit}>
        <Section>
          <SectionBody>
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
            <input
              type='text'
              name='nationalID'
              onChange={e => this.onChange(e)}
            />

            <label htmlFor='gender'>
              الجنس:

              <Radio
                name='gender'
                value='ذكر'
                onChange={e => this.onChange(e)}
              />
              ذكر
              <Radio
                name='gender'
                value='أنثى'
                onChange={e => this.onChange(e)}
              />
              أنثى
            </label>

          </SectionBody>
          <SectionTitle> معلومات المتبرع</SectionTitle>
        </Section>
        <Section>
          <SectionBody>
            <label htmlFor=''>
              المستوى التعليمي:
            </label>
            <input
              type='text'
              name='education'
              onChange={e => this.onChange(e)}
            />
            <label htmlFor='education'>
              المستوى التعليمي:
            </label>
            <TextInput name='education' onChange={e => this.onChange(e)} />
            <label htmlFor='education'>
              المستوى التعليمي:
            </label>

            <TextInput name='education' onChange={e => this.onChange(e)} />

          </SectionBody>
          <SectionTitle>التعليم و العمل</SectionTitle>
        </Section><Section>
          <SectionBody>
            <label htmlFor='education'>
              المستوى التعليمي:
            </label>
            <input
              type='text'
              name='education'
              onChange={e => this.onChange(e)}
            />

            <label htmlFor='work'>
              جهة العمل:
              <br />
              <Radio
                name='work'
                value='حكومي'
                onChange={e => this.onChange(e)}
              />
              حكومي
              <Radio
                name='work'
                value='قطاع خاص'
                onChange={e => this.onChange(e)}
              />
              قطاع خاص
              <Radio
                name='work'
                value='other'
                onChange={e => this.onChange(e)}
              />
              أخرى .
              <span>.. </span>
              {this.state.work === 'other' && <input type='text' />}
            </label>

          </SectionBody>
          <SectionTitle>التعليم و العمل</SectionTitle>
        </Section>
        <Section>
          <SectionBody>
            <label htmlFor='education'>
              المستوى التعليمي:
            </label>
            <input
              type='text'
              name='education'
              onChange={e => this.onChange(e)}
            />

            <label htmlFor='work'>
              جهة العمل:
              <br />
              <Radio
                name='work'
                value='حكومي'
                onChange={e => this.onChange(e)}
              />
              حكومي
              <Radio
                name='work'
                value='قطاع خاص'
                onChange={e => this.onChange(e)}
              />
              قطاع خاص
              <Radio
                name='work'
                value='other'
                onChange={e => this.onChange(e)}
              />
              أخرى .
              <span>.. </span>
              {this.state.work === 'other' && <input type='text' />}
            </label>

          </SectionBody>
          <SectionTitle>التعليم و العمل</SectionTitle>
        </Section><p>
          <button type='submit' disabled={loading}>
            {loading ? 'Sending data...' : 'Submit'}
          </button>
        </p>
      </form>
    )
  }
}
