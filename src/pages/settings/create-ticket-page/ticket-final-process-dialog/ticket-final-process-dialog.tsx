import React, { useEffect, useState } from 'react'
import { Button, InputNumber, Input } from 'antd'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import CommonTable, { CommonTablePropsInterface } from '../../../../components/common/common-table/common-table'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { toLocalDate, toLocalDateTime } from '../../../../services/lib/utils/helpers'
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

const CreateTicketDialog = (props: { onDialogClose: any, ticketData: any}): any => {
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [customerOptions, setCustomerOptions] = useState([])
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [orderOptions, setOrderOptions] = useState([])
  const [ticketOptions, setTicketOptions] = useState([])
  const [formRef, setFormRef] = useState<any>()
  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  useEffect(() => {
    console.log(props.ticketData)
    setInitFormValues({
      ...props.ticketData,
    })
    getSelectOptions(urlKey.Customer).then(res => {
	    setCustomerOptions(res)
    })
    getSelectOptions(urlKey.Employee).then(res => {
	    setEmployeeOptions(res)
    })
    getSelectOptions(urlKey.TicketType).then(res => {
	    setTicketOptions(res)
    })
    getSelectOptions(urlKey.SalesOrder).then(res => {
	    setOrderOptions(res)
    })
  }, [props.ticketData])
  const commentsTitle = 'Result'
  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', span: 6, inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company'], true)},
    { name: 'orderId', label: 'Order Number', span: 6, inputElement: commonFormSelect(urlKey.SalesOrder, orderOptions, ['orderNo'], true)},
    { name: 'contectPerson', label: 'Contact Person', span: 12, inputElement: <Input disabled={true}/> },
    {name: 'employeeId', label: 'Employee', span: 6, inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'ticketType', label: 'Ticket Type', span: 6, inputElement: commonFormSelect(urlKey.TicketType, ticketOptions, ['ticketTypeName'], true)},
    { name: 'contectNo', label: 'Contact Number', span: 12, inputElement: <Input disabled={true}/> },
    { name: 'content', label: 'content', span: 24, inputElement: <Input.TextArea style={{height: '180px', display: 'block'}} disabled={true}/> },
  ]
  const formItem: ItemElementPropsInterface[] | any = [
    { name: 'comments', label: commentsTitle, span: 24, rules: [{required: true}], inputElement: <Input.TextArea style={{height: '180px', display: 'block'}}/> },

  ]
  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }
  const addTicketProcess = async (formValues: any) => {
    const requestValues2 = {
      assignedEmployessId: formValues.assignedEmployeeId,
      comments: formValues.comments,
      ticketId: props.ticketData.ticketId
    }
    // console.log(requestValues2)
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
    const requestValues = {
      processId: props.ticketData.ticketProcess[0].processId,
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
    if (true) {
      if (formValues) {
        const requestValues = {
          ...formValues,
          ticketId: props.ticketData.ticketId,
          closed: 1,
          result: formValues.comments,
          redelivery: 0,
        }
        console.log(requestValues)
        const result =
          await ApiRequest({
            url: '/Ticket/CloseTicket',
            method: 'put',
            data: requestValues,
            isShowSpinner: false
          })
        if (result) {
          await SweetAlertService.successMessage('Submit successfully')
          props.onDialogClose(true)
        }
      }
    } else {
      if (formValues.assignedEmployeeId) {
        const result = await addTicketProcess(formValues)
        if (result) {
          const result2 = await processTicket(formValues)
        }
      } else {
        const result = await processTicket(formValues)
      }
    }
  }
  // const ReturnItemColumnModel = (props: any) => {
  //   return [
  //     {
  //       title: 'Product',
  //       field: 'productName',
  //       filtering: false,
  //       render: (rowData: any) => rowData.product.productName
  //     },
  //     {
  //       title: 'Box Quantity',
  //       field: 'boxQty',
  //       filtering: false,
  //     },
  //     {
  //       title: 'Comments',
  //       field: 'comments',
  //       filtering: false,
  //     },
  //   ]
  // }
  const TicketProcessColumnModel = (props: any) => {
    return [
      {
        title: 'Employee',
        field: 'employee',
        filtering: false,
        render: (rowData: any) => rowData.assignedEmployee.firstName + ' ' + rowData.assignedEmployee.lastName
      },
      {
        title: 'Box Quantity',
        field: 'boxQty',
        filtering: false,
      },
      {
        title: 'Created At',
        field: 'createdAt',
        filtering: false,
        render: (rowData: any) => toLocalDateTime(rowData.createdAt),
      },
      {
        title: 'Completed At',
        field: 'completedAt',
        filtering: false,
        render: (rowData: any) => toLocalDateTime(rowData.completedAt),
      },
      {
        title: 'Comments',
        field: 'comments',
        filtering: false,
      },
    ]
  }
  // const returnItemTableProps: CommonTablePropsInterface = {
  //   initData: props.ticketData.returnItem,
  //   title: 'Return Item',
  //   column: ReturnItemColumnModel ,
  //   isNotEditable: true,
  //   isNotAddable: true,
  //   defaultPageSize: 5,
  // }
  const ticketProcessTableProps: CommonTablePropsInterface = {
    initData: props.ticketData.ticketProcess,
    title: 'Ticket Process',
    column: TicketProcessColumnModel,
    isNotEditable: true,
    isNotAddable: true,
    defaultPageSize: 5,
  }
  return (
    <div style={{ width: '97%', margin: '0 auto 1rem' }}>
      {/* <h2 style={{ fontSize: '14px' }}>Creat Ticket</h2> */}
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues}/>
      {/* <CommonTable {...returnItemTableProps} /> */}
      <br />
      <CommonTable {...ticketProcessTableProps} />
      <CommonForm items={formItem} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues}/>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{ marginRight: '2rem' }}
        >Cancel
        </Button>
        <Button
          disabled={true}
          onClick={onConfirm}
          type="primary"
          style={{ marginRight: '2rem' }}
        >Credit Customer
        </Button>
        <Button
          disabled={true}
          onClick={onConfirm}
          type="primary"
          style={{ marginRight: '2rem' }}
        >ReDelivery
        </Button>
        <Button
          disabled={true}
          onClick={onConfirm}
          type="primary"
          style={{ marginRight: '2rem' }}
        >Destroy Returns
        </Button>
        <Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
        >CLose
        </Button>
      </div>
    </div>
  )
}

export default CreateTicketDialog
