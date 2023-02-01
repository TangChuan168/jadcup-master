import React, { useEffect, useState } from 'react'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { Button, DatePicker, Divider, Input, InputNumber, Switch, Select, } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import moment from 'moment'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import DispatchOrderDetailsTable
  from '../../../warehouse/dispatch/dispatch-list/dispatch-order-details-table/dispatch-order-details-table'
import DispatchedTable from '../../../warehouse/dispatch/dispatch-list/dispatched-table/dispatched-table'

import {getCookie} from 'react-use-cookie'
import { SlackOutlined } from '@ant-design/icons'
import { colors } from '@material-ui/core'

const { TextArea } = Input;

interface IOrderProduct {
  orderProductId?: any
  orderId?: any
  productId?: any
  quantity?: any
  unitPrice?: any
  price?: any
  marginOfError?: any
  packagingQty?:any
  inStock?:any
}

interface IOrderOption {
  optionId?: any
  quantity?: any
  unitPrice?: any
  price?: any
} 

interface IFormValues {
  orderId?: any
  customerId?: any
  employeeId?: any
  orderDate?: any
  requiredDate?: any
  orderNo?: any
  deliveryDate?: any
  deliveryMethodId?: any
  deliveryCityId?: any
  orderStatusId?: any
  deliveryAsap?: any
  comments?: any
  postalCode?: any
  deliveryAddress?: any
  deliveryName?: any
  newWarehouseNote?:any
  paid?: any
  totalPrice?: number
  priceInclgst?: number
  orderProduct?: IOrderProduct[]
  orderOption?: IOrderOption[]
}

const SalesOrderProductManagementDialog = (props: { orderData: any, onDialogClose: any, dispatchData?: any, isNewOrder: boolean, isAwaitingDispatchPage?: boolean,isDispatchPage?: boolean, customerId?:string, isOnlineCustomer?: boolean, isDraft?: boolean}) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [orderProductChangedValueIndex, setOrderProductChangedValueIndex] = useState<any>()
  const [orderOptionChangedValueIndex, setOrderOptionChangedValueIndex] = useState<any>()
  const [subtotal, setSubtotal] = useState(0)

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [deliveryMethodOptions, setDeliveryMethodOptions] = useState([])
  const [orderStatusOptions, setOrderStatusOptions] = useState([])
  const [deliveryCityOptions, setDeliveryCityOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [productOptionOptions, setProductOptionOptions] = useState([])
  const [addressOptions, setAddressOptions] = useState([])
  const [stock, setStock] = useState<any>()

  const [PlateTypeOptions, setPlateTypeOptions] = useState([])
  const [PlateType, setPlateType] = useState('')
  const [quantity, setQuantity] = useState('0')


  useEffect(() => {
    console.log('william testing order Data@order product dialog$$$$$$$$$$$$$$$$$$$$$$$$$')
    console.log(props)
    if (props.orderData.plateTypeoptions) {
      const options = props.orderData.plateTypeoptions.map((x:any) => ({value: x.plateTypeId, label: x.plateTypeName }))
      setPlateTypeOptions(options)
    }
    if (props.orderData.orderProduct) {
      props.orderData.orderProduct.map((e:any) => {
        e.packagingQty = e.product.baseProduct.packagingType.quantity
        // e.cartonQTY = e.quantity/e.packagingQty.toFixed(2)
      })
    }

    setInitFormValues({
      orderStatusId: 1,
      ...props.orderData,
      requiredDate: props.orderData.requiredDate && moment(props.orderData.requiredDate + '.000Z') || moment().add(14, 'days'),
      deliveryDate: props.orderData.deliveryDate && moment(props.orderData.deliveryDate + '.000Z'),
      orderDate: (props.orderData.orderDate && moment(props.orderData.orderDate + '.000Z')) || moment(),
      customerId: props.customerId ? props.customerId : props.orderData.customerId
    })

    if (props.orderData?.customerId) {
      setProducts(props.orderData.customerId)
      setAddress(props.orderData.customerId)
    }
    //getSelectOptions(urlKey.Customer).then(res => setCustomerOptions(res))
    getSelectOptions('', 'Customer/GetAllSimpleCustomer').then(res => setCustomerOptions(res))
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.DeliveryMethod).then(res => {
      // if (getCookie('customerUserId')){
      //   res = res.filter((e:any)=>{
      //     return e.deliveryMethodId != 6 
      //   })  
      // }
      setDeliveryMethodOptions(res)
    })
    getSelectOptions(urlKey.OrderStatus).then(res => setOrderStatusOptions(res))
    getSelectOptions(urlKey.City).then(res => setDeliveryCityOptions(res))
    getSelectOptions(urlKey.ProductOption).then(res => setProductOptionOptions(res))
  }, [props.orderData])

  const setProducts = (id: any) => {
    getSelectOptions('', 'Product/GetProductByCustomerIdWithQuota?id=' + id)
      .then(res => {
        console.log(res)
        setProductsOptions(res.map((row: any) => ({...row, packagingTypeQty: row.baseProduct?.packagingType?.quantity})))
      })
  }
  useEffect(() => {
    if (formRef && props.customerId && props.isNewOrder) {
      setCustomerInfosToForm(props.customerId, {...initFormValues, customerId: props.customerId}, formRef)
    }
  }, [formRef])

  const setAddress = (id: any) => {
    getSelectOptions('', 'ExtraAddress/GetAllExtraAddress?customerId=' + id)
      .then(res => setAddressOptions(res))
  }

  
  //const changedValuesKey = Object.keys(changedValues)[0]
  const handleform = (ChangedValues:string, value:string) => {
    const changedValuesKey = Object.keys(ChangedValues)[0]
    //console.log(changedValuesKey)
    changedValuesKey =='plateQty'? setQuantity(value):setPlateType(value)
    console.log(quantity)
    console.log(PlateType)
  }


  const formItems2:ItemElementPropsInterface[] | any = [
    {name: 'PlateTypeId', span: 6, label: 'Plate Type', rules: [{required: true}], inputElement: <Select options={PlateTypeOptions} />},
    {name: 'plateQty', label: 'Qty', rules: [{required: true}], inputElement: <Input />},
    {name:'Notes', label:'Notes', inputElement:<Input showCount maxLength={50} />}
  ]

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', span: 6, label: 'Customer', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'], props.isOnlineCustomer)},
    {name: 'orderDate', label: 'Order Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'requiredDate', label: 'REQ Date', rules: [{required: true}], inputElement: <DatePicker disabled={props.isNewOrder}  format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'employeeId', span: 3,label: 'Sales', inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'orderStatusId', span: 3,label: 'Order Status', inputElement: commonFormSelect(urlKey.OrderStatus, orderStatusOptions, [], true)},      
    {name: 'orderNo', label: 'Order No', inputElement: <Input disabled={true} />},
    {name: 'custOrderNo', label: 'PO', inputElement: <Input />},
    {name: 'deliveryAddress', span: 6, label: 'Delivery Address', rules: [{required: true}], inputElement: commonFormSelect(urlKey.ExtraAddress, addressOptions, ['address'])},
    {name: 'deliveryName', span: 6,label: 'Delivery Name', inputElement: <Input />},
    {name: 'deliveryMethodId',span: 3, label: 'Delivery Method', inputElement: commonFormSelect(urlKey.DeliveryMethod, deliveryMethodOptions,[], getCookie('customerUserId')?true:false)},
    {name: 'deliveryAsap', label: 'Urgent', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},  
    {name: 'urgentNote',  span: 6,label: 'Urgent Reason', inputElement: <Input.TextArea disabled={true} showCount={true} maxLength={150} autoSize={ true } />},
    {name: 'warehouseNote',  span: 6,label: 'Delivery Instruction', inputElement: <Input.TextArea showCount={true} maxLength={300}  autoSize={ true } />},
    {name: 'newWarehouseNote',  span: 6,label: 'Note to Warehouse', inputElement: <Input.TextArea showCount={true} maxLength={300} autoSize={ true } />},
    // {name: 'postalCode', inputElement: <Input />},
    {name: 'comments',  span: 6,label: 'Note to Production', inputElement: <Input.TextArea showCount={true} maxLength={300} autoSize={ true } />},
    {name: 'accountNote',  span: 6,label: 'Note to Account', inputElement: <Input.TextArea showCount={true} maxLength={300} autoSize={ true } />},
    {name: 'paid', inputElement: <Switch />, otherProps: {valuePropName: 'checked',hidden:'true'}},
    {name: 'deliveryDate', label: 'Delivery Date',otherProps: {hidden:'true'}, inputElement: <DatePicker  disabled={props.isNewOrder}  format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'deliveryCityId', label: 'Delivery City', inputElement: commonFormSelect(urlKey.City, deliveryCityOptions),otherProps: {hidden:'true'}},

    !props.isAwaitingDispatchPage && [
      // {name: ['orderProduct', 'productId'], span: 8, isNotEditable: props.isAwaitingDispatchPage, addButtonText: 'Add Product', label: 'Product', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Product, productsOptions, ['packagingTypeQty', 'productName'])},
      // {name: ['orderProduct', 'unitPrice'], span: 2, label: '$Per Carton', rules: [{type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      // {name: ['orderProduct', 'packagingQty'], span: 2, label: 'QTY Per Carton', rules: [{type: 'number', min: 0}], inputElement: <InputNumber<string> stringMode step="0.01" disabled={true} />},
      // {name: ['orderProduct', 'quantity'], span: 2, label: 'QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
      // {name: ['orderProduct', 'price'], span: 2, label: '$Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber<string> stringMode step="0.01" disabled={true} />},
      // {name: ['orderProduct', 'marginOfError'], span: 2, label: 'Margin of Error', rules: [{type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},

      {name: ['orderProduct', 'productId'], span: 8, isNotEditable: props.isAwaitingDispatchPage, addButtonText: 'Add Product', label: 'Product', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Product, productsOptions, ['productCode', 'productName'])},
      {name: ['orderProduct', 'unitPrice'], span: 2, label: '$Per Carton', rules: [{required: true,type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      {name: ['orderProduct', 'packagingQty'], span: 2, label: 'QTY Per Carton', rules: [{required: true,type: 'number', min: 0}], inputElement: <InputNumber  step="0.01" disabled={true} />},
      {name: ['orderProduct', 'quantity'], span: 2, label: 'QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['orderProduct', 'price'], span: 2, label: '$Price', rules: [{required: true,type: 'number', min: 0}], inputElement: <InputNumber step="0.01" disabled={true} />},      
      {name: ['orderProduct', 'marginOfError'], span: 2, label: 'Margin of Error', rules: [{type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      {name: ['orderProduct', 'inStock'], span: 4, label: 'Stock', inputElement: <Input readOnly />},
      {name: ['orderProduct', 'quotationId'], span: 1, label: '', inputElement: <Input />,otherProps: {hidden:'true'}},
    ],
    !props.isAwaitingDispatchPage && [
      {name: ['orderOption', 'optionId'], span: 8, isNotEditable: props.isAwaitingDispatchPage, addButtonText: 'Add Option', label: 'Product Option', rules: [{required: true}], inputElement: commonFormSelect(urlKey.ProductOption, productOptionOptions)},
      {name: ['orderOption', 'unitPrice'], span: 2, label: 'Unit Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber step="0.01" disabled={true} />},      
      {name: ['orderOption', 'quantity'], span: 2, label: 'QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber defaultValue={1} disabled={true}/>},
      {name: ['orderOption', 'price'], span: 2, label: 'Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber step="0.01" />},
 
      // {name: ['orderOption', 'optionId'], span: 8, isNotEditable: props.isAwaitingDispatchPage, addButtonText: 'Add Option', label: 'Product Option', rules: [{required: true}], inputElement: commonFormSelect(urlKey.ProductOption, productOptionOptions)},
      // {name: ['orderOption', 'unitPrice'], span: 2, label: 'Unit Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber<string> stringMode step="0.01" disabled={true} />},
      // {name: ['orderOption', 'quantity'], span: 2, label: 'QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
      // {name: ['orderOption', 'price'], span: 2, label: 'Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber<string> stringMode step="0.01" disabled={true} />},
    ]
  ]

  const onFormChange = async (changedValues: any, newValues: any, form: any) => {
    // setSubtotal(getSubtotal(form))
    // console.log(changedValues)
    // console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    let orderProductChangedValueIndex = 0
    let orderOptionChangedValueIndex = 0
    let orderProductChangedValue: IOrderProduct
    let orderOptionChangedValue: IOrderOption
    switch (changedValuesKey) {
      case 'customerId':
        if (changedValues['customerId']) {
          setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'deliveryAsap':
        if (changedValues['deliveryAsap']) {
          if  (newValues.deliveryAsap == true){
            let result = await SweetAlertService.inputConfirm({type: 'text', title: 'Input reason for urgent', placeholder: 'qty', defaultValue: "",handleRequired:true});
            if (result==undefined) {
              const updatedValues = {
                ...newValues,
                deliveryAsap: false,
                urgentNote: null,
              }
              form.setFieldsValue(updatedValues)             
            }
            else
            {
              const updatedValues = {
                ...newValues,
                urgentNote: result,
              }
              form.setFieldsValue(updatedValues)     
            }
          }
          return
        }
        break        
      case 'deliveryAddress':
        if (changedValues['deliveryAddress']) {
          const addr: any = addressOptions.filter((row: any) => row.addressId === changedValues.deliveryAddress)[0]
          const updatedValues = {
            ...newValues,
            postalCode: addr.postalCode,
            deliveryName: addr.deliveryName,
            warehouseNote: addr.notes,
            deliveryMethodId: addr.deliveryMethodId
          }
          form.setFieldsValue(updatedValues)
          return
        }
        break
      case 'orderProduct':
        orderProductChangedValueIndex = changedValues['orderProduct'].length - 1
        setOrderProductChangedValueIndex(orderProductChangedValueIndex)
        orderProductChangedValue = changedValues['orderProduct'][orderProductChangedValueIndex]
        // console.log(orderProductChangedValue)
        if (orderProductChangedValue && orderProductChangedValue.productId && (Object.keys(orderProductChangedValue).length === 1)) {
          setProductInfosToForm(orderProductChangedValueIndex, orderProductChangedValue?.productId, newValues, form)
          return
        }
        // doOrderProductChange()
        break
      case 'orderOption':
        orderOptionChangedValueIndex = changedValues['orderOption'].length - 1
        setOrderOptionChangedValueIndex(orderOptionChangedValueIndex)
        orderOptionChangedValue = changedValues['orderOption'][orderOptionChangedValueIndex]
        // console.log(orderOptionChangedValue)
        if (orderOptionChangedValue && orderOptionChangedValue.optionId && (Object.keys(orderOptionChangedValue).length === 1)) {
          setProductOptionInfosToForm(orderOptionChangedValueIndex, orderOptionChangedValue?.optionId, newValues, form)
          return
        }
        break
    }
  }
  // const doOrderProductChange = () => {
  //   orderProductChange(formRef);
  // }
  const getStockInfo = async (productId: number) => {
    const stockInfo = await ApiRequest({
      url: 'StockMonitor/GetStockInfoByProductId?productId=' + productId,
      method: 'get',
      isShowSpinner: false
    })
    if (stockInfo)
      return stockInfo.data.data
    else 
      return null;
  }
  const orderProductChange = (form: any) => {
    const formNewestValues = form.getFieldsValue()
    form.setFieldsValue({
      ...formNewestValues,
      orderProduct: autoPrice(formNewestValues, 'orderProduct', orderProductChangedValueIndex),
      orderOption: autoPrice2(formNewestValues, 'orderOption', orderOptionChangedValueIndex),
    })
  }

  const autoPrice = (formNewestValues: any, key: any, index: any) => {
    const orderKey: any = formNewestValues[key] || []
    // console.log(orderKey)
    let len ;
    if (formNewestValues?.orderProduct?.length >0) 
      len =formNewestValues?.orderProduct?.length; 
    
    for (let idx=0;idx<len ;idx++){
      const orderKeyChangedValue = orderKey[idx]
      let changedFieldObj = {}
      if (orderKeyChangedValue?.unitPrice && orderKeyChangedValue?.quantity) {
        changedFieldObj = {price: orderKeyChangedValue.unitPrice * orderKeyChangedValue.quantity}
      }
      orderKey[idx] = {...orderKeyChangedValue, ...changedFieldObj}
    }  

    return orderKey
  }
  const autoPrice2 = (formNewestValues: any, key: any, index: any) => {
    const orderKey: any = formNewestValues[key] || []
    // console.log(orderKey)
    const orderKeyChangedValue = orderKey[index]
    let changedFieldObj = {}
    // if (orderKeyChangedValue?.unitPrice && orderKeyChangedValue?.quantity) {
    //   changedFieldObj = {price: orderKeyChangedValue.unitPrice * orderKeyChangedValue.quantity}
    // }
    orderKey[index] = {...orderKeyChangedValue, ...changedFieldObj}
    return orderKey
  }
  const setProductOptionInfosToForm = async (index: any, optionId: any, newValues: any, form: any) => {
    // console.log(index)
    // console.log(productId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.ProductOption,
      type: urlType.GetById,
      dataId: optionId,
      isShowSpinner: false
    })
    if (result && newValues) {
      const productOptionInfos = result.data.data
      const orderOption: any = newValues.orderOption || []
      console.log(orderOption[index])
      orderOption[index] = {
        ...orderOption[index],
        unitPrice: productOptionInfos.price || 0,
        // price: orderOption[index].quantity * (productOptionInfos.price || 0),
        price: orderOption[index].price ,
        quantity: 1,
      }
      console.log(orderOption[index])
      const updatedValues = {
        ...newValues,
        orderOption: orderOption
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const setProductInfosToForm = async (index: any, productId: any, newValues: any, form: any) => {
    // console.log(index)
    // console.log(productId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.Product,
      type: urlType.GetById,
      dataId: productId,
      isShowSpinner: false
    })
    if (result==undefined) {
      await SweetAlertService.errorMessage('Get product error')
      return;
    }
    if (result && newValues) {
      const productInfos = result.data.data
      console.log(productInfos)
      const quotationResult = await ApiRequest({
        url: 'Quotation/GetQuotationByCustomerId?id=' + (productInfos.customerId || formRef.getFieldsValue()?.customerId) + '&draft=0',
        method: 'get',
        isShowSpinner: false
      })
      let unitPriceFromQuotation = 0,quotationIdFromQuotation=null;
      if (quotationResult==undefined) {
        await SweetAlertService.errorMessage('Get Quotation error')
        return;
      }
      if (quotationResult?.data?.data.length) {
        const quotationItem: any = []
        for (const quote of quotationResult.data.data) {
          quotationItem.push(...quote.quotationItem)
        }
        if (quotationItem?.length) {
          const productQuotationItem = quotationItem.filter((row: any) => row.productId === productId)
          if (productQuotationItem?.length) {
            unitPriceFromQuotation = productQuotationItem[0].price
            quotationIdFromQuotation = productQuotationItem[0].quotationId
          } else {
            await SweetAlertService.errorMessage('This product is not included in the Quotation.')
          }
        } else {
          await SweetAlertService.errorMessage('There is not any product item in the Quotation.')
        }
      } else {
        await SweetAlertService.errorMessage('There is not an active Quotation for this customer.')
        return;
      }
      const stock =await getStockInfo(productId)
      const orderProduct: any = newValues.orderProduct || []
      orderProduct[index] = {
        productId: productInfos.productId,
        quantity: productInfos.minOrderQuantity || 0,
        unitPrice: unitPriceFromQuotation || 0,
        price: (unitPriceFromQuotation || 0) * (productInfos.minOrderQuantity || 0),
        marginOfError: productInfos.marginOfError || 0,
        inStock: `InStk:${stock?.productInventoryInfo?.productInStock},Sale:${stock?.productInventoryInfo?.pendingOrderQuantity},`+
          `Wk:${stock?.productInventoryInfo?.pendingWorkOrderQuantity},Pak:${stock?.productInventoryInfo?.pendingWarehouseQuantity}`,
        packagingQty: productInfos.baseProduct.packagingType.quantity || 0,
        quotationId: quotationIdFromQuotation
      }
      const updatedValues = {
        ...newValues,
        orderProduct: orderProduct
      }
      form.setFieldsValue(updatedValues)
      const subtotalCurrent = getSubtotal(form)
      if (subtotalCurrent === 'err') {
        SweetAlertService.errorMessage('Err: formRef not find.')
        return
      }
      setSubtotal(subtotalCurrent)
    }
  }

  const setCustomerInfosToForm = async (customerId: any, newValues: any, form: any) => {
    setProducts(customerId)
    setAddress(customerId)
    const result = await ApiRequest({
      urlInfoKey: urlKey.Customer,
      type: urlType.GetById,
      dataId: customerId,
      isShowSpinner: false
    })

    // const selectCust: any = customerOptions.filter((row: any) => row.customerId === changedValues.customerId)[0]
    // const Note = selectCust.noteToWarehouse
    // const updatedValues = {
    //   ...newValues,
    //   newWarehouseNote: selectCust.noteToWarehouse,
    //   postalCode: null,
    //   deliveryName: null,
    //   warehouseNote: null,
    //   deliveryMethodId: null           
    // }
    // form.setFieldsValue(updatedValues)        
    if (result) {
      const customerInfos = result.data.data
      const updatedValues = {
        ...newValues,
        orderProduct: [],
        customerId: customerInfos.customerId,
        employeeId: customerInfos.employeeId,
        // deliveryMethodId: customerInfos.deliveryMethodId,
        deliveryCityId: customerInfos.cityId,
        // postalCode: customerInfos.postalCode,
        // deliveryName: customerInfos.contactPerson,
        newWarehouseNote: customerInfos.noteToWarehouse,
        comments: customerInfos.noteToProduction,
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
    orderProductChange(form)
    setSubtotal(getSubtotal(form))
    // console.log(subtotal)
  }
  const checkSubmitData = (formValues:any) =>{
    let zeroData = formValues?.orderProduct?.filter((row: IOrderProduct) => {
      return row.price==0 || row.unitPrice==0
    })
    if (zeroData.lemgth >0 ) return false
    return true;
  }
  const saveOrder = async (draft:number) => {
    if (!await formRef.validateFields()) {
      return
    }
    if (!formRef) {
      SweetAlertService.errorMessage('No changes on the form.')
      return
    }
    const subtotalCurrent = getSubtotal(formRef)
    if (subtotalCurrent === 'err') {
      SweetAlertService.errorMessage('Err: formRef not find.')
      return
    }
    orderProductChange(formRef)
    setSubtotal(subtotalCurrent)
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    const operEmployeeId = getCookie('customerUserId')?0:parseInt(getCookie('id'))
    if (operEmployeeId==null)  {
      SweetAlertService.errorMessage('Please check your login status.')
      return ;
    }
    // if (checkSubmitData(formValues)==false)  {
    //   SweetAlertService.errorMessage('Get quotaion error, Please try again')
    //   return ;
    // }

    if (formValues) {
      console.log(formValues)
      const requestValues = {
        ...formValues,
        orderId: props.orderData.orderId,
        paid: formValues.paid ? 1 : 0,
        deliveryAsap: formValues.deliveryAsap ? 1 : 0,
        deliveryAddress: typeof (formValues.deliveryAddress) === 'number' ? addressOptions.filter((row: any) => row.addressId === formValues.deliveryAddress)[0]['address'] : (formValues.deliveryAddress || ''),
        orderProduct: formValues.orderProduct?.map((row: IOrderProduct) => ({
          ...row,
          orderId: props.orderData.orderId
        })),
        priceInclgst: subtotalCurrent * 0.15,
        totalPrice: subtotalCurrent * 1.15,
        orderOption: formValues.orderOption,
        operEmployeeId : operEmployeeId
      }
      // console.log(requestValues)
      let result
      if (props.isDraft) {
        result = await ApiRequest({
          url: 'SalesOrder/UpdateDraftOrder',
          method: 'put',
          data: requestValues
        })
      } else {
        if (draft) {
          result = await ApiRequest({
            url: 'SalesOrder/AddDraftOrder',
            method: 'post',
            data: requestValues
          })
        } else if (props.isNewOrder) {
          result = await ApiRequest({
            urlInfoKey: urlKey.SalesOrder,
            type: urlType.Create,
            data: requestValues
          })
        } else {
          const isUpdateFullApi: boolean = checkIfOrderProductChanged(formRef)
          result = await ApiRequest({
            url: isUpdateFullApi ? 'SalesOrder/UpdateFullOrder' : 'SalesOrder/UpdateOrder',
            method: 'put',
            data: requestValues
          })
        }
      }
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }
  const onConfirmDraft = async () => {
    await saveOrder(1)
  }
  const onConfirm = async () => {
    await saveOrder(0)
  }  
  const checkIfOrderProductChanged = (form: any) => {
    const orderProductValues: IOrderProduct[] = form.getFieldsValue().orderProduct
    const orderProductOriginValues: IOrderProduct[] = props.orderData.orderProduct
    if ((!orderProductOriginValues || !orderProductOriginValues?.length) &&
      (!orderProductValues || !orderProductValues.length)) {
      return false
    }
    if (orderProductOriginValues?.length != orderProductValues?.length) {
      return true
    }    
    if (orderProductOriginValues?.length && orderProductValues?.length) {
      for (const row of orderProductValues ) {
        const oldRow: IOrderProduct = orderProductOriginValues.filter((item: IOrderProduct) => row?.orderProductId === item?.orderProductId)[0]
        if (!oldRow || !(
          oldRow.productId === row.productId &&
          oldRow.price === row.price &&
          oldRow.quantity === row.quantity 
        )) {
          return true
        }
      }
      return false
    }
    return true
  }

  const onAddAllProducts = () => {
    productsOptions.forEach((item: any, index: number) => {
      setProductInfosToForm(index, item.productId, formRef.getFieldsValue(), formRef)
    })
  }

  const getSubtotal = (form: any) => {
    const formValue = form.getFieldsValue()
    if (formValue) {
      return (
        formValue.orderProduct?.reduce((a: number, c: IOrderProduct) => a + c?.price, 0) +
        formValue.orderOption?.reduce((a: number, c: IOrderOption) => a + c?.price, 0)
      )
    }
    return 'err'
  }

  const productPriceInfos = () => {
    return props.isAwaitingDispatchPage ? null : (
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '2rem auto', fontSize: '1rem'}}>
        <div style={{width: '14rem', textAlign: 'right'}}>
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>GST: ${(subtotal * 0.15).toFixed(2)}</div>
          <Divider />
          <div>Total: ${(subtotal * 1.15).toFixed(2)}</div>
        </div>
      </div>
    )
  }

  const getModalFooter = () => {
    return props.isAwaitingDispatchPage ? null : (
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        {props.isNewOrder && <Button
          onClick={onAddAllProducts}
          type="primary"
          style={{marginRight: '2rem'}}
          disabled={productsOptions.length === 0}
        >Add All Products</Button>}
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
        <Button
          disabled={!formRef || (props.orderData.orderStatusId >= 15 && checkIfOrderProductChanged(formRef))}
          onClick={onConfirm}
          type="primary"
          style={{marginRight: '2rem'}}
        >Confirm</Button>
        <Button 
          disabled={!formRef || !props.isNewOrder || (props.orderData.orderStatusId >= 15 && checkIfOrderProductChanged(formRef))}
          onClick={onConfirmDraft}
          // type="primary"
        >Save as Draft</Button>        
      </div>
    )
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <div style={{background: 'rgba(0, 0, 0, 0.05)'}}>
        <CommonForm items={formItems2} onFormChange={handleform} />
      </div>

      {props.isAwaitingDispatchPage && !props.isDispatchPage ? <DispatchOrderDetailsTable orderId={ initFormValues?.orderId } isDispatchUpdate={!!props.dispatchData} dispatchData={props.dispatchData} onDialogClose={props.onDialogClose} orderData={props.orderData} plateType={PlateType} balance={quantity} /> : null}
      {props.isAwaitingDispatchPage && props.isDispatchPage && initFormValues?.orderId ? <DispatchedTable orderId={ initFormValues?.orderId } /> : null}
      {productPriceInfos()}
      {getModalFooter()}
    </div>
  )
}

export default SalesOrderProductManagementDialog
