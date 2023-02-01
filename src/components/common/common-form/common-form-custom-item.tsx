import React from 'react'
import { MD5 } from '../../../services/others/helpers-md5'

const CommonFormCustomItem = ({ value, onChange }: any) => {
  return (
    <div style={{display: 'flex'}}>
      <div
        style={{
          width: '1.2rem',
          height: '1.2rem',
          borderRadius: '3rem',
          backgroundColor: '#' + Math.floor(parseFloat('0.' + (value ? parseInt(MD5(value).replace(/[a-z]/g, '')) : '000')) * 16777215).toString(16),
          margin: '0 auto',
        }}
      >
      </div>
      <div><b>{value}</b></div>
    </div>
  )
}

export default CommonFormCustomItem
