import { Button, Input } from 'antd'
import moment from 'moment'
import React from 'react'
export const ReturnColumnModel = (onConfirm?: any, onDownloadPDF?: any) => {
    return [
      {
        title: 'Customer',
        align: 'left',
        field: 'customer'
      },
      {
        title: 'PackingSlip',
        align: 'left',
        field: 'packingSlip'
      },
      {
        title: 'Dispatch Status',
        align: 'left',
        field: 'type',
        render: (rowData: any) => rowData.type === 0 ? 'Dispatch' : 'Deliveied'
      },
      {
        title: 'Created At',
        align: 'left',
        field: 'createdAt',
        render: (rowData: any) => moment.utc(rowData.createdAt).local().format('DD/MM/YYYY'),
      },
      {
        title: 'Created By',
        align: 'left',
        field: 'createdBy',
      },
      {
        title: 'Invoiceed',
        align: 'left',
        field: 'type',
        render: (rowData: any) => rowData.type === 1 ? 'Yes' : 'No',
      },        
      {
        title: 'Return Reason',
        align: 'left',
        field: 'reason',
      },
      {
        title: 'Credit or Replace',
        align: 'left',
        field: 'creditReplacement',
        render: (rowData: any) => rowData.creditReplacement ? (rowData.creditReplacement === 1 ? 'Credit' : 'Replacement') : '',
      },
      {
        title: 'Confirmed',
        align: 'left',
        field: 'isConfirm',
        render: (rowData: any) => rowData.isConfirm ? (rowData.isConfirm === 0 ? 'Not Confirm' : 'Confirmed') : '',
      },
    
      {
        title: 'Action',
        align: 'left',
        field: '',
        render: (rowData: any) => (rowData.type != 1 ||rowData.isConfirm == null )? null :
          (rowData.isConfirm === 1 ? <Button danger type="primary" onClick={() => onDownloadPDF(rowData)}>DownloadPDF</Button> :
          <Button type="primary" onClick={() => onConfirm(rowData)}>Confirm</Button>)
      }
    ]
  }
