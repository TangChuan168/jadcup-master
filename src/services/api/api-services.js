import axios from 'axios'
import {Spin} from 'antd'
import ReactDOM from 'react-dom'
import React from 'react'
import SweetAlertService from '../lib/utils/sweet-alert-service'
import {baseUrl} from './base-url'
import {checkUrlAlertException} from './no-err-alert-urls'

// 设置基础的url
axios.create({
  baseURL: baseUrl,
  timeout: 5000,
})

let requestCount = 0

const style1 = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: '9999',
  color: 'white',
}

const showLoading = () => {
  if (requestCount === 0) {
    let dom = document.createElement('div')
    dom.setAttribute('id', 'loading')
    document.body.append(dom)
    ReactDOM.render(<Spin style={style1} size="large" tip={'Loading...'} />, dom)
  }
  requestCount++
}

const hideLoading = () => {
  requestCount--
  if (requestCount === 0) {
    document.body.removeChild(document.getElementById('loading'))
  }
}

// axios.defaults.baseURL = 'https://api.example.com';

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //spinner

  if (config.headers.isLoading !== false) {
    showLoading()
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response, '请求成功返回的数据')
  if (response.config.headers.isLoading !== false) {
    setTimeout(hideLoading, 1000)
    if (response.config.method !== 'get' && response.config.url !== 'Employee/VerifyPassword' && checkUrlAlertException(response.config.url)) {
      SweetAlertService.successMessage('')
    }
    // console.log(response,'sss')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response?.config.headers.isLoading !== false) {
    setTimeout(hideLoading, 1000)
    // SweetAlertService.errorMessage(
    //   error.response?.data?.message?.message ||
    //   error.response?.data?.title ||
    //   'Failed! Please contact admin.'
    // )
  }
  console.log(error, '响应返回的错误信息')
  console.log(error.response, '响应返回的错误信息2')
  // console.log(error.message,'网络问题')
  if (error.response?.data && checkUrlAlertException(error.response?.config?.url)) {
    SweetAlertService.errorMessage(
      error.response?.data?.message?.message ||
      error.response?.data?.title ||
      'Failed! Please contact admin.',
      error.response?.data?.innerMessage || getErrorsDetails(error.response?.data?.errors)
    )
  } else {
    SweetAlertService.errorMessage('Network Error')
  }
  return Promise.reject(error.response)
})

const getErrorsDetails = (data) => {
  if (!data) {
    return ''
  }
  let result = ''
  for (const [key, value] of Object.entries(data)) {
    result += `${key}: [${value}] `
  }
  return result
}

export default axios
