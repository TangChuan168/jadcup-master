import { Button, Input } from 'antd'
import React, { useState } from 'react'
import { ApiRequest } from '../../../services/api/api'

const ConfirmReturnDialog = (props: any) => {
  const {onDialogClose, selectedReturnData} = props
  const [invoiceNote, setInvoiceNote] = useState<any>()

  const onConfirm = () => {
    ApiRequest({
      url: 'Dispatching/ConfirmReturnItem?returnId=' + selectedReturnData.returnId + '&invoiceNote=' + invoiceNote,
      method: 'put'
    }).then((res) => {
      console.log(res)
      onDialogClose()
    })
  }

  return (
    <div style={{ width: '97%', margin: '0 auto 1rem' }}>
      <Input style={{width: '300px'}} placeholder='Enter your invoice note here.' onChange={(e) => setInvoiceNote(e.target?.value)}/>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '2rem'}}>
        <Button type='primary' disabled={!invoiceNote || invoiceNote === ''}
          onClick={onConfirm}>
          Confirm
        </Button>
        <Button style={{marginLeft: '1rem'}}
          onClick={() => onDialogClose()}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ConfirmReturnDialog