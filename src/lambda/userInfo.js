const fetch = require('node-fetch')
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
function updateUser (identity, user, user_metadata) {
  const api = new IdentityAPI(identity.url, identity.token)
  const new_user_metadata = { ...user.user_metadata, ...user_metadata }

  return api.request(`/admin/users/${user.sub}`, {
    method: 'PUT',
    body: JSON.stringify({ user_metadata: new_user_metadata })
  })
}

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

  const { userinfoFields } = JSON.parse(event.body)
  const { identity, user } = context.clientContext
  updateUser(identity, user, userinfoFields)
    .then(() => {
      callback(null, { statusCode: 204 })
    })
    .catch(err => {
      callback(null, { statusCode: 500, body: 'Internal Server Error: ' + err })
    })
}
