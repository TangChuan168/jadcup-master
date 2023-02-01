import {setCookie, getCookie} from 'react-use-cookie'

export const authenticated = () => {
  const token = getCookie('token')
  if (token && token.length) {
    return true
  } else {
    return false
  }
}

export const getUserId = () => {
  return parseInt(getCookie('id'), 10)
}

export const getUserName = () => {
  return getCookie('userName')
}

export const getCustomerUserId = () => {
  return getCookie('customerUserId')
}

export const getName = () => {
  return getCookie('name')
}

export const login = (data:any, callback:any) => {
  console.log(data)
  localStorage.setItem('pages', JSON.stringify(data.pages))
  setCookie('token', data.token, {days: 1})
  setCookie('userName', data.userName)
  setCookie('name', data.name)
  setCookie('email', data.email)
  setCookie('id', data.employeeId)
  callback()
}

export const loginCustomer = (data:any, callback:any) => {
  console.log(data)
  setCookie('customerUserId', data.customerId)
  callback()
}

export const logoutCustomer = (callback: any) => {
  callback()
  setCookie('customerUserId', '')
}

export const logout = (callback: any) => {
  callback()
  localStorage.removeItem('pages')
  setCookie('token', '')
  setCookie('email', '')
  setCookie('userName', '')
  setCookie('name', '')
}
