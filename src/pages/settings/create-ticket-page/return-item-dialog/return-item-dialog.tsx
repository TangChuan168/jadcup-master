import React, { useEffect, useState } from 'react'
import { Button, InputNumber, Input } from 'antd'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { getCookie } from 'react-use-cookie'

interface IFormValues {
  quantityPerBox: any,
  operEmployeeId: any,
  boxQty: any,
  comments: any,
}

const ReturnItemDialog = (props: { onDialogClose: any, ticketData: any}): any => {
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  // const [employeeOptions, setEmployeeOptions] = useState([])
  const [formRef, setFormRef] = useState<any>()
  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  useEffect(() => {
    console.log(props.ticketData)
    setInitFormValues({
      ...props.ticketData,
    })    
    // getSelectOptions(urlKey.Employee).then(res => {
	  //   setEmployeeOptions(res)
    // })
  }, [props.ticketData])
  const formItems: ItemElementPropsInterface[] | any = [
    // {name: 'operEmployeeId', label: 'Operating Employee', span:6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'])},
    { name: 'quantityPerBox', label: 'Quantity Per Box', span:3,  rules: [{required: true}], inputElement: <InputNumber /> },
    { name: 'boxQty', label: 'Box Quantity', span:3,  rules: [{required: true}], inputElement: <InputNumber /> },
    { name: 'comments', label: 'Comments', span:24, rules: [{required: true}], inputElement: <Input.TextArea style={{height: "180px", display:"block"}}/> },
  ]
  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }
  const returnItem = async (formValues: any) => {
    const requestValues = {
      productId: props.ticketData.order.orderProduct[0].productId,
      operEmployeeId: parseInt(getCookie('id')),
      ticketId: props.ticketData.ticketId,
      salesEmployeeId: props.ticketData.order.employeeId,
      quantityPerBox: formValues.quantityPerBox,
      boxQty: formValues.boxQty,
      comments: formValues.comments,     
    }
    const result =
      await ApiRequest({
        url: '/ReturnItem/AddReturnItem',
        method: 'post',
        data: requestValues,
        isShowSpinner: false
      })  
    if (result) {
      await SweetAlertService.successMessage('Submit successfully')
      props.onDialogClose(true)
    }
    return result
  }
  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    // if (props.isNewTicket) {
      if (formValues) {
        await returnItem(formValues)
      }
  }
 
  return (
    <div style={{ width: '97%', margin: '0 auto 1rem' }}>
      {/* <h2 style={{ fontSize: '14px' }}>Creat Ticket</h2> */}
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur}  initFormValues={initFormValues}/>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{ marginRight: '2rem' }}
        >Cancel
        </Button>
        <Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
        >Confirm
        </Button>
      </div>
    </div>
  )
}

export default ReturnItemDialog
