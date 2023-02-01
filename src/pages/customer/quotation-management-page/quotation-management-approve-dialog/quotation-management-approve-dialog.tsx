import React from 'react'
import CommonForm from '../../../../components/common/common-form/common-form'
import { Button, Descriptions, Divider,Input } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../services/api/api'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import CommonDialog from '../../../../components/common/others/common-dialog'
import ProductManagementPage from '../../../product/product-management-page/product-management-page'
import { nbsStr, toLocalDate } from '../../../../services/lib/utils/helpers'

const QuotationManagementApproveDialog = (props: { customerId?: any, quotationData: any, onDialogClose: any, onProductListOpen: any }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<any>()
  const [formItems, setFormItems] = useState<any>([])
  const [open, setOpen] = useState<any>(false)
  const formRefCurrent: any = React.useRef()
  const [productOptions, setProductOptions] = useState<any>([])
  const productOptionsRefCurrent: any = React.useRef()

  useEffect(() => {
    formRefCurrent.current = formRef
  }, [formRef])

  useEffect(() => {
    console.log(productOptions)
    setFormItem(productOptions)
    productOptionsRefCurrent.current = productOptions
  }, [productOptions])

  const handleQuotationItemData = (quotationItemData: any, row: any, type: any) => {
    if (quotationItemData.filter((item: any) => item[0] === row[type])[0]) {
      quotationItemData = quotationItemData.map((item: any) => {
        if (item[0] === row[type]) {
          item[1].push(concatQuotationItemNameRow(row))
        }
        return item
      })
    } else {
      if (row[type]) {
        quotationItemData.push([row[type], [concatQuotationItemNameRow(row)]])
      }
    }
    return quotationItemData
  }

  const concatQuotationItemNameRow = (row: any) => ({...row, name: 'Notes: ' + row.notes + ' -- ' + 'Price: $' + row.price.toFixed(2)})

  useEffect(() => {
	  renewProductOptions()
	  console.log(props.quotationData)
    const customer = props.quotationData.customer
	  const quotationItemData = setFormItem()
	  const initValue: any = {}
	  for (const quotationItemDataElement of quotationItemData) {
		  initValue[quotationItemDataElement[0]] = quotationItemDataElement[1][0].quotationItemId
      initValue[quotationItemDataElement[0]+"productDesc"] = customer?.customerCode
	  }
    setProd()
	  setInitFormValues(initValue)
  }, [props.quotationData])

  const renewProductOptions = () => {
    getSelectOptions(urlKey.Product, 'Product/GetProductByCustomerId?id=' + props.quotationData?.customerId).then(res => {
      setProductOptions(res)
    })
  }
  const setProd = async () => {
    const initValue: any = {}

    // setInitFormValues(initValue)
    for (let quotaItem of props.quotationData.quotationItem) {
      if (quotaItem.baseProductId) {
        let prod = await ApiRequest({
          url: 'Product/GetProductByBaseProduct?id=' + quotaItem.baseProductId,
          method: 'get',
          isShowSpinner: true
        })
        if (prod.data.data[0]?.manufactured == 1) {
          // initValue[0] =''
          initValue[quotaItem.baseProductId+"product"] = prod.data.data[0].productId
          console.log(prod)
        }
      }
    }
    if (initValue)
      setInitFormValues(initValue)
  }

 
  const checkIsOnlyProduct = () => {
    if (props.quotationData?.quotationItem?.filter((row: any) => row.productId).length) {
      return 1
    }
    return 0
  }

  const setFormItem = (productOp?: any) => {
    const isOnlyProduct = checkIsOnlyProduct()
    let quotationItemData: any = []
    if (props.quotationData?.quotationItem) {
      for (const row of props.quotationData.quotationItem) {
        if (isOnlyProduct) {
          quotationItemData = handleQuotationItemData(quotationItemData, row, 'productId')
        } else {
          quotationItemData = handleQuotationItemData(quotationItemData, row, 'baseProductId')
        }
      }
    }
    console.log(quotationItemData)
    const formItem: any = []
    const a = quotationItemData.map((row: any) => {
      if (!isOnlyProduct) {
        formItem.push({
          name: row[0] + 'button',
          isWholeRowWidth: true,
          label: ' ',
          inputElement: <Button type="primary" onClick={() => {
            generateProduct(row[0])
          }}>Generate Product</Button>
        })
      }
      formItem.push({
        name: row[0],
        // isWholeRowWidth: true,
        rules: [{required: true}],
        span: 10,
        label: 'Price Select - ' + (isOnlyProduct ? row[1][0].product.productName : row[1][0].baseProduct.baseProductName),
        inputElement: commonFormSelect('quotationItem', row[1], ['name'])
      })
      if (!isOnlyProduct) {
        formItem.push({
          name: row[0] + 'productDesc',
          // isWholeRowWidth: true,
          // rules: [{required: true}],defaultValue={customer.customerCode}
          label: 'Product Name Description',
          span: 6,
          inputElement: <Input />
          })
      }      
      if (!isOnlyProduct) {
        formItem.push({
          name: row[0] + 'product',
          // isWholeRowWidth: true,
          rules: [{required: true}],
          label: 'Products',
          span: 6,
          inputElement: commonFormSelect('product', getItemProducts(row[0], productOp))
        })
      }

      formItem.push({
        isWholeRowWidth: true,
        inputElement: <Divider />
      })
    })
    setFormItems(formItem)
    return quotationItemData
  }

  const getItemProducts = (baseProductId: any, options?: any) => {
    return (options || productOptionsRefCurrent.current).filter((row: any) => row.baseProductId === baseProductId)
  }

  const generateProduct = async (baseProductId: any) => {

    // formRef.submit()
    // const formValues: any = await formRef.validateFields()
    // if (formValues) 
    // console.log(formRef.getFieldsValue())
    // console.log(baseProductId)
    let itemDesc = formRef.getFieldsValue()[baseProductId+'productDesc'];
    const currentQuotationItem = props.quotationData.quotationItem.filter((row: any) => row.quotationItemId === formRefCurrent.current.getFieldsValue()[baseProductId])[0]
    if (!itemDesc){
      SweetAlertService.errorMessage("Product description is required!")
      return 
    }
    // console.log(currentQuotationItem)
    if (currentQuotationItem) {
      const result = await SweetAlertService.confirmMessage(itemDesc + ' - ' + currentQuotationItem.baseProduct.baseProductName)
      // const result = await SweetAlertService.confirmMessage(nbsStr(currentQuotationItem.itemDesc + ' - ' + currentQuotationItem.baseProduct.baseProductName))
      if (result) {
        ApiRequest({
          urlInfoKey: urlKey.Product,
          type: urlType.Create,
          data: {
            productName: itemDesc + ' - ' + currentQuotationItem.baseProduct.baseProductName,
            baseProductId: currentQuotationItem.baseProductId,
            customerId: props.quotationData?.customerId
          },
          isShowSpinner: true
        }).then(_ => {
          renewProductOptions()
        })
      }
    }
  }

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
	  console.log(changedValues)
	  console.log(newValues)
  }

  const onFormBlur = (form: any) => {
    console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
	  const isOnlyProduct = checkIsOnlyProduct()
    formRef.submit()
    const formValues: any = await formRef.validateFields()
    if (formValues) {
	    console.log(formValues)
	    let requestValues
	    if (isOnlyProduct) {
		    const selectedQuotations = Object.keys(formValues).map((key: any) => formValues[key])
		    console.log(selectedQuotations)
		    requestValues = {
			    ...props.quotationData,
			    draft: 0,
			    quotationItem: props.quotationData.quotationItem.filter((row: any) => selectedQuotations.includes(row.quotationItemId)),
		    }
		    console.log(requestValues)
	    } else {
        const quotationItemIdProductIdMapping: any = {}
        const selectedQuotations = Object.keys(formValues).map((key: any) => formValues[key])
        const a = Object.keys(formValues).map((key: any) => {
          if (!key.includes('product') && !key.includes('button')) {
            quotationItemIdProductIdMapping[formValues[key]] = formValues[key + 'product']
			    }
		    })
		    console.log(quotationItemIdProductIdMapping)
		    console.log(selectedQuotations)
		    requestValues = {
			    ...props.quotationData,
			    draft: 0,
			    quotationItem: props.quotationData.quotationItem
				    .filter((row: any) => selectedQuotations.includes(row.quotationItemId))
				    .map((row: any) => ({...row, productId: quotationItemIdProductIdMapping[row.quotationItemId], baseProductId: null})),
		    }
		    console.log(requestValues)
	    }
	    const result = await ApiRequest({
		    url: 'Quotation/UpdateQuotationDraftStatus',
		    method: 'put',
		    data: {
          ...requestValues,
			    effDate: requestValues.effDate1,
			    expDate: requestValues.expDate1,
		    }
	    })
      if (result) {
        console.log(result)
	      if (result.data.errorMessage?.messageType === 'error') {
	      	const confirmResult = await SweetAlertService.confirmMessage(result.data.errorMessage.message + ' Do you still want to confirm, confirm will overwrite previous quotation?')
		      if (!confirmResult) {
			      return
		      }
		      ApiRequest({
			      url: 'Quotation/UpdateQuotationForce',
			      method: 'put',
			      data: {
				      ...requestValues,
				      effDate: requestValues.effDate1,
				      expDate: requestValues.expDate1,
			      }
		      }).then(_ => {
		      	SweetAlertService.successMessage('Submit successfully')
			      props.onDialogClose(true)
            props.onProductListOpen()
		      })
	      } else {
		      await SweetAlertService.successMessage('Submit successfully')
		      props.onDialogClose(true)
          props.onProductListOpen()
	      }
      }
    }
  }

  const description = () => {
    const data = props.quotationData
    if (!data) {
      return null
	  }
    console.log(data)
    return (
		  <Descriptions bordered>
			  <Descriptions.Item label="Customer">{data.customer.company}</Descriptions.Item>
			  <Descriptions.Item label="Sales">{data.employee?.firstName + ' ' + data.employee?.lastName}</Descriptions.Item>
			  <Descriptions.Item label="Quote Date">{toLocalDate(data.effDate)}</Descriptions.Item>
			  <Descriptions.Item label="Valid Date">{toLocalDate(data.expDate)}</Descriptions.Item>
			  <Descriptions.Item label="Quotation No">{data.quotationNo}</Descriptions.Item>
			  <Descriptions.Item label="Comments">{data.notes}</Descriptions.Item>
			  <Descriptions.Item label="Options">
				  {data.quotationOption && data.quotationOption[0]?.customizeOptionNotes.split('\n').map((str: string, i: any) => <div key={i.toString()}>{str}</div>)}
			  </Descriptions.Item>
		  </Descriptions>
	  )
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
	    {description()}
	    <Divider dashed />
	    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
		    <Button
			    type="primary"
			    onClick={() => setOpen(true)}
		    >Customer Product List</Button>
	    </div>
      <CommonForm
	      items={formItems}
	      onFormChange={onFormChange}
	      onFormBlur={onFormBlur}
	      initFormValues={initFormValues}
      />
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
	    <CommonDialog
		    title={props.quotationData?.customer.customerCode + ' - Product Edit'}
		    open={open}
		    dialogContent={<ProductManagementPage customerId={props.quotationData?.customerId} />}
	      onDialogClose={() => setOpen(false)}
	    />
    </div>
  )
}

export default QuotationManagementApproveDialog
