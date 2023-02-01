import React from 'react'
import { Button } from 'antd'

const CommonButton = (props: {name: string, restProps?: any}) => {
  const buttonProps: any = {
    style: {margin: '0.5rem'},
    type: 'primary',
    ...props.restProps
  }
  return <Button {...buttonProps}>{props.name}</Button>
}

export default CommonButton
