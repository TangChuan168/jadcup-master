import React, {useEffect, useState} from 'react'
import CommonTable from '../../../../components/common/common-table/common-table'
import {salesOrder} from '../../../../mock/salesorder'
import {getRandomKey} from '../../../../services/lib/utils/helpers'
import {Modal, Button} from 'antd'
import SubOrder from '../sub-orders'

const SalesOrder = () => {
  useEffect(() => {
    setData(salesOrder())
    // console.log(salesOrder())
  }, [])
  const [data, setData] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [contentInModal, setContentInModal] = useState<any>([])

  const showModal = (rowdata:any) => {
    console.log(rowdata)
    // setIsModalVisible(true)

  }
  const getRowId = (rowData:any) => {
    console.log(rowData.orderNo, 'id')
    console.log(rowData, 'rowData')
    setIsModalVisible(true)
    setContentInModal(rowData)
  }
  const tableColumn = [
    { title: 'Order No', field: 'orderNo' },
    { title: 'Customer', field: 'customers' },
    { title: 'Product', field: 'product' },
    { title: 'Qty', field: 'qty'},
    { title: 'Created Date', field: 'createdDate', type: 'date' },
    { title: 'REQ Date', field: 'ReqDate', type: 'date' },
    { title: 'Comment', field: 'comments' },
    { title: 'Deliver Date', field: 'deliverDate' },
    { title: 'Payment', field: 'payment' },
    { title: 'Actions', field: 'actions',
      render: (rowData: any) => {
        // console.log(rowData)
        return (
          <div>
            <Button type="primary" onClick={() => getRowId(rowData)}>Detail</Button>
          </div>
        )
      }},
  ]

  const handleOk = () => {
    setIsModalVisible(false)
  }
  return (
    <div>
      <CommonTable title={'SalesOrder'} column={tableColumn} initData={data}/>
      <DetailModal onOk={handleOk} visible={isModalVisible} data={contentInModal} onCancel={() => setIsModalVisible(false)}/>
    </div>
  )
}

const DetailModal = (props:{onOk:any, visible: boolean, data:any, onCancel:()=>void}) => {
  const {onOk, visible, data, onCancel} = props
  console.log(props)
  return (
    <Modal
      title="Details"
      visible={visible}
      onOk={onOk}
      style={{ top: 20 }}
      width={1000}
      // confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      {/*<p>{data.product}</p>*/}
      <SubOrder/>
    </Modal>
  // <div>ss</div>
  )
}

export default SalesOrder
