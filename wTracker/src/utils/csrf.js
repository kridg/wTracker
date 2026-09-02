let csrfToken = null

export const setCsrfToken = (token) => {
  csrfToken = token
}

export const getCsrfToken = () => csrfToken

export const applyCsrfHeader = (config) => {
  if (csrfToken && config.method && config.method.toLowerCase() !== "get") {
    config.headers["X-CSRFToken"] = csrfToken
  }
  return config
}
