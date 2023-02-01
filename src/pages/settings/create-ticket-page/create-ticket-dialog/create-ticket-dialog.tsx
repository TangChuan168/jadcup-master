import React, { useEffect, useState } from 'react'
import { Button, InputNumber, Input } from 'antd'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'

interface IFormValues {
  content: any,
  employeeId: any,
  customerId: any,
  contactNo: any,
  contectPerson: any,
  ticketType: any,
  orderId: any,
  assignedEmployeeId: any,
  comments: any,
}

const CreateTicketDialog = (props: { isAdmin:boolean, isNewTicket: boolean, onDialogClose: any, ticketData: any}): any => {
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [customerOptions, setCustomerOptions] = useState([])  
  const [customerId, setCustomerId] = useState(false)
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [orderOptions, setOrderOptions] = useState([])
  const [order, setOrder] = useState(false)
  const [ticketOptions, setTicketOptions] = useState([])
  const [formRef, setFormRef] = useState<any>()
  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  useEffect(() => {
    // console.log(props.ticketData)
    setInitFormValues({
      ...props.ticketData
    })    
    getSelectOptions(urlKey.Customer).then(res => {
	    setCustomerOptions(res)
    })
    getSelectOptions(urlKey.Employee).then(
      res => {
      if (props.isAdmin) setEmployeeOptions(res)
      else {
        const {assignedEmployeeId} = props.ticketData?.ticketProcess[0]
        const filterRes = res.filter((x: any) => x.employeeId != assignedEmployeeId)
        setEmployeeOptions(filterRes)
      }
    })
    getSelectOptions(urlKey.TicketType).then(res => {
	    setTicketOptions(res)
    })
    getSelectOptions(urlKey.SalesOrder).then(res => {
	    setOrderOptions(res)
    })
  }, [props.ticketData])
  const onChangeCustomer = (value: any) => {
    setOrder(false)
    getSelectOptions(urlKey.SalesOrder).then(res => {
      setCustomerId(value)
	    setOrderOptions(res.filter((x:any)=>x.customerId === value))
    })
  }
  const onChangeOrder = (value: any) => {
    setOrder(value)
  }
  // const commentsTitle = props.isNewTicket ? "Comments" : "Process Note"
  const open = props.ticketData?.ticketProcess ?
    props.ticketData?.ticketProcess.some((tp: any)=> tp.processed === 0 )
  : 
    false
  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', span:6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company'], !props.isNewTicket, onChangeCustomer)},
    { name: 'orderId', label: 'Order Number', span:12, rules: [{required: true}], inputElement: commonFormSelect(urlKey.SalesOrder, orderOptions, ['orderNo', 'deliveryName', 'comments'], !props.isNewTicket || !customerId, onChangeOrder)},
    { name: 'contectPerson', label: 'Contact Person', span:6, inputElement: <Input disabled={!props.isNewTicket}/> },
    {name: 'employeeId', label: 'Employee', span:6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], !props.isNewTicket)},
    {name: 'ticketType', label: 'Ticket Type', span:6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.TicketType, ticketOptions, ['ticketTypeName'], !props.isNewTicket, null, 'ticketType1')},
    { name: 'contectNo', label: 'Contact Number', span:12, inputElement: <Input disabled={!props.isNewTicket}/> },
    { name: 'content', label: 'content', span:24, inputElement: <Input.TextArea style={{height: "180px", display:"block"}} disabled={!props.isNewTicket}/> },
    !props.isNewTicket && { name: 'comments', label: "Comments", span:24, rules: [{required: !props.isAdmin || open}], inputElement: <Input.TextArea style={{height: "180px", display:"block"}} /> },
    {name: 'assignedEmployeeId', label: 'Assign To', span:6, rules: [{required: props.isNewTicket}], inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'])},
  ]
  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }
  const addTicketProcess = async (formValues: any) => {
    // console.log(formValues.assignedEmployeeId)
    const requestValues2 = {
      assignedEmployeeId: formValues.assignedEmployeeId,
      // comments: formValues.comments,        
      ticketId: props.ticketData.ticketId
    }
    const result =
      await ApiRequest({
        url: '/TicketProcess/AddTicketProcess',
        method: 'post',
        data: requestValues2,
        isShowSpinner: false
      })
    if (result) {
      await SweetAlertService.successMessage('Submit successfully')
    }
    return result
  }
  const processTicket = async (formValues: any) => {
    const processId = props.ticketData.ticketProcess.find((x: any) => x.processed === 0)?.processId
    const requestValues = {
      processId,
      comments: formValues.comments,      
      processed: 1,  
    }
    // console.log(requestValues)
    const result =
      await ApiRequest({
        url: '/TicketProcess/ProcessTicketProcess',
        method: 'put',
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
    if (props.isNewTicket) {      
      if(!order) {
        SweetAlertService.errorMessage('Please select correct order')
      } else {
        if (formValues) {
          const requestValues = {
            ...formValues,
            ticketType: parseInt(formValues.ticketType),
            ticketProcess : {
              assignedEmployeeId: formValues.assignedEmployeeId,
              comments: formValues.comments,
            }
          }
          // console.log(requestValues)
          const result =
            await ApiRequest({
              urlInfoKey: urlKey.Ticket,
              type: urlType.Create,
              data: requestValues,
              isShowSpinner: false
            })
          if (result) {
            await SweetAlertService.successMessage('Submit successfully')
            props.onDialogClose(true)
          }
        }
      }      
    } else {      
      if (formValues.assignedEmployeeId) {      
        const result = await addTicketProcess(formValues) 
      } 
      if (formValues.comments){        
        const result = await processTicket(formValues) 
      }            
      props.onDialogClose(true)
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

export default CreateTicketDialog
