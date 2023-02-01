import { Button, Popover } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { ApiRequest } from '../../../../services/api/api'

interface IProps {
  id: number;
  label?: string;
  isNotCutting?: boolean;
}

const ItipsForOrderDetails: React.FC<IProps> = (props) => {
  const [visible, setVisible] = useState(false)
  const [getWorkOrderData, setGetWorkOrderData] = useState<any>({})
  const [getDispatchingData, setGetDispatchingData] = useState<any>({})
  const [getInvoiceData, setGetInvoiceData] = useState<any>({})
  const [getOrderData, setGetOrderData] = useState<any>({})  

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible)
    props.id &&
      ApiRequest({
        url: 'Dispatching/GetAllDispatching?orderId=' + props.id,
        method: 'get',
        isShowSpinner: false,
      }).then((res) => {
        setGetDispatchingData(res.data.data)
      })
    props.id &&
      ApiRequest({
        url: 'Invoice/GetAllInvoice?orderId=' + props.id,
        method: 'get',
        isShowSpinner: false,
      }).then((res) => {
        setGetInvoiceData(res.data.data)
      })
    props.id &&
      ApiRequest({
        url: 'WorkOrder/GetAllWorkOrder?orderId=' + props.id,
        method: 'get',
        isShowSpinner: false,
      }).then((res) => {
        setGetWorkOrderData(res.data.data)
      })
      props.id &&
      ApiRequest({
        url: 'SalesOrder/GetOrderById?id=' + props.id,
        method: 'get',
        isShowSpinner: false,
      }).then((res) => {
        setGetOrderData(res.data.data)
      })      
  }

  const getRowRender = (name: string, data?: string, warningData?: string, successData?: string) => (
    <div style={{wordWrap: 'break-word', display: 'flex', marginBottom: '0.4rem'}}>
      <div style={{ minWidth: '50px' }}>
        <strong>{name}:</strong>
      </div>
      <div>
        <span style={{ wordBreak: 'break-all' }}>&nbsp;&nbsp;{data}</span>
        <span style={{ wordBreak: 'break-all', color: 'red' }}>
          <strong>&nbsp;&nbsp;{warningData}</strong>
        </span>
        <span style={{ wordBreak: 'break-all', color: 'green' }}>
          <strong>&nbsp;&nbsp;{successData}</strong>
        </span>
      </div>
    </div>
  )

  const dispatchProductCodeQty = (dispatchArray: any) => {
    const array: any = []
    dispatchArray.dispatchingDetails.forEach((detail: any) => {
      const productDetail: any = {}
      productDetail.productCode = detail.box?.product?.productCode
      productDetail.quantity = detail.quantity
      array.push(productDetail)
    })

    const productArray = Array.from(
      new Set(array.map((item: any) => item.productCode))
    ).map((item: any) => {
      return { productCode: item, quantity: 0 }
    })
    productArray.forEach((item: any) => {
      array.forEach((i: any) => {
        if (item.productCode === i.productCode) {
          item.quantity += i.quantity
        }
      })
    })
    let productString = ''
    productArray.forEach((item: any) => {
      productString += item.productCode + ' *' + item.quantity
      productString +=
        productArray.indexOf(item) !== productArray.length - 1 ? ', ' : ''
    })
    return productString
  }

  const content = (
    <div style={{ minWidth: '500px' }}>
      <h4>Work Order</h4>
      {getWorkOrderData[0]?.workOrderId ? (
        getWorkOrderData.map((item: any) => (
          <div key={item.workOrderId} style={{ margin: '0.4rem' }}>
            {getRowRender(
              'Work Order ' + (getWorkOrderData.indexOf(item) + 1),
              item.product?.productCode + ', QTY:' + item.quantity + (item.workOrderStatus?.workOrderStatusName === 'Progressing' ? ', ' + item.actionDto?.actionName : '')
              + (item.workOrderStatus?.workOrderStatusName !== 'Completed' ? ', ' + item.workOrderStatus?.workOrderStatusName : ''), '',
              item.workOrderStatus?.workOrderStatusName === 'Completed' ? item.workOrderStatus?.workOrderStatusName : ''
            )}
          </div>
        ))
      ) : (
        <strong style={{ margin: '0.4rem', color: 'grey' }}>
          No Work Order Details for this order.
        </strong>
      )}
      <h4>Packing Slip</h4>
      {getDispatchingData[0]?.dispatchId ? (
        getDispatchingData.map((item: any) => (
          <div style={{ margin: '0.4rem' }}>
            {getRowRender(
              'Packing Slip Details',
              item.packingSlipNo +
                ', ' +
                moment.utc(item.createdAt).local().format('DD/MM/YYYY') +
                ', ' +
                dispatchProductCodeQty(item)
            )}
          </div>
        ))
      ) : (
        <strong style={{ margin: '0.4rem', color: 'grey' }}>
          No Packing Slip Details for this order.
        </strong>
      )}
      <h4>Invoice</h4>
      {getInvoiceData[0]?.invoiceId ? (
        getInvoiceData.map((item: any) => (
          <div key={item.invoiceId} style={{ margin: '0.4rem' }}>
            {Math.sign(item.totalPrice) >= 0
              ? getRowRender('Invoice Status', '$ ' + item.totalPrice.toFixed(2), item?.paid === 0 ? 'Not Paid' : '', item?.paid === 1 ? 'Paid' : '')
              : getRowRender('Invoice Refund', '$', item.totalPrice.toFixed(2))}
          </div>
        ))
      ) : (
        <strong style={{ margin: '0.4rem', color: 'grey' }}>
          No Invoice Details for this order.
        </strong>
      )}
      <h4>Address</h4>
        <strong style={{ margin: '0.4rem', color: 'grey' }}>
          {getOrderData.deliveryAddress}
        </strong>
    </div>
  )

  return (
    <Popover
      content={content}
      placement='right'
      title={<h4 style={{ textAlign: 'center' }}>Order Details</h4>}
      trigger='hover'
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button type='primary' ghost>
        Details
      </Button>
    </Popover>
  )
}

export default ItipsForOrderDetails
