import React from 'react'
import { commonFilterFn, getRandomKey } from '../../../../../services/lib/utils/helpers'
import { Button, Popover } from 'antd'
import ItipsForProduct from '../../../../../components/common/i-tips/product'
import moment from 'moment'
import { AlertOutlined } from '@ant-design/icons'

export const myfiler=(
  filterValue:any,
  rowData:any
) => {
  const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1);
  for (let ele of rowData){
    const prodName = ele.product?.productName.replace(/-/g, '\u2011').trim();
    if (prodName.indexOf(filter) >=0) return true;
  }
  return false;
}  
const WorkOrderManagementColumnModel = (props: any) => {
  return [
    {
      title: 'Product Code',
      field: 'productCode',
      // defaultSort: 'asc'
      customFilterAndSearch: (inputValue: any, rowData: any) => commonFilterFn(inputValue.replace(/^\s*|\s*$/g,""), rowData.productCode.replace(/^\s*|\s*$/g,""))
    },
    {
      title: 'Product',
      field: 'productFilter',
      sorting: false,
      customFilterAndSearch: (inputValue: any, rowData: any) => commonFilterFn(inputValue.replace(/^\s*|\s*$/g,""), rowData.product.productName.replace(/^\s*|\s*$/g,"")),
      // customFilterAndSearch:(        filterValue:any,
      //   rowData:any) =>myfiler(
      //   filterValue,
      //   rowData
      // ),
      render: (rowData: any) => rowData.product ? <ItipsForProduct id={rowData.productId} label={rowData.product.productName} /> : null
    },
    {
      title: 'Qty',
      field: 'quantity',
      render: (rowData: any) => {
        return (
          <div>
            {rowData.quantity}
            {
              rowData.workOrderStatusId === -1 ? (
                <div key={getRandomKey()}>
                  <Button
                    type={'primary'}
                    onClick={() => {
                      props.updateQuantity(rowData)
                    }}
                  >Edit quantity</Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
    {
      title: 'Order Type',
      field: 'orderType',
      sorting: false,
      lookup: { 1: 'Normal order', 2: 'Raw to semi', 3: 'Semi to products' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.orderTypeId?.toString()) : true,
      render: (rowData: any) => rowData.orderType?.orderTypeName
    },
    {
      title: 'Source',
      field: 'workOrderSource',
      sorting: false,
      lookup: { 1: 'Sales Order', 2: 'Manual', 3: 'Inventory', 4: 'Redo', 5: 'Makeup' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.workOrderSourceId?.toString()) : true,
      render: (rowData: any) => rowData.workOrderSource?.workOrderSourceName
    },
    {
      title: 'Created By',
      field: 'createdEmployeeName',
    },
    {
      title: 'Status',
      field: 'workOrderStatus',
      sorting: false,
      defaultFilter: ['-1', '1', '2'],
      lookup: { '-1': 'New', 1: 'Appr', 2: 'Prog', 10: 'Comp', 0: 'Canc' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.workOrderStatusId?.toString()) : true,
      render: (rowData: any) => {
        const name = rowData.workOrderStatus?.workOrderStatusName
        return (
          <div>
            {name}
            {
              rowData.workOrderStatusId === -1 ? (
                <div key={getRandomKey()}>
                  <Button danger
                    type="primary"
                    onClick={() => {
                      props.updateApproveStatus(rowData)
                    }}
                  >Approve</Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
    {
      title: 'Change Comments',
      field: 'workOrderStatus',
      sorting: false,
      // defaultFilter: ['-1', '1', '2'],
      // lookup: { '-1': 'New', 1: 'Appr', 2: 'Prog', 10: 'Comp', 0: 'Canc' },
      customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.workOrderStatusId?.toString()) : true,
      render: (rowData: any) => {
        return (
          <div>
            {
              <div key={getRandomKey()}>
                <Button
                  type="primary"
                  onClick={() => {
                    props.updateStatusComments(rowData)
                    console.log(rowData)
                  }}
                >Change</Button>
              </div>
            }
          </div>
        )
      }
    },
    {
      title: 'Action',
      field: 'actionId',
      sorting: false,
      lookup: { 1: 'Printing', 2: 'Die-Cutting', 3: 'Production', 4: 'Packaging' },
      render: (rowData: any) => rowData.actionDto?.actionName
    },
    {
      title: 'Created At',
      field: 'createdAt1',
      render: (rowData: any) => moment.utc(rowData.createdAt1).local().format('DD/MM/YYYY'),
    },
    {
      title: 'REQ Date',
      field: 'requiredDate1',
      render: (rowData: any) => moment.utc(rowData.requiredDate1).local().format('DD/MM/YYYY'),
    },
    {
      title: 'Urgent',
      field: 'urgent',
      initialEditValue: 0,
      align: 'left',
      sorting: false,
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'},
      render: (rowData: any) => {
        return (
          <div>
            {
              rowData.urgent == 1 && 
                <div>
                <Popover
                  content={rowData.urgentNote}
                  title={<div style={{ textAlign: 'center' }}>Urgent</div>}>
                  <AlertOutlined style={{ textAlign: 'center' ,fontSize: '24px', color: 'red' }} />
                </Popover>
                </div>
            }            
            {
              ![10, 0].includes(rowData.workOrderStatusId) ? (
                <div key={getRandomKey()}>
                  <Button 
                    danger={rowData.urgent}
                    onClick={() => {
                      props.updateUrgent(rowData)
                    }}
                  >Change</Button>
                </div>
              ) : null
            }
          </div>
        )
      }
    },
    {
      title: 'Comments',
      field: 'comments',
    },
  ]
}

export default WorkOrderManagementColumnModel
