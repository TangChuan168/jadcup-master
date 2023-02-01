import CommonForm, { ItemElementPropsInterface } from '../../../../../../components/common/common-form/common-form'
import { Button, DatePicker, Input, InputNumber, Switch } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../../services/api/api'
import { urlKey, urlType } from '../../../../../../services/api/api-urls'
import React, { useEffect, useState } from 'react'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'
import { getCookie } from 'react-use-cookie'

interface IFormValues {
  customerId?: any
  employeeId?: any
  orderTypeId?: any
  workOrderSourceId?: any
  productId?: any
  quantity?: any
  comments?: any
  urgent?: any
  requiredDate?: any
}

const WorkOrderAddDialog = (props: {onDialogClose: any, isStockMonitor?: boolean}) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [orderTypeOptions, setOrderTypeOptions] = useState([])
  const [workOrderSourceOptions, setWorkOrderSourceOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])

  useEffect(() => {
    // console.log(props.orderData)
    setInitFormValues({
      workOrderSourceId: props.isStockMonitor ? 3 : 2,
      requiredDate: moment().add(14, 'days'),
    })
    getSelectOptions(urlKey.Customer).then(res => setCustomerOptions(res))
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.OrderType).then(res => setOrderTypeOptions(res))
    getSelectOptions(urlKey.WorkOrderSource).then(res => setWorkOrderSourceOptions(res))
    getSelectOptions('', 'Product/GetAllProduct?withOutStock=true').then(res => setProductsOptions(res))
  }, [])

  const formItems: ItemElementPropsInterface[] | any = [
    // {name: 'customerId', label: 'Customer', rules: [{required: false}], inputElement: commonFormsSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
    // {name: 'employeeId', label: 'Sales', inputElement: commonFormsSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'productId', label: 'Product', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Product, productsOptions)},
    {name: 'quantity', label: 'Quantity', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
    {name: 'orderTypeId', label: 'Order Type', rules: [{required: true}], inputElement: commonFormSelect(urlKey.OrderType, orderTypeOptions)},
    {name: 'workOrderSourceId', label: 'Order Source', inputElement: commonFormSelect(urlKey.WorkOrderSource, workOrderSourceOptions, [], true)},
    {name: 'requiredDate', label: 'REQ Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'urgent', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    {name: 'comments', label: 'Comment', isWholeRowWidth: true, inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    // console.log(changedValues)
    // console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    switch (changedValuesKey) {
      case 'customerId':
        if (!changedValues['customerId']) {
          getSelectOptions('', 'Product/GetAllProduct?withOutStock=true').then(res => setProductsOptions(res))
          return
        }
        if (changedValues['customerId']) {
          setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'productId':
        if (changedValues['productId']) {
          setProductInfosToForm(changedValues['productId'], newValues, form)
          return
        }
        break
    }
  }

  const setProductInfosToForm = async (productId: any, newValues: any, form: any) => {
    // console.log(index)
    // console.log(productId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.Product,
      type: urlType.GetById,
      dataId: productId,
      isShowSpinner: false
    })
    if (result) {
      const productInfos = result.data.data
      const updatedValues = {
        ...newValues,
        // quantity: productInfos.minOrderQuantity
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const setCustomerInfosToForm = async (customerId: any, newValues: any, form: any) => {
    getSelectOptions('', 'Product/GetProductByCustomerId?id=' + customerId).then(res => setProductsOptions(res))
    const result = await ApiRequest({
      urlInfoKey: urlKey.Customer,
      type: urlType.GetById,
      dataId: customerId,
      isShowSpinner: false
    })
    if (result) {
      const customerInfos = result.data.data
      const updatedValues = {
        ...newValues,
        customerId: customerInfos.customerId,
        employeeId: customerInfos.employeeId,
        productId: null,
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    const employeeId = parseInt(getCookie('id'))
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      // console.log(formValues)
      const requestValues = {
        ...formValues,
        urgent: formValues.urgent ? 1 : 0,
        workOrderStatusId: 1,
        createdEmployeeId:employeeId,
        approvedEmployeeId:employeeId
      }
      // console.log(requestValues)
      const result = await ApiRequest({
        urlInfoKey: urlKey.WorkOrder,
        type: urlType.Create,
        data: requestValues
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
        <Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
        >Confirm</Button>
      </div>
    </div>
  )
}

export default WorkOrderAddDialog
