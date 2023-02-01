import React, { useEffect, useState } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import ExtraAddressManagementColumnModel from './extra-address-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'
import { Form,Button, Col, Row, Input, InputNumber } from 'antd'
import { ApiRequest } from '../../../../services/api/api'
// import TextArea from 'antd/lib/input/TextArea'


const ExtraAddressManagementPage = (props: {customerId: any, isReadOnly?: boolean}):any => {
  const [form] = Form.useForm()  
  const [noteToWarehouse, setNoteToWarehouse] = useState<string>();
  const [noteToProduction, setNoteToProduction] = useState<string>();
  const [customerCredit, setCustomerCredit] = useState<number>();
  
  const [customer, setCustomer] = useState<any>();
  useEffect(() => {
    ApiRequest({
      url: 'customer/GetCustomerById?id='+props.customerId,
      method: 'get',
    }).then((res) => {
      setNoteToWarehouse(res.data.data.noteToWarehouse)
      setNoteToProduction(res.data.data.noteToProduction)
      setCustomerCredit(res.data.data.customerCredit)
      setCustomer(res.data.data)
      form.setFieldsValue({
        noteToWarehouse: res.data.data.noteToWarehouse,
        noteToProduction: res.data.data.noteToProduction,
        customerCredit: res.data.data.customerCredit
      })
    })
  }, [])
  
  const formFinishHandler = () => {
    ApiRequest({
      url: '/Customer/UpdateCustomer',
      method: 'put',
      data: {...customer,
        noteToWarehouse:noteToWarehouse,
        noteToProduction:noteToProduction,
        customerCredit:customerCredit}
    })
  }
  return (
    <div>
      <Form form={form} onFinish={formFinishHandler}>
        <Row>
          {/* <Col span={2}>
          <label htmlFor="noteToWarehouse">
            <b>Note to warehouse:</b>
          </label>
          </Col> */}
          <Col span={16}>
          <Form.Item name="noteToWarehouse" label="Note To Warehouse" rules={[{ required: true, message: 'You need to input' }]}>
            <Input style={{width:'100%'}} id="noteToWarehouse" onChange={(e: any) => setNoteToWarehouse(e.target?.value)}></Input > 
          </Form.Item> 
          </Col>
          <Col span={16}>
          <Form.Item name="noteToProduction" label="Note To Production" rules={[{ required: true, message: 'You need to input' }]}>
            <Input style={{width:'100%'}} id="noteToProduction" onChange={(e: any) => setNoteToProduction(e.target?.value)}></Input > 
          </Form.Item> 
          </Col>          
          {/* <Col span={4}>
          <Form.Item name="customerCredit"  label="Credit" rules={[{ required: true, message: 'You need to input' }]}>
            <InputNumber style={{width:'100%'}} id="customerCredit" onChange={(e: any) => {setCustomerCredit(e);console.log(e)}}></InputNumber > 
          </Form.Item> 
          </Col>           */}
          <Col span={4}>
              <Button type="primary" onClick={formFinishHandler} >
                  Save
              </Button>
          </Col>        
        </Row>
      </Form>
    <CommonTablePage
      urlInfoKey={urlKey.ExtraAddress}
      title="Delivery Address Management"
      column={ExtraAddressManagementColumnModel.ExtraAddressManagementColumn}
      isNotDeletable={props.isReadOnly}
      isNotEditable={props.isReadOnly}
      isNotAddable={props.isReadOnly}
      mappingRenderData={(data: any) => data.filter((row: any) => row.customerId === props.customerId)}
      mappingUpdateData={(dataDetail: any) => {
        console.log(dataDetail)
        return {...dataDetail,
           customerId: props.customerId,
           deliveryMethodId:dataDetail.deliveryMethod.deliveryMethodId
          }
      }}
    />
    </div>
  )
}

export default ExtraAddressManagementPage
