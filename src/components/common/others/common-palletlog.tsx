import React, { useEffect, useState } from 'react'
import { Modal,Button, DatePicker, Divider, Input, InputNumber, Switch, Select, Form, } from 'antd'
import { commonFormSelect, getSelectOptions } from '../common-form/common-form-select'
import { allUrls, urlKey } from '../../../services/api/api-urls'
import { CloseCircleOutlined } from '@ant-design/icons'
import { ApiRequest } from '../../../services/api/api'
import { promises } from 'dns'



const CommonStocklog = (props:any) => {
  const [open, setOpen] = useState(props.open)
  const [customer,setCustomer] = useState(props.customerDetials)
  const [trans,settrans] = useState(props.tranType)
  const [customerOptions, setCustomerOptions] = useState([])

  const [SelectedTrantype, SetSelectedTrantype] = useState([])
  const [Selectedqty, SetSelectedqty] = useState([])
  const [SelectedNotes, SetSelectedNotes] = useState([])

  useEffect(() => {
    console.log('props record^^113',props.record)
    console.log('transaction types',trans)

	  setOpen(props.open)
  }, [props.open])

  const onClose = () => {
	  props.onDialogClose(false)
  }


  const changeValue =(key:number,value:number)=>{
    switch(key){
      case 1:
        value = value
        return value
      case 2:
        value = -value
        return value
      case 3:
        value = -value
        return value
      case 4:
        value = -value
        return value
      case 5:
        value = -value
        return value
    }
  }

  const onfinish = (fieldsValue:any) =>{
    console.log('record data in open dialog', props.record)
    console.log('tran type is:',fieldsValue['TranTypeId'])
    console.log('qty is:',fieldsValue['PlateQty'])
    console.log('notes is',fieldsValue['Notes'])
    debugger;
    let balance = changeValue(parseInt(props.record.tranTypeId),parseInt(fieldsValue['PlateQty']))
    let quant = changeValue(parseInt(props.record.tranTypeId),parseInt(fieldsValue['PlateQty']))

    const datas={
      DispatchId: props.record.dispatchId,
      EmployeeId: props.record.employeeId,
      CustomerId: props.record.customerId,
      PlateTypeId:props.record.plateTypeId,
      Balance:balance,
      Quantity:quant,
      Notes:fieldsValue['Notes'],
      StockId:props.record.stockId,


    }
    ApiRequest({
      url:'PalletLog/AddPalletLog',
      data:datas,
      method:'post'
    }).then((res:any)=>{
      console.log('updated log callback date @@999',res)
      if(res.data.success == true){
        props.onDialogClose()
      }

    })

  }

  return (
	  <Modal
      title={props.title || ''}
      centered={true}    
      style={{marginTop: '1rem', maxWidth: '1800px'}}
      width={'98%'}
      visible={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      closeIcon={<CloseCircleOutlined style={{fontSize: '1.5rem', marginRight: '2rem'}} />}
	  >
        <div style={ {width: '97%', margin: '0 auto 1rem'} }>
          <Form
          onFinish={onfinish}
          >              
              <Form.Item
              name='TranTypeId'
              label='TranType:'
              style={ {width: '40%', margin: '0 auto 1rem'}}             
              >             
                <Select
                >
                  {
                    props.tranType.map(
                      (x:any) => <Select.Option key={x.index} value={x.tranTypeId}>{x.tranName}</Select.Option>
                    )
                  }
                </Select>
                </Form.Item>

                <Form.Item name='PlateQty' label='Quantity:' style={ {width: '40%', margin: '0 auto 1rem'}}>                               
                    <Input type='number'/>
                </Form.Item>

                <Form.Item name='Notes' label='Notes:' style={ {width: '40%', margin: '0 auto 1rem'}}>           
                    <Input type='text'/>
                </Form.Item>

                <Form.Item style={ {width: '40%', margin: '0 auto 1rem'}}>
                <Button type='primary' htmlType='submit'
                style={{width:'25%'}}
                >Submit</Button>
              </Form.Item>
          </Form>
        </div>
	  </Modal>
  )
}

export default CommonStocklog


   