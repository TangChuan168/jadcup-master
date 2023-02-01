import React from 'react'
import {Button, Result} from 'antd';

const unExitPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => window.location.href = '/home'}>Back Home</Button>}
      style={{flex: 1}}
    />
  )
}

export default unExitPage