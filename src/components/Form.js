import React, { Component } from 'react'
import styled from 'styled-components'
import Rajhi_bank_logo from '../assets/images/Al_Rajhi_Bank_Logo.svg'
import Awal_bank_logo from '../assets/images/Alawal_Bank_Logo.svg'
import Arabi_bank_logo from '../assets/images/Anb_bank_logo.svg'
import Ahli_bank_logo from '../assets/images/Alahli-01.svg'
import Samba_bank_logo from '../assets/images/Samba_Bank_Logo.svg'
import Riyadh_bank_logo from '../assets/images/Riyad_Bank_logo.svg'
import SABB_Bank_Logo from '../assets/images/SABB_Bank_Logo.svg'
import NCB_bank_logo from '../assets/images/NCB.svg'
import Fransi_bank_logo from '../assets/images/Saudi-French-Bank.gif'

// import { ReactComponent as Logo } from '../assets/images/NCB.svg'

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
  >label{
    margin-top: 1.5em;
    margin-bottom: .4em;

  }
`

const Radio = styled.input.attrs({ type: 'radio' })`
  margin: 10px;
`

const PairInputs = styled.div`
display:inline-flex;
justify-content:space-between;
text-align:right;
font-size: large;
> span{
  padding:26px 32px;
  border-radius: 50%;
  margin: 0 30px
}

> label{
  margin: 10px 11px;
  padding-right: 18px;
}
`
const InactiveStepLabel = styled.label`
  color:#988;
`
const InactiveStepNo = styled.span`
  color:#dcc;
  background-color:#899;
`
const ActiveStepLabel = styled.label`
  color:#344;
`
const ActiveStepNo = styled.span`
  color: #dcc;
  background-color:#344;
`
const BanksRadio = styled.input.attrs({ type: 'radio', name: 'bankSelection' })`
  line-height: 2em;
  padding: 2em;
  border-bottom: #987 solid 1px;

`
const BankItem = styled.label`
line-height: 1.8em;
font-size: larger;
padding-top: .8em;
color: #433211;
display:block;
border-bottom:solid 1px #db9;
>span {
  height: 2.0em;
  padding-right:1em;
  display:inline-flex;
  >img{
    height: 100%;
  }
}
> div{
  margin:0;
  display:black;
  padding:0;
  color:#865;
  font-size:small;
}

`
/*
 *  Form Component
 */

export default class Form extends Component {
  state = {
    formStep: 1,
    userFullName: '',
    nationalID: '',
    gender: '',
    work: null,
    education: null,
    paymentType: null,
    paymentTransfer: null
  }
  onChange = e => {
    this.props.onChange({
      [e.target.name]: e.target.value
    })
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSave = e => {
    e.preventDefault()
    this.props.onSave(this.state)
    console.log(e)
    this.setState({
      userFullName: '',
      nationalID: '',
      gender: '',
      work: '',
      education: ''
    })
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.state)
  }
  render () {
    const { loading, userinfo } = this.props
    const { formStep } = this.props

    return (
      <React.Fragment>

        {formStep === 1 &&
          <form onSubmit={this.onSave}>

            <PairInputs>
              <InactiveStepNo> 2 </InactiveStepNo>
              <ActiveStepNo> 1 </ActiveStepNo>
            </PairInputs>
            <br />
            <PairInputs>
              <InactiveStepLabel> تفاصيل الإستقطاع</InactiveStepLabel>
              <ActiveStepLabel>معلومات المتبرع </ActiveStepLabel>
            </PairInputs>
            <Section>
              <SectionBody>
                <label htmlFor='userFullName'>
                  الاسم الكامل:
                </label>
                <TextInput
                  name='userFullName'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.userFullName) || ''}
                />
                <label htmlFor='nationalID'>
                  رقم الهوية:
                </label>
                <TextInput
                  name='nationalID'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.nationalID) || ''}
                />

                <label htmlFor='gender'>
                  الجنس:

                  <Radio
                    name='gender'
                    value='ذكر'
                    onChange={e => this.onChange(e)}
                    defaultChecked={userinfo && userinfo.gender === 'ذكر'}
                  />

                  ذكر
                  <Radio
                    name='gender'
                    value='أنثى'
                    onChange={e => this.onChange(e)}
                    defaultChecked={userinfo && userinfo.gender === 'أنثى'}
                  />
                  أنثى
                </label>

              </SectionBody>
              <SectionTitle> معلومات المتبرع</SectionTitle>
            </Section>
            <Section>
              <SectionBody>
                <label htmlFor='address'> العنوان </label>
                <TextInput
                  name='address'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.address) || ''}
                />

                <label htmlFor='postalBox'> صندوق البريد </label>
                <TextInput
                  name='postalBox'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.postalBox) || ''}
                />

                <label htmlFor='postalCode'> الرمز البريدي: </label>
                <TextInput
                  name='postalCode'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.postalCode) || ''}
                />
              </SectionBody>
              <SectionTitle>العنوان</SectionTitle>
            </Section><Section>
              <SectionBody>
                <label htmlFor='email'>
                  البريد الالكتروني:
                </label>
                <TextInput
                  name='email'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.email) || ''}
                />

                <label htmlFor='contactNumber'>
                  رقم التواصل:
                </label>
                <TextInput
                  name='contactNumber'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.contactNumber) || ''}
                />
              </SectionBody>
              <SectionTitle>معلومات الاتصال</SectionTitle>
            </Section>
            <Section>
              <SectionBody>
                <label htmlFor='education'>
                  المستوى التعليمي:
                </label>
                <TextInput
                  name='education'
                  onChange={e => this.onChange(e)}
                  defaultValue={(userinfo && userinfo.education) || ''}
                />

                <label htmlFor='work'>
                  جهة العمل:
                  <br />
                  <Radio
                    name='work'
                    value='حكومي'
                    onChange={e => this.onChange(e)}
                    defaultChecked={userinfo && userinfo.work === 'حكومي'}
                  />
                  حكومي
                  <Radio
                    name='work'
                    value='قطاع خاص'
                    onChange={e => this.onChange(e)}
                    defaultChecked={userinfo && userinfo.work === 'قطاع خاص'}
                  />
                  قطاع خاص
                  <Radio
                    name='work'
                    value='other'
                    onChange={e => this.onChange(e)}
                    defaultChecked={userinfo && userinfo.work === 'other'}
                  />
                  أخرى .
                  <span>.. </span>
                  {this.state.work === 'other' &&
                    <TextInput
                      name='otherWork'
                      onChange={e => this.onChange(e)}
                      defaultValue={(userinfo && userinfo.otherWork) || ''}
                    />}
                </label>

              </SectionBody>
              <SectionTitle>التعليم و العمل</SectionTitle>
            </Section><p>
              <button type='submit' disabled={loading}>
                {loading ? 'Sending data...' : 'حفظ'}
              </button>
            </p>
          </form>}

        {formStep === 2 &&
          <form onSubmit={this.onSubmit}>

            <PairInputs>
              <ActiveStepNo> 2 </ActiveStepNo>
              <InactiveStepNo> 1 </InactiveStepNo>
            </PairInputs>
            <br />
            <PairInputs>
              <ActiveStepLabel> تفاصيل الإستقطاع</ActiveStepLabel>
              <InactiveStepLabel> معلومات المتبرع</InactiveStepLabel>
            </PairInputs>

            <Section>
              <SectionBody>
                <label htmlFor='deductionAmount'>
                  قيمة الإستقطاع
                </label>
                <TextInput
                  name='deductionAmount'
                  onChange={e => this.onChange(e)}
                />

                <label htmlFor='deductionPeriod'>
                  مدة الإتستقطاع
                </label>
                <TextInput
                  name='deductionPeriod'
                  onChange={e => this.onChange(e)}
                />
                <label htmlFor='startFrom'>
                  تاريخ بداية الإستقطاع

                </label>
                <TextInput name='startFrom' onChange={e => this.onChange(e)} />
                <label htmlFor='donatorAccountNumber'>
                  رقم حسابك
                </label>
                <TextInput
                  name='donatorAccountNumber'
                  onChange={e => this.onChange(e)}
                />
                <label htmlFor='paymentType'>
                  {' '}كيفية الدفع
                  <br />
                  <label>
                    <Radio
                      name='paymentType'
                      value='شهري'
                      onChange={e => this.onChange(e)}
                    />
                    شهري
                  </label>
                  <label>
                    <Radio
                      name='paymentType'
                      value='نصف سنوي'
                      onChange={e => this.onChange(e)}
                    />
                    نصف سنوي
                  </label>
                  <label>
                    <Radio
                      name='paymentType'
                      value='سنوي'
                      onChange={e => this.onChange(e)}
                    />
                    سنوي
                  </label>
                </label>
                <label htmlFor='paymentTransfer'>
                  طريقة الدفع
                  <br />
                  <label>
                    <Radio
                      name='paymentTransfer'
                      value='نقداَ'
                      onChange={e => this.onChange(e)}
                    />
                    نقداَ
                  </label>
                  <label>
                    <Radio
                      name='paymentTransfer'
                      value='تحويل إلكتروني'
                      onChange={e => this.onChange(e)}
                    />
                    تحويل إلكتروني
                  </label>
                  <label>
                    <Radio
                      name='paymentTransfer'
                      value='إيداع مباشر'
                      onChange={e => this.onChange(e)}
                    />
                    إيداع مباشر
                  </label>
                </label>
              </SectionBody>
              <SectionTitle>تفاصيل استقطاعك</SectionTitle>
            </Section>
            <Section>
              <SectionBody>
                <label htmlFor='bankSelection'>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='arabi1'
                    />
                    البنك الوطني العربي
                    <span><img src={Arabi_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='arabi2'
                    />
                    البنك الوطني العربي
                    <span><img src={Arabi_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='samba'
                    />
                    مجموعة سامبا المالية
                    <span><img src={Samba_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='riyadhBank'
                    />
                    بنك الرياض
                    <span><img src={Riyadh_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='fransi'
                    />
                    البنك السعودي الفرنسي
                    <span><img src={Fransi_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio onChange={e => this.onChange(e)} value='awal' />
                    البنك الأول
                    <span><img src={Awal_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='alahli'
                    />
                    البنك الأهلي التجاري
                    <span><img src={NCB_bank_logo} height='1em' /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio onChange={e => this.onChange(e)} value='sabb' />
                    ساب
                    <span><img src={SABB_Bank_Logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>
                  <BankItem>

                    <BanksRadio
                      onChange={e => this.onChange(e)}
                      value='rajhi'
                    />
                    مصرف الراجحي
                    <span><img src={Rajhi_bank_logo} /></span>
                    <div> SA010005648631635868 </div>
                  </BankItem>

                </label>
              </SectionBody>
              <SectionTitle>اختيار البنك</SectionTitle>
            </Section><p>
              <button type='submit' disabled={loading}>
                {loading ? 'Sending data...' : 'حفظ'}
              </button>
            </p>
          </form>}
      </React.Fragment>
    )
  }
}
