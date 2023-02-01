import React from 'react'
import { useEffect, useState } from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../components/common/common-form/common-form'
import { commonFormSelect, getSelectOptions } from '../../../components/common/common-form/common-form-select'
import { Button, Input, InputNumber, Upload } from 'antd'
import { urlKey } from '../../../services/api/api-urls'
import { InboxOutlined } from '@ant-design/icons'
import { baseUrl } from '../../../services/api/base-url'
import { ApiRequest } from '../../../services/api/api'
import { getCookie } from 'react-use-cookie'

interface IFormValues {
	productName: string,
	productCode: string,
	productTypeId: any,
	packagingTypeId: any,
	alermLimit: number,
	description: string,
	images: string,
	minOrderQuantity: number
}

const AddOutsourceProductDialog = (props: { onDialogClose: any, product?: any }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  // store selection options from apis request
  const [productTypeOptions, setProductTypeOptions] = useState([])
  const [packagingTypeOptions, setPackagingTypeOptions] = useState([])
  const [img, setImg] = useState<any>()

  useEffect(() => {
	  getSelectOptions(urlKey.ProductType).then(res => setProductTypeOptions(res))
	  getSelectOptions(urlKey.PackagingType).then(res => setPackagingTypeOptions(res))
	  console.log('product: ', props.product)
	  props.product && setInitFormValues({
		productName: props.product.productName,
		productCode: props.product.productCode,
		productTypeId: props.product.baseProduct.productTypeId,
		packagingTypeId: props.product.baseProduct.packagingTypeId,
		alermLimit: props.product.productMsl,
		description: props.product.description,
		images: props.product.images,
		minOrderQuantity: props.product.minOrderQuantity
	  })
  }, [])

  const formItems: ItemElementPropsInterface[] | any = [
	  {name: 'productName', label: 'Product Description',span: 24, rules: [{required: true}], inputElement: <Input />},
	  {name: 'productCode', label: 'Product Code',span:24, rules: [{required: true}], inputElement: <Input />},
	  {name: 'productTypeId', label: 'Product Type',span: 6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.ProductType, productTypeOptions)},
	  {name: 'packagingTypeId', label: 'Packaging Type', span: 4,rules: [{required: true}], inputElement: commonFormSelect(urlKey.PackagingType, packagingTypeOptions)},
	  {name: 'alermLimit', label: 'Alarm Limit',span: 4, rules: [{required: true}], inputElement: <InputNumber />},
	  {name: 'minOrderQuantity', label: 'Min Order Quantity',span: 4, rules: [{required: true}], inputElement: <InputNumber />},
	  {name: 'description', label: 'Notes', span: 12,inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
	    console.log(formValues)
	    props.product ?
		ApiRequest({url: 'Product/UpdateOutSourceProd', method: 'put', data: {
			productId: props.product.productId,
			productName: formValues.productName,
			productCode: formValues.productCode,
			description: formValues.description
		}}).then((res: any) => {
			props.onDialogClose(true, res)
		}) :
		ApiRequest({
		    url: 'Product/AddOutSourceProd',
		    method: 'post',
		    data: {
		    	...formValues,
				employeeId: parseInt(getCookie('id')),
			    images: img || null
		    }
	    }).then((res: any) => {
		    console.log(res)
	    	props.onDialogClose(true, res)
	    })
    }
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm
	      items={ formItems }
	      onFormChange={onFormChange}
	      onFormBlur={onFormBlur}
		  initFormValues={initFormValues}
      />
	    {!props.product ? <Upload.Dragger
		    name="imageFile"
		    multiple={false}
		    action={baseUrl + 'Common/UploadImage'}
		    onChange={(info: any) => {
			    if (info?.file?.response) {
			    	setImg('{"uid":1,"name":"' + info?.file?.name + '","url":"' + info?.file?.response + '"}')
			    }
		    }}
	    >
		    <p className="ant-upload-drag-icon">
			    <InboxOutlined />
		    </p>
		    <p className="ant-upload-text">Click or drag file to this area to upload</p>
	    </Upload.Dragger> : null}
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

export default AddOutsourceProductDialog
