import React, {useEffect, useState} from 'react'
import CommonTable from '../../../../components/common/common-table/common-table'
import {salesOrder} from '../../../../mock/salesorder'
import {getRandomKey} from '../../../../services/lib/utils/helpers'
import {Modal, Button} from 'antd'

const SameBatch = () => {
  useEffect(() => {
    setData(salesOrder())
    // console.log(salesOrder())
  }, [])
  const [data, setData] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [contentInModal, setContentInModal] = useState<any>([])

  const showModal = (rowData:any) => {
    // console.log(rowData.orderNo,'id')
    // console.log(rowData,'rowData')
    setIsModalVisible(true)
    setContentInModal(rowData)
  }
  const tableColumn = [
    { title: 'Box Number', field: 'orderNo' },
    { title: 'Product', field: 'product' },
    { title: 'Qty', field: 'qty'},
    { title: 'Status', field: 'status' },
    { title: 'Make Date', field: 'makeDate', type: 'date' },
    { title: 'Actions', field: 'actions',
      render: (rowData: any) => {
        return (
          <div>
            <Button type="primary" onClick={() => showModal(rowData)}>Detail</Button>
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

const DetailModal = (props:{onOk:()=>void, visible: boolean, data:any, onCancel:()=>void}) => {
  const {onOk, visible, data, onCancel} = props
  console.log(props)
  return (
    <Modal
      title="Details"
      visible={visible}
      onOk={onOk}
      destroyOnClose={true}
      // confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <p>{data.product}</p>
    </Modal>
  // <div>ss</div>
  )
}

export default SameBatch
