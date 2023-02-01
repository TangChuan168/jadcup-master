import Swal from 'sweetalert2'
import React from 'react'

type inputTypes = 'textarea' | 'text' | 'number' | any

const getDefaultValue: (type:any) => any = (type:any) => {
  switch (type) {
    case 'textarea':
      return ''
    case 'text':
      return ''
    case 'number':
      return 0
    default:
      return ''
  }
}

export default class SweetAlertService {

  static successMessage = async (message?: string) => {
    await Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      timer: 2000
    })
  }
  static errorMessage = async (messageText?: any, innerMessage?: any) => {
    await Swal.fire({
      title: 'Error!',
      html: messageText ? messageText : '',
      icon: 'error',
      allowOutsideClick: false,
      allowEnterKey: false,
      allowEscapeKey: false,
      showCancelButton: !!innerMessage,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Close',
      confirmButtonColor: innerMessage ? '#b1b0b0' : '#d33',
      confirmButtonText: innerMessage ? 'Show details' : 'Ok'
    }).then(res => {
      console.log(res)
      if (res.isConfirmed && innerMessage) {
        Swal.fire({
          title: 'Error Details',
          html: innerMessage || '',
          allowEnterKey: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          icon: 'warning'
        })
      }
    })
  }

  static confirmMessage: (message?: any) => Promise<boolean> = async (message?: any) => {

    return await Swal.fire({
      title: 'Are you sure?',
      html: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then(res => {
      return !!res.value
    })

  }

  static inputConfirm = async ({ type, title = 'Confirm', placeholder = 'Comment', defaultValue = getDefaultValue(type), inputOptions, handleRequired }: { type?: inputTypes; title?: string; placeholder?: string; defaultValue?: any, inputOptions?: any, handleRequired?: boolean}) => {

    // @ts-ignore
    return await Swal.fire({
      title: title,
      input: type,
      inputValue: defaultValue || null,
      inputPlaceholder: placeholder,
      inputValidator: handleRequired ? null : result => !result && 'Required!',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      inputOptions: inputOptions,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
      allowOutsideClick: () => !Swal.isLoading()
    }).then(res => {
      if (res.isConfirmed) {
        return res.value || null
      } else {
        return undefined
      }
    })
  }
}
