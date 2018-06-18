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
class IdentityAPI {
  constructor (apiURL, token) {
    this.apiURL = apiURL
    this.token = token
  }

  headers (headers = {}) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      ...headers
    }
  }

  parseJsonResponse (response) {
    return response.json().then(json => {
      if (!response.ok) {
        return Promise.reject({ status: response.status, json })
      }

      return json
    })
  }

  request (path, options = {}) {
    const headers = this.headers(options.headers || {})
    return fetch(this.apiURL + path, { ...options, headers }).then(response => {
      const contentType = response.headers.get('Content-Type')
      if (contentType && contentType.match(/json/)) {
        return this.parseJsonResponse(response)
      }

      if (!response.ok) {
        return response.text().then(data => {
          return Promise.reject({ stauts: response.status, data })
        })
      }
      return response.text().then(data => {
        data
      })
    })
  }
}

/*
  Fetch a user from GoTrue via id
*/
function fetchUser (identity, id) {
  const api = new IdentityAPI(identity.url, identity.token)
  return api.request(`/admin/users/${id}`)
}

/*
 Update the app_metadata of a user
*/
function updateUser (identity, user, app_metadata) {
  const api = new IdentityAPI(identity.url, identity.token)
  const new_app_metadata = { ...user.app_metadata, ...app_metadata }

  return api.request(`/admin/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify({ app_metadata: new_app_metadata })
  })
}

const oneHour = 60 * 60 * 1000
export async function handler (event, context, callback) {
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

  const payload = JSON.parse(event.body)
  const formValues = payload.formFields
  console.log(payload)
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
          values: [[claims.email, ...Object.values(formValues)]]
        })
      })
        .then(() => {
          callback(null, { statusCode: 204 })
        })
        .catch(err => {
          callback(null, {
            statusCode: 500,
            body: 'Internal Server Error: ' + e
          })
        })
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: 'could not access the token' + e
      })
    })
}
