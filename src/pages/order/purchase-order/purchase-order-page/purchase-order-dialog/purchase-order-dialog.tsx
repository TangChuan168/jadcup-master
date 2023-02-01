import React, { useEffect, useState } from 'react'
import { urlKey, urlType } from '../../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../../components/common/common-form/common-form'
import { Button, DatePicker, Divider, Input, InputNumber, Switch } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import { getUserId } from '../../../../../services/lib/utils/auth.utils'
import moment from 'moment'
import { optionsArray } from '../purchase-order-column-model'
import debounce from 'lodash/debounce'

interface IPoDetail {
  rawMaterialId?: any
  quantity?: any
  price?: any
  unitPrice?: any
  comments?: string
  suplierProductCode?:string
}

interface IPoOption {
  poOptionId?: number
  poId?: number
  optionId: number
  price: number
}

interface IFormValues {
  poId?: any
  price?: number
  createdEmployeeId?: any
  suplierId?: any
  poNo?: any
  poDetail?: IPoDetail[]
  poOption?: IPoOption[]
}

const PurchaseOrderDialog = (props: { orderData: any, onDialogClose: any, isNewOrder: boolean }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [subtotal, setSubtotal] = useState(0)
  const [options, setOptions] = useState<IPoOption[]>([])

  // store selection options from apis request
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [supplierOptions, setSupplierOptions] = useState([])
  const [rawMaterialOptions, setRawMaterialOptions] = useState([])
  const [productOptionOptions, setProductOptionOptions] = useState([])

  useEffect(() => {
    console.log(props.orderData)
    setOptions(props.orderData.poOption)
    setInitFormValues({
      ...props.orderData,
      createdEmployeeId: props.orderData.createdEmployeeId?props.orderData.createdEmployeeId:getUserId(),
      deliveryDate: (props.orderData?.deliveryDate && moment(props.orderData.deliveryDate + '.000Z')) || null,
    })
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.Supplier).then(res => setSupplierOptions(res.filter((e:any) => e.active)))
    if (props.orderData.suplierId) {
      getRawMaterialOptions(props.orderData.suplierId)
    }
    getSelectOptions(urlKey.ProductOption).then(res => setProductOptionOptions(res))
  }, [props.orderData])

  const getRawMaterialOptions = (id: any) => {
    getSelectOptions(urlKey.RawMaterial, 'SupplierRawMaterial/GetRawMaterialDtoBySupplierId?supplierId=' + id)
    .then(res =>{
      let setData = res.map((e:any)=>{
        return {...e,...e.rawMaterial}
      })
      setRawMaterialOptions(setData)      
    }
   )
  }

  const isFormDisabled = props.orderData.poId && !(props.orderData.poStatusId && props.orderData.poStatusId === 1)

  const formItems: ItemElementPropsInterface[] | any = [
    // {name: 'poNo', label: 'PO Number', inputElement: <Input readOnly={isFormDisabled} />},
    {name: 'createdEmployeeId', label: 'Created By',span: 6, inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'suplierId', label: 'Supplier',span: 6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Supplier, supplierOptions, [], isFormDisabled)},
    {name: 'deliveryDate', label: 'Delivery Date',span: 6, inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'telNo', label: 'Telephone',span: 6, inputElement: <Input defaultValue="+64 09-282 3988" />},
    {name: 'deliveryInstruction', label: 'Delivery Instruction',span: 12, inputElement: <Input />},
    {name: 'deliveryAddr', label: 'Address',span: 12, inputElement: <Input   defaultValue="4 Pukekiwiriki Place, East Tāmaki, Auckland 2013, New Zealand"/>},
    [
      {name: ['poDetail', 'rawMaterialId'],span: 6, label: 'Description', rules: [{required: true}], inputElement: commonFormSelect(urlKey.RawMaterial, rawMaterialOptions, ['rawMaterialCode','rawMaterialName'], isFormDisabled)},
      {name: ['poDetail', 'suplierProductCode'], span: 4,label: 'Product Code', inputElement: <Input readOnly={true} />},
      {name: ['poDetail', 'unit'],  span:2 ,label: 'Unit', inputElement: <Input readOnly={true} />},
      {name: ['poDetail', 'unitPrice'],span:2 , label: 'Unit Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber readOnly={isFormDisabled} />},
      {name: ['poDetail', 'quantity'],span:2 , label: 'Quantity', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber readOnly={isFormDisabled} />},
      {name: ['poDetail', 'price'],span:2 , label: 'Price', inputElement: <InputNumber readOnly={true} />},
      {name: ['poDetail', 'comments'], label: 'Note', inputElement: <Input.TextArea readOnly={isFormDisabled} showCount={true} maxLength={150} autoSize={ true } />},
      // {name: ['poDetail', 'completed'], label: 'Completed', inputElement: <Switch disabled={!(props.orderData?.poStatusId && props.orderData?.poStatusId === 2)} />, otherProps: {valuePropName: 'checked'}},
    ],
    [
      {name: ['poOption', 'optionId'], span: 8, addButtonText: 'Add Option', label: 'Product Option', rules: [{required: true}], inputElement: commonFormSelect(urlKey.ProductOption, productOptionOptions)},
      {name: ['poOption', 'price'], span: 2, label: 'Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber step="0.01" />},
 
      // {name: ['orderOption', 'optionId'], span: 8, isNotEditable: props.isAwaitingDispatchPage, addButtonText: 'Add Option', label: 'Product Option', rules: [{required: true}], inputElement: commonFormSelect(urlKey.ProductOption, productOptionOptions)},
      // {name: ['orderOption', 'unitPrice'], span: 2, label: 'Unit Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber<string> stringMode step="0.01" disabled={true} />},
      // {name: ['orderOption', 'quantity'], span: 2, label: 'QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
      // {name: ['orderOption', 'price'], span: 2, label: 'Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber<string> stringMode step="0.01" disabled={true} />},
    ]
  ]

  const onFormChange = async (changedValues: any, newValues: any, form: any) => {
    // setSubtotal(getSubtotal(form))
    console.log(changedValues)
    console.log(newValues)
    setOptions(newValues.poOption)
    const changedValuesKey = Object.keys(changedValues)[0]
    if (changedValues.suplierId) {
      form.setFieldsValue({
        ...newValues,
        // deliveryAddr: supplierOptions.filter((row: any) => row.suplierId === changedValues.suplierId)[0]['address']
        deliveryAddr: "4 Pukekiwiriki Place, East Tāmaki, Auckland 2013, New Zealand",
        telNo:"+64 09-282 3988"
      })
      getRawMaterialOptions(changedValues.suplierId)
      return
    }
    if (changedValues.poDetail) {
      const poDetailIndex: any = changedValues.poDetail.length - 1
      const selectedPoDetail = newValues.poDetail[poDetailIndex]
      if (changedValues?.poDetail[poDetailIndex]?.hasOwnProperty("rawMaterialId") ){
        const formNewestValues = form.getFieldsValue()
        form.setFieldsValue({
          ...formNewestValues,
          poDetail: autoUnitPrice(formNewestValues, 'poDetail', poDetailIndex),
        })
      }
      // if (changedValues?.poDetail[poDetailIndex]?.hasOwnProperty("quantity") ||
      //   changedValues?.poDetail[poDetailIndex]?.hasOwnProperty("unitPrice")){
      //   const formNewestValues = form.getFieldsValue()
      //   form.setFieldsValue({
      //     ...formNewestValues,
      //     poDetail: autoPrice(formNewestValues, 'poDetail', poDetailIndex),
      //   })
      // }
      if (!changedValues.poDetail[poDetailIndex] || !selectedPoDetail.poDetailId) {
        return
      }
      if (!selectedPoDetail.completed) {
        // form.setFieldsValue(setPoDetailComplete(newValues, poDetailIndex, true))
        return
      }
      const result = await SweetAlertService.confirmMessage()
      if (result) {
        ApiRequest({
          url: 'PurchaseOrder/CompletePoDetail?poDetailId=' + selectedPoDetail.poDetailId,
          method: 'put',
          isShowSpinner: false
        }).then(_ => null)
      } else {
        form.setFieldsValue(setPoDetailComplete(newValues, poDetailIndex, false))
      }
    }
  }
  const autoUnitPrice= (value:any,col:string,index:number) =>{
    const row = value[col];
    const rawMaterial:any = rawMaterialOptions?.find((e:any)=>e.rawMaterialId == row[index].rawMaterialId);
    row[index].unitPrice = rawMaterial['unitPrice']?rawMaterial['unitPrice']:0;
    row[index].unit = rawMaterial['unit']?rawMaterial['unit']:"";
    row[index].comments = rawMaterial['description']?rawMaterial['description']:'';
    row[index].price = row[index].unitPrice*row[index].quantity;
    row[index].suplierProductCode = rawMaterial.suplierProductCode;
    return row;
  }
  const autoPrice= (value:any,col:string,index:number) =>{
    const row = value[col];
    if (row[index]?.unitPrice && row[index]?.quantity)
      row[index].price = row[index].unitPrice*row[index].quantity;
    return row;
  }  
  const setPoDetailComplete = (formNewValue: any, poDetailIndex: any, completed: boolean) => {
    return {
      ...formNewValue,
      poDetail: formNewValue.poDetail.map((row: any, index: number) => {
        if (index === poDetailIndex) {
          return {...row, completed: completed}
        } else {
          return row
        }
      })
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
    setSubtotal(getSubtotal(form))
    // console.log(subtotal)
    const formNewestValues = form.getFieldsValue()
    for (let i=0; i <formNewestValues['poDetail']?.length; i++){
      form.setFieldsValue({
        ...formNewestValues,
        poDetail: autoPrice(formNewestValues, 'poDetail', i),
      })
    }
  }

  const onConfirm = async () => {
    const orderStatus = props.orderData?.poStatusId
    if (orderStatus && orderStatus !== 1) {
      SweetAlertService.errorMessage('This order is approved, completed or cancelled, so not Editable')
      props.onDialogClose(true)
      return
    }
    const subtotalCurrent = getSubtotal(formRef)
    setSubtotal(subtotalCurrent)
    formRef.submit()
    const formValues: IFormValues | any = await formRef.validateFields()
    if (formValues) {
      console.log(formValues)
      const requestValues = {
        ...formValues,
        poDetail: formValues.poDetail?.map((row: any) => ({...row, price: row.unitPrice * row.quantity})),
        poOption: formValues.poOption,
        poId: props.orderData?.poId,
        poNo: props.orderData?.poNo,
        price: subtotalCurrent,
        gst:subtotalCurrent*0.15,
        inclGstPrice:subtotalCurrent*1.15
      }
      console.log(requestValues)
      const result = await ApiRequest({
        urlInfoKey: urlKey.PurchaseOrder,
        type: props.isNewOrder ? urlType.Create : urlType.Update,
        data: requestValues
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const getSubtotal = (form: any) => form.getFieldsValue().poDetail?.reduce((a: number, c: IPoDetail) => a + c?.unitPrice * c?.quantity, 0) || 0

  const poDetailPriceInfos = () => {
    const fees = options?.reduce((a: number, o: IPoOption) => a + o?.price, 0) || 0
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '2rem auto', fontSize: '1rem'}}>
        <div style={{width: '14rem', textAlign: 'right'}}>
          <Divider />
          <div>Subtotal: ${subtotal.toFixed(3)}</div>
          {options?.map((item: any, i: number) => (
            <div key={i.toString()}>{optionsArray.filter((fee: any) => fee.value === item?.optionId)[0]?.label}: ${item?.price && item?.price.toFixed(3)}</div>
          ))}
          <div>Total: ${(subtotal + fees).toFixed(3)}</div>
          <div>GST: ${((subtotal + fees) * 0.15).toFixed(3)}</div>
          <Divider />
          <div>Incl GST: ${((subtotal + fees) * 1.15).toFixed(3)}</div>
        </div>
      </div>
    )
  }

  const getModalFooter = () => {
    return (
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
    )
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm items={formItems} onFormChange={debounce(onFormChange, 1000)} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      {poDetailPriceInfos()}
      {getModalFooter()}
    </div>
  )
}

export default PurchaseOrderDialog
