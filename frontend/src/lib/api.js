const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

function getToken() {
  return localStorage.getItem('token')
}

async function request(endpoint, { method = 'GET', body, headers: extraHeaders = {} } = {}) {
  const token = getToken()

  const headers = {
    ...extraHeaders,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),

  upload: (endpoint, formData) =>
    request(endpoint, { method: 'POST', body: formData }),
}
