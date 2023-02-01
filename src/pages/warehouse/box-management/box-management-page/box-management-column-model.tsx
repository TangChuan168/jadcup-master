import React from 'react'
import moment from 'moment'

export const BoxManagementColumnModel = (props?: any) => {
  return [
    {
      title: 'Box Bar Code',
      align: 'left',
      field: 'barCode'
    },
    {
      title: 'Product',
      align: 'left',
      field: 'productName'
    },
    {
      title: 'Created At',
      align: 'left',
      field: 'createdAt1',
      render: (rowData: any) =>moment.utc( rowData.createdAt1).local().format('DD/MM/YYYY'),
    },
    {
      title: 'Quantity',
      align: 'left',
      field: 'quantity',
      render: (rowData: any) => {
        return (
          <div>
            <div>{rowData.quantity}</div>
            <div>{props.qtyButton(rowData)}</div>
          </div>
        )
      },
    },
    {
      title: 'Position',
      align: 'left',
      field: 'position'
    },
    {
      title: 'Pallet',
      align: 'left',
      field: 'palletCode'
    },
    {
      title: 'RM PO Number',
      align: 'left',
      field: 'purchaseNo'
    },
  ]
}
