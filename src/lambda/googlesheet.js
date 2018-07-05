const fetch = require('node-fetch')
try {
  require('dotenv').config()
} catch (e) {}
const { GoogleToken } = require('gtoken')
// const slackURL = process.env.SLACK_WEBHOOK_URL
const sheetID = process.env.GOOGLE_SHEET_ID
const postURL = `https://content-sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1:append?valueInputOption=USER_ENTERED&alt=json`
const getURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/A1%3AS1?majorDimension=ROWS&fields=values`
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

  const claims = context.clientContext && context.clientContext.user
  if (!claims) {
    return callback(null, {
      statusCode: 401,
      body: 'You must be signed in to call this function'
    })
  }

  const { user_metadata, donationFields } = JSON.parse(event.body)
  console.log(user_metadata)
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
      fetch(getURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json; charset=UTF-8'
        }
      })
        .then(res => {
          return res.json()
        })
        .then(data => {
          console.log(data)
          let [headerRow] = data.values

          console.log(headerRow)
          let receivedRow = [
            ['accountEmail', claims.email],
            ...Object.entries(user_metadata),
            ...Object.entries(donationFields)
          ]

          console.log(receivedRow)
          sortedRow = ['accountEmail', ...headerRow]

          Object.entries(receivedRow).forEach(([key, value]) => {
            const index = sortedRow.indexOf(key) >= 0
              ? sortedRow.indexOf(key)
              : sortedRow.push(null) - 1
            sortedRow[index] = value
          })
          fetch(postURL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              majorDimension: 'ROWS',
              values: [[...headerRow]]
            })
          }).then(() => {
            callback(null, {
              statusCode: 204,
              body: `this is the token: ${token}`
            })
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
        body: 'Internal Server Error: ' + err
      })
    })
}
