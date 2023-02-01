import React from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { Button, DatePicker, Input, InputNumber, Switch, Checkbox, Select } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../services/api/api'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'
import CommonFormCustomItem from '../../../../components/common/common-form/common-form-custom-item'
import { getCookie } from 'react-use-cookie'
import debounce from 'lodash/debounce'
interface IQuotationItem {
	quotationItemId?: any
	quotationId?: any
	productId?: any
	price?: any
	baseProductId?: any
	originPrice?: any
	cartonPrice?: any
	isLowerPrice?: any
	cartonQuantity?: any
	carton?: any
	minPriceNotes?: any
	itemDesc?: any
	notes?: any
	notes2?: any
	quantitySelection?: any
	isGenerateProduct?: any
	margin?:any
}

interface IQuotationOption {
	optionId?: any
	quotationId?: any
	quotationOptionItemId: any
	customizeOptionNotes: any
}

interface IFormValues {
	quotationId?: any
	draft?: any
	customerId?: any
	employeeId?: any
	effDate?: any
	expDate?: any
	quotationItem: IQuotationItem[]
	optionCheckboxGroup?: any
	optionCustomComment?: any
	contactId?:any
}

const { Option } = Select

const QuotationManagementEditDialog = (props: { customerId?: any, quotationData: any, onDialogClose: any, isNewQuotation: boolean ,isPriceContract:any}) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  // const [quotationItemChangedValueIndex, setQuotationItemChangedValueIndex] = useState<any>()

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [contactOptions, setContactOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [baseProductsOptions, setBaseProductsOptions] = useState([])
  const [quotationCommentOptions, setQuotationCommentOptions] = useState([])
  const [isOnlyShowProduct, setIsOnlyShowProduct] = useState<number>(0)
  const [quotationTemplate, setQuotationTemplate] = useState<any[]>([])
  const [contractPrice, setContractPrice] = useState<any[]>([])
  const [baseProducts, setBaseProducts] = useState<any[]>([])
  useEffect(() => {
    // console.log(props.quotationData)

	  let optionCustomComment = ''
	  const optionCheckboxGroup: any[] = []
	  if (props.quotationData?.quotationOption?.length) {
      props.quotationData.quotationOption.map((row: IQuotationOption) => {
        if (row.customizeOptionNotes) {
          optionCustomComment = row.customizeOptionNotes
			  }
        if (row.quotationOptionItemId) {
          optionCheckboxGroup.push(row.quotationOptionItemId)
			  }
		  })
	  }
	  let isOnlyProduct = 0
	  if (props.quotationData?.quotationItem?.filter((row: any) => row.productId).length) {
	  	isOnlyProduct = 1
	  }
	  setIsOnlyShowProduct(isOnlyProduct)
	  getSelectOptions(urlKey.QuotationOptionItem).then(res => {
		  setQuotationCommentOptions(res.map((row: any) => ({
			  label: row[urlKey.QuotationOptionItem + 'Name'],
			  value: row[urlKey.QuotationOptionItem + 'Id'],
		  })))
		  console.log('quotation items: ', props.quotationData.quotationItem)
		  setInitFormValues({
			  isOnlyProduct: isOnlyProduct,
			  // draft: 0,
			  ...props.quotationData,
			  quotationItem: props.quotationData?.quotationItem?.map((row: any) => ({
				  ...row,
				  no: row.productId || row.baseProductId,
				  cartonQuantity: getCartonQuantity(row.product || row.baseProduct),
				  // originPrice: getOriginPrice(row.product || row.baseProduct) || 0,
				  margin: Math.round((row.price - row.originPrice) * 100 / row.originPrice)
			  })),
			  effDate: props.quotationData?.effDate1 && moment(props.quotationData.effDate1 + '.000Z') || moment(),
			  expDate: props.quotationData?.expDate && moment(props.quotationData.expDate + '.000Z') || moment().add(1, 'month'),
			  optionCheckboxGroup: optionCheckboxGroup,
			  optionCustomComment: props.isNewQuotation ? res.map((row: any) => row.quotationOptionItemName).join('\n') : optionCustomComment
		  })
	  })
    if (props.quotationData?.customerId) {
      	getSelectOptions('', 'Product/GetProductByCustomerId?id=' + props.quotationData?.customerId)
        .then(res => setProductsOptions(res))
		getSelectOptions('', 'Contact/GetAllContact?customerId=' + props.quotationData?.customerId).then(res => setContactOptions(res));		
    }
    getSelectOptions(urlKey.Customer).then(res => {
	    setCustomerOptions(res)
	    if (props.quotationData?.customerId) {
		    setSelectedCustomer(res.filter((row: any) => row.customerId === props.quotationData?.customerId)[0])
	    }
    })
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
	
    getSelectOptions(urlKey.BaseProduct).then(res => setBaseProductsOptions(res))
	ApiRequest({url: 'Quotation/GetTemplate', method: 'get'}).then((res: any) => {
		setQuotationTemplate(res.data.data)
	})
	getAllbaseProduct()
  }, [props.quotationData])

  useEffect(() => {
    if (formRef && props.customerId && props.isNewQuotation) {
      setCustomerInfosToForm(props.customerId, {...initFormValues, customerId: props.customerId}, formRef)
    }
  }, [formRef])

  const onChangeTemplate = (event: any) => {
	console.log(event)
	const selectedTemplateitems = quotationTemplate.filter((item: any) => item.quotationId === event)[0].quotationItem
	.map((item: any) => ({
		...item,
		no: item.baseProductId,
		cartonQuantity: getCartonQuantity(item.baseProduct),
		product: null,
		productId: null}))
	console.log(selectedTemplateitems)
	setInitFormValues({...initFormValues, quotationItem: selectedTemplateitems})
  }
  const getAllbaseProduct = async () =>{
	const result = await ApiRequest({
		url: 'BaseProduct/GetAllBaseProduct',
		method: 'get',
		isShowSpinner: true
	  })
	  setBaseProducts(result.data.data);
  }
  const templateSelect = () => {
	return (
		<Select onChange={onChangeTemplate} disabled={!selectedCustomer}>
			{quotationTemplate.map((template: any) => (
				<Option key={template.quotationId} value={template.quotationId}>{template.templateName}</Option>
			))}
		</Select>
	)
  }

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', span: 6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
    {name: 'employeeId', label: 'Created By', span: 3, inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'effDate', label: 'Quote Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} /> , otherProps: props.isPriceContract?{hidden: 'true'}:null},
    {name: 'expDate', label: 'Valid Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} /> , otherProps: props.isPriceContract?{hidden: 'true'}:null},
    {name: 'quotationNo', label: 'Quotation No', inputElement: <Input disabled={true} />,  otherProps: props.isPriceContract?{hidden: 'true'}:null},
    {name: 'notes', label: 'Comments', span: 6,inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />, otherProps: props.isPriceContract?{hidden: 'true'}:null},
	{name: 'contactId', label: 'Contact',span: 6, inputElement: commonFormSelect(urlKey.Contact, contactOptions, ['firstName', 'lastName', 'email']),  otherProps: props.isPriceContract?{hidden: 'true'}:null},	
	
    {name: 'draft', inputElement: <Switch />, otherProps: {valuePropName: 'checked',hidden:'true'}},
    //   {name: 'isOnlyProduct', label: 'With Only Product', isWholeRowWidth: true, inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    // !props.isNewQuotation && {name: 'isTemplate',label: 'Is Template', span: 3,inputElement: <Switch disabled={true} />, otherProps: {valuePropName: 'checked'}},
    // !props.isNewQuotation &&{name: 'templateName', label: 'Template Name',span: 3,inputElement: <Input disabled={true} />},	
	props.isNewQuotation && {name: 'quotationTemplate', label: 'Create From a Template', span: 6, inputElement: templateSelect()},	
    [
      {name: ['quotationItem', 'no'], span: 1, label: 'No.', inputElement: <CommonFormCustomItem />},
      {name: ['quotationItem', 'productId'], span: 6, label: 'Product', inputElement: commonFormSelect(urlKey.Product, productsOptions,['productCode', 'productName'])},
      {name: ['quotationItem', 'baseProductId'], span: 6, label: 'Base Product', inputElement: commonFormSelect(urlKey.BaseProduct, baseProductsOptions,['productCode', 'baseProductName'])},
      {name: ['quotationItem', 'itemDesc'], label: 'Item Desc', inputElement: <Input />},
      {name: ['quotationItem', 'minPriceNotes'],span: 2, label: 'Min Price($) '/* MOQ'*/, inputElement: <Input disabled={true} />},
      {name: ['quotationItem', 'carton'], span: 2,label: 'Unit Price($) - Carton QTY', inputElement: <Input disabled={true} />},
      {name: ['quotationItem', 'originPrice'], span: 2, label: 'Min Price', inputElement:
	  		([26,34,38].indexOf(parseInt(getCookie('id')))>=0)?<InputNumber></InputNumber>:<InputNumber disabled={true} />},
	  {name: ['quotationItem', 'margin'], span: 2, label: 'Margin %', rules: [{ type: 'number',min: -100}], inputElement: <InputNumber/> },
	  {name: ['quotationItem', 'price'], span: 2, label: 'Price/Carton($)', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
	  {name: ['quotationItem', 'currentPrice'], span: 2, label: 'Current Price', rules: [{type: 'number', min: 0}], inputElement: <InputNumber disabled={true} readOnly={true}/>},
      {name: ['quotationItem', 'notes2'],span: 2, label: 'MOQ', inputElement: <Input />},
      // {name: ['quotationItem', 'cartonQuantity'], label: 'Carton Quantity', inputElement: <InputNumber disabled={true} />},
      // {name: ['quotationItem', 'cartonPrice'], label: 'Carton Price($)', rules: [{type: 'number', min: 0}], inputElement: <InputNumber disabled={true} />},
      // {name: ['quotationItem', 'notes'], label: 'Notes(Qty)', inputElement: <InputNumber disabled={true} />},
      // {name: ['quotationItem', 'isGenerateProduct'], label: 'Generate Product', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    ],
    // {name: 'optionCheckboxGroup', label: 'Quotation Comment Options', isWholeRowWidth: true, inputElement: <Checkbox.Group style={{display: 'flex', flexDirection: 'column'}} options={quotationCommentOptions} />},
    !props.isPriceContract && {name: 'optionCustomComment', label: 'Additional Comment', isWholeRowWidth: true, inputElement: <Input.TextArea showCount={true} autoSize={ true } />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    console.log(changedValues)
    console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    let quotationItemChangedValueIndex = 0
    let quotationItemChangedValue: IQuotationItem
    switch (changedValuesKey) {
	   case 'isOnlyProduct':
		    setIsOnlyShowProduct(changedValues['isOnlyProduct'])
		    break
      case 'customerId':
        if (changedValues['customerId']) {
          setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'quotationItem':
        quotationItemChangedValueIndex = changedValues['quotationItem'].length - 1
        // setQuotationItemChangedValueIndex(quotationItemChangedValueIndex)
        quotationItemChangedValue = changedValues['quotationItem'][quotationItemChangedValueIndex]
	      console.log(quotationItemChangedValue)
	      if (!quotationItemChangedValue) {
	      	return
	      }
        // console.log(quotationItemChangedValue)
        if (quotationItemChangedValue && quotationItemChangedValue.productId && (Object.keys(quotationItemChangedValue).length === 1)) {
        	setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, quotationItemChangedValue?.productId, null)
          return
        }
	      if (quotationItemChangedValue && quotationItemChangedValue.baseProductId && (Object.keys(quotationItemChangedValue).length === 1)) {
	      	setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, null, quotationItemChangedValue?.baseProductId)
		      return
	      }
	      if (quotationItemChangedValue && quotationItemChangedValue.margin && (Object.keys(quotationItemChangedValue).length === 1)) {
			setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, null, null,quotationItemChangedValue?.margin)
			return
		}	
		if (quotationItemChangedValue && quotationItemChangedValue.price && (Object.keys(quotationItemChangedValue).length === 1)) {
			setProductInfosToForm(quotationItemChangedValueIndex, newValues, form, null, null,null,quotationItemChangedValue?.price)
			return
		}			  
        break
    }
  }

  const setProductPriceToForm = async (form: any) => {
  	const formValues = form.getFieldsValue()
	  const quotationItem: any = formValues?.quotationItem || []
	  const updatedValues = {
		  ...formValues,
		  quotationItem: quotationItem.map((row: any, index: number) => {
			  console.log(row)
		  	if (!getCartonQuantity(row.product || row.baseProduct)) {
		  		SweetAlertService.errorMessage('No.' + (index + 1) + ' Quotation doesn\'t have carton quantity, please configure firstly.')
			  }
		  	let cartonPrice = row.price / (row.cartonQuantity || getCartonQuantity(row.product || row.baseProduct))
			  if (cartonPrice) {
			  	cartonPrice = parseFloat(cartonPrice.toFixed(2))
			  }
		  	const originPrice = row.originPrice || getOriginPrice(row.product || row.baseProduct)
			  const returnData = {
				  ...row,
				  cartonPrice: cartonPrice.toFixed(2) || 0,
				  carton: '$' + (cartonPrice.toFixed(2) || 0) + ' - ' + row.cartonQuantity,
			  }
		  	if (originPrice) {
		  		returnData.originPrice = originPrice
				  returnData.minPriceNotes = '$' + row.originPrice //+ ' * ' + row.notes
			  }
		  	return returnData
		  })
	  }
	  form.setFieldsValue(updatedValues)
  }
  const getCurrentPrice = (baseProductId:any) =>{
	let price = contractPrice.filter((e:any)=>{
		return e.product.baseProductId == baseProductId && e.product.plain==1
	})
	if (price.length > 0 )
		return price[0].price;
	else 
		return null;
  }
  const setProductInfosToForm = async (index: any, newValues: any, form: any, productId: any, baseProductId: any ,margin?:any,price?:any) => {
    console.log(index)
    // console.log(productId)
	  console.log(selectedCustomer)

	if (margin || price ){
		const quotationItem: any = newValues.quotationItem;		
		if (margin){
			if ( quotationItem[index].originPrice){
				quotationItem[index].margin  = margin;
				quotationItem[index].price = Math.round((quotationItem[index].originPrice * (1+margin/100))) 
			}
		}else {
			if ( quotationItem[index].originPrice){
				quotationItem[index].price  =  price;
				quotationItem[index].margin =  Math.round(((price/quotationItem[index].originPrice)*100 -100))
			}			
		}

		const updatedValues = {
		...newValues,
		quotationItem: quotationItem
		}
		console.log(updatedValues)
		form.setFieldsValue(updatedValues)
		return 
	}
	let result;
	if (baseProductId){
		const baseProduct = baseProducts.filter((e)=>e.baseProductId == baseProductId);
		if (baseProduct && baseProduct.length > 0){
			result = baseProduct[0]
		}
	}

	if (!result){
		const res = await ApiRequest({
			url: productId ? 'Product/GetProductById?id=' + productId + '&group1Id=' + selectedCustomer?.group1Id : 'BaseProduct/GetBaseProductById?id=' + baseProductId,
			method: 'get',
			isShowSpinner: true
		})
		result = res.data.data
	}

    if (result && newValues) {
      const productInfos = result
      const quotationItem: any = newValues.quotationItem || []
	    const productOriginPrice = productInfos.minPrice || 0
	    const baseProductOriginPrice = productInfos.price?.filter((row: any) => row.group1Id === selectedCustomer?.group1Id)[0]?.minPrice
	    console.log(productInfos)
	    console.log(selectedCustomer)
	    if (productId) {
		    quotationItem[index] = {
			    productId: productInfos.productId,
			    no: productInfos.productId,
			    baseProductId: null,
			    cartonQuantity: getCartonQuantity(productInfos),
			    originPrice: getOriginPrice(productInfos),
			    // price: productOriginPrice,
				price: getOriginPrice(productInfos),
			    cartonPrice: (productOriginPrice / getCartonQuantity(productInfos)).toFixed(3),
				carton: '$' + (getOriginPrice(productInfos) / getCartonQuantity(productInfos)).toFixed(3) + ' - ' + getCartonQuantity(productInfos),
		    }
	    } else {
		    console.log(productInfos.productPrice)
		    if (!productInfos.productPrice.length) {
		    	SweetAlertService.errorMessage('Please configure price for "' + productInfos.baseProductName + '" at Base Product Management Page firstly.')
		    }
		    const filteredProductPrices = productInfos.productPrice.filter((row: any) => row.group1Id === selectedCustomer?.group1Id)
		    const mappingProductPrices = filteredProductPrices.length ? filteredProductPrices : productInfos.productPrice.filter((row: any) => !row.group1Id)
		    if (!mappingProductPrices.length) {
		    	SweetAlertService.errorMessage('No valid configured price.')
		    }
		    const productPrices = mappingProductPrices.map((row: any) => ({
			    productId: null,
			    cartonQuantity: getCartonQuantity(productInfos),
			    baseProductId: productInfos.baseProductId,
			    no: productInfos.baseProductId,
			    // itemDesc: selectedCustomer?.customerCode,
				itemDesc:'',
			    originPrice: row.price,
			    price: row.price,
			    cartonPrice: (row.price / getCartonQuantity(productInfos)).toFixed(3),
			    notes: row.quantiy,
			    notes2: row.description,
			    carton: '$' + (row.price / getCartonQuantity(productInfos)).toFixed(3) + ' - ' + getCartonQuantity(productInfos),
			    minPriceNotes: '$' + row.price, //+ ' * ' + row.quantiy,
				currentPrice: getCurrentPrice(productInfos.baseProductId)
		    }))
		    quotationItem.splice(index, 1, ...productPrices)
	    }
      const updatedValues = {
        ...newValues,
        quotationItem: quotationItem
      }
	    console.log(updatedValues)
      form.setFieldsValue(updatedValues)
    }
  }

  const getOriginPrice = (data: any) => {
	  console.log(data)
  	if (!data) {
  		return null
	  }
  	if (data.productId) {
  		const product: any = productsOptions.filter((row: any) => row.productId === data.productId)[0]
		  console.log(product)
		  return product?.minPrice || 0
	  } else {
  		const baseProduct: any = baseProductsOptions.filter((row: any) => row.baseProductId === data.baseProductId)[0]
		  console.log(baseProduct)
		  return baseProduct?.price.filter((row: any) => row.group1Id === selectedCustomer?.group1Id)[0]?.minPrice
	  }
  }

  const getCartonQuantity = (data: any) => {
    console.log(data)
    if (!data) {
      return 9999999999
    }
    return data.productId ?
			data.baseProduct.packagingType?.quantity :
			data.packagingType?.quantity

  }

  const setCustomerInfosToForm = async (customerId: any, newValues: any, form: any) => {

    getSelectOptions('', 'Product/GetProductByCustomerId?id=' + customerId).then(res => setProductsOptions(res))
	getSelectOptions('', 'Contact/GetAllContact?customerId=' + customerId).then(res => setContactOptions(res));	
	ApiRequest({
		// url: 'Quotation/UpdateQuotation',
		// method: 'put',			
		url: "Quotation/GetContractPriceByCustomerId?customerId="+customerId,
		method: 'get',	
	}).then(res=>{
		if (res.data.data)
			setContractPrice(res.data.data.quotationItem);
		else
			setContractPrice([]);
	})		
    const result = await ApiRequest({
      urlInfoKey: urlKey.Customer,
      type: urlType.GetById,
      dataId: customerId,
      isShowSpinner: false
    })
    if (result) {
	    console.log(newValues)
      const customerInfos = result.data.data
	    setSelectedCustomer(customerInfos)
      const updatedValues = {
        ...newValues,
        quotationItem: [],
		contactId:null,
        customerId: customerInfos.customerId,
        employeeId: parseInt(getCookie('id')),//customerInfos.employeeId,
      }
      form.setFieldsValue(updatedValues)
    }
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
	  console.log(form.getFieldsValue().quotationItem)
	  const quotationItem = form.getFieldsValue().quotationItem
    if (quotationItem && quotationItem[quotationItem?.length - 1]) {
	    console.log(quotationItem[quotationItem?.length - 1])
	    setProductPriceToForm(form)
    }
  }

  const setQuotaionOption = (formValues: IFormValues) => {
    const quotationOption = []
	  // formValues.optionCheckboxGroup.map((row: any) => {
    //   quotationOption.push({
    // 	  quotationId: props.quotationData.quotationId,
    // 	  quotationOptionItemId: row,
    // 	  customizeOptionNotes: null
    //   })
	  // })
	  if (formValues.optionCustomComment) {
      quotationOption.push({
			  quotationId: props.quotationData.quotationId,
			  quotationOptionItemId: null,
			  customizeOptionNotes: formValues.optionCustomComment
		  })
	  }
	  return quotationOption
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
	    // console.log(formValues)
	    const quotationOption: IQuotationOption[] = setQuotaionOption(formValues)
      const requestValues = {
        ...formValues,
        quotationId: props.quotationData.quotationId,
	      draft: formValues.draft ? 1 : 0,
	      quotationOption: quotationOption,
        quotationItem: formValues.quotationItem?.map((row: IQuotationItem) => ({
          ...row,
	        cartonPrice: parseFloat(row.cartonPrice),
	        isLowerPrice: row.originPrice > row.price ? 1 : 0,
          quotationId: props.quotationData.quotationId
        })),
      }
      // console.log(requestValues)
      let result
	  if (props.isPriceContract) {
		result = await ApiRequest({
			url: 'Quotation/UpdateContractQuotation',
			method: 'put',
			data: {...requestValues, isTemplate: props.quotationData.isTemplate, templateName: props.quotationData.templateName}
		})
	  } else {
		if (props.isNewQuotation) {
			result = await ApiRequest({
				urlInfoKey: urlKey.Quotation,
				type: urlType.Create,
				data: requestValues
			})
			} else {
				result = await ApiRequest({
					urlInfoKey: urlKey.Quotation,
					type: urlType.Update,
					data: requestValues
				})
				// if (result && !requestValues.draft) {
				//   const updateStatusResult = await ApiRequest({
					//     url: 'Quotation/UpdateQuotationDraftStatus?id=' + result.data.data,
					//     method: 'put'
				//   })
				// }
			}
	  }
      
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }
  const onSaveToTemp = async () =>{
	if (props.quotationData.quotationId) {
		let resultInput = await SweetAlertService.inputConfirm({type: 'text', title: 'Input template name', placeholder: '', defaultValue: "",handleRequired:true});
	
		if (resultInput){
			let result = await ApiRequest({
				// url: 'Quotation/UpdateQuotation',
				// method: 'put',			
				url: "Quotation/SaveToTemplate",
				method: 'put',	
				data: {
					quotationId:props.quotationData.quotationId,
					isTemplate:1,
					TemplateName:resultInput
				}
			})
		}
		else {
			let resultcomfirm = await SweetAlertService.confirmMessage("Are you sure to cancel template");
			if (resultcomfirm){
				let result = await ApiRequest({
					url: "Quotation/SaveToTemplate",
					method: 'put',	
					data: {
						quotationId:props.quotationData.quotationId,
						isTemplate:0,
						TemplateName:null
					}
				})
			} 
		}
	} else {
		await SweetAlertService.errorMessage('Please save this quotation first before save to template.')
	}
	

  }
  const getItems = () => {
	  const items = props.isNewQuotation ?
		  formItems.filter((row: any) => row.name !== 'quotationNo') :
		  formItems
		
	  return items.map((row: any) => {
	  	if (row instanceof Array) {
			let filtered;
				filtered = row.filter((item: any) => isOnlyShowProduct ?
				  !['baseProductId', 'itemDesc', 'minPriceNotes', 'no', 'notes2'].includes(item.name[1]) :
				  (item.name[1] !== 'productId' && item.name[1] !== 'originPrice')
			  )
			  console.log(filtered)
			  console.log(props.isPriceContract)
			  if (props.isPriceContract){
				filtered = filtered?.filter((item: any) =>{
					return !['currentPrice'].includes(item.name[1])
				})
			  }
			  console.log(filtered)
			  return filtered;
		  }
	  	return row
	  })
  }

  const onGenerateProduct = () => {
	  const productsForGenerate = formRef.getFieldsValue().quotationItem.filter((row: any) => row.isGenerateProduct)
	  if (productsForGenerate.length) {
		  productsForGenerate.map((row: any) => {
			  ApiRequest({
				  urlInfoKey: urlKey.Product,
				  type: urlType.Create,
				  data: {
					  productName: row.itemDesc,
					  baseProductId: row.baseProductId,
					  customerId: selectedCustomer.customerId
				  },
				  isShowSpinner: true
			  })
		  })
	  }
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm
	      items={ getItems() }
	      onFormChange={debounce(onFormChange,300)}
	      onFormBlur={onFormBlur}
	      initFormValues={initFormValues}
      />


      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
	  <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{marginRight: '40rem'}}
    	>Close</Button>	 
	      {/*<Button*/}
		    {/*  disabled={!formRef}*/}
		    {/*  onClick={onGenerateProduct}*/}
		    {/*  type="primary"*/}
		    {/*  style={{marginRight: '2rem'}}*/}
	      {/*>Generate Product</Button>*/}
		  {<Button
          onClick={onSaveToTemp}
          style={{marginRight: '2rem'}}
        >Save as Template</Button>	}			  
		  {<Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
		  style={{marginRight: '2rem'}}
        >Save</Button>}

 		
      </div>

    </div>
  )
}

export default QuotationManagementEditDialog
