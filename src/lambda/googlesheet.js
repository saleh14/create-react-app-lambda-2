const fetch = require('node-fetch')
try {
  require('dotenv').config()
} catch (e) {}
const { GoogleToken } = require('gtoken')
// const slackURL = process.env.SLACK_WEBHOOK_URL
const sheetID = process.env.GOOGLE_SHEET_ID
const fullUrl = `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:append?valueInputOption=USER_ENTERED&alt=json`
const serviceAccount = process.env.SERVICE_ACC_ID
const serviceAccKey = `-----BEGIN PRIVATE KEY-----
${process.env.SERVICE_ACC_KEY.replace(/\ /g, '\n')}
-----END PRIVATE KEY-----`
const oneHour = 60 * 60 * 1000
export function handler (event, context, callback) {
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 410,
      body: 'Unsupported Request Method'
    })
  }

  // const claims = context.clientContext && context.clientContext.user
  // if (!claims) {
  //   return callback(null, {
  //     statusCode: 401,
  //     body: 'You must be signed in to call this function'
  //   })
  // }

  const { userinfoFields, donationFields } = JSON.parse(event.body)
  console.log(userinfoFields)
  const gtoken = new GoogleToken({
    email: serviceAccount,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    key: serviceAccKey
  })
  /*   const token = await gtoken.getToken()
  console.log(token) */

  gtoken
    .getToken()
    .then(token => {
      fetch(fullUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
          majorDimension: 'ROWS',
          values: [
            [
              // claims.email,
              ...Object.values(userinfoFields),
              ...Object.values(donationFields)
            ]
          ]
        })
      })
        .then(() => {
          callback(null, {
            statusCode: 204,
            body: `this is the token: ${token}`
          })
        })
        .catch(err => {
          callback(null, {
            statusCode: 500,
            body: 'Internal Server Error: ' + err
          })
        })
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: 'could not access the token' + err
      })
    })
}
