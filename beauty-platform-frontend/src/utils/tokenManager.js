/* ACCESS TOKEN */

export const setAccessToken = (token) => {

localStorage.setItem("access_token", token)

}

export const getAccessToken = () => {

return localStorage.getItem("access_token")

}

export const removeAccessToken = () => {

localStorage.removeItem("access_token")

}


/* REFRESH TOKEN */

export const setRefreshToken = (token) => {

localStorage.setItem("refresh_token", token)

}

export const getRefreshToken = () => {

return localStorage.getItem("refresh_token")

}

export const removeRefreshToken = () => {

localStorage.removeItem("refresh_token")

}


/* CLEAR ALL TOKENS */

export const clearTokens = () => {

removeAccessToken()
removeRefreshToken()

}