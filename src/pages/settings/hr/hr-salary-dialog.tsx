import React from 'react'
import { useEffect, useState } from 'react'
import moment from 'moment'
import CommonForm, { ItemElementPropsInterface } from '../../../components/common/common-form/common-form'
import { commonFormSelect } from '../../../components/common/common-form/common-form-select'
import { Button, DatePicker, Input } from 'antd'
import { urlKey } from '../../../services/api/api-urls'

interface IFormValues {
	quotationId?: any
	draft?: any
	customerId?: any
	employeeId?: any
	effDate?: any
	expDate?: any
	optionCheckboxGroup?: any
	optionCustomComment?: any
}

const HrSalaryDialog = (props: { resourceId?: any, data: any, onDialogClose: any }) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  // const [quotationItemChangedValueIndex, setQuotationItemChangedValueIndex] = useState<any>()

  // store selection options from apis request
  const [customerOptions, setCustomerOptions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>()
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [baseProductsOptions, setBaseProductsOptions] = useState([])
  const [quotationCommentOptions, setQuotationCommentOptions] = useState([])
  const [isOnlyShowProduct, setIsOnlyShowProduct] = useState<number>(0)

  // useEffect(() => {
	//   setInitFormValues({
	// 	  isOnlyProduct: isOnlyProduct,
	// 	  // draft: 0,
	// 	  ...props.quotationData,
	// 	  quotationItem: props.quotationData?.quotationItem?.map((row: any) => ({
	// 		  ...row,
	// 		  cartonQuantity: getCartonQuantity(row.product || row.baseProduct),
	// 		  // originPrice: getOriginPrice(row.product || row.baseProduct) || 0,
	// 	  })),
	// 	  effDate: props.quotationData?.effDate && moment(props.quotationData.effDate + '.000Z') || moment(),
	// 	  expDate: props.quotationData?.expDate && moment(props.quotationData.expDate + '.000Z') || moment().add(1, 'month'),
	// 	  optionCheckboxGroup: optionCheckboxGroup,
	// 	  optionCustomComment: optionCustomComment
	//   })
  //   getSelectOptions(urlKey.Customer).then(res => {
	//     console.log('ddddd')
	//     setCustomerOptions(res)
	//     if (props.quotationData?.customerId) {
	// 	    setSelectedCustomer(res.filter((row: any) => row.customerId === props.quotationData?.customerId)[0])
	//     }
  //   })
  //   getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
  //   getSelectOptions(urlKey.BaseProduct).then(res => setBaseProductsOptions(res))
  //   getSelectOptions(urlKey.QuotationOptionItem).then(res => {
	//     setQuotationCommentOptions(res.map((row: any) => ({
	// 	    label: row[urlKey.QuotationOptionItem + 'Name'],
	// 	    value: row[urlKey.QuotationOptionItem + 'Id'],
	//     })))
  //   })
  // }, [props.quotationData])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', label: 'Customer', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
    {name: 'employeeId', label: 'Sales', inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'effDate', label: 'Quote Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'expDate', label: 'Valid Date', rules: [{required: true}], inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'quotationNo', label: 'Quotation No', inputElement: <Input disabled={true} />},
	  {name: 'notes', label: 'Comments', inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  // const onConfirm = async () => {
  //   formRef.submit()
  //   const formValues: IFormValues = await formRef.validateFields()
  //   if (formValues) {
	//     // console.log(formValues)
  //     const requestValues = {
  //       ...formValues,
  //       quotationId: props.quotationData.quotationId,
	//       draft: formValues.draft ? 1 : 0,
	//       quotationOption: quotationOption,
  //       quotationItem: formValues.quotationItem?.map((row: IQuotationItem) => ({
  //         ...row,
	//         isLowerPrice: row.originPrice > row.price ? 1 : 0,
  //         quotationId: props.quotationData.quotationId
  //       })),
  //     }
  //     // console.log(requestValues)
  //     let result
  //     if (props.isNewQuotation) {
  //       result = await ApiRequest({
  //         urlInfoKey: urlKey.Quotation,
  //         type: urlType.Create,
  //         data: requestValues
  //       })
  //     } else {
	//       result = await ApiRequest({
	// 	      urlInfoKey: urlKey.Quotation,
	// 	      type: urlType.Update,
	// 	      data: requestValues
	//       })
	//       // if (result && !requestValues.draft) {
	// 	    //   const updateStatusResult = await ApiRequest({
	// 		  //     url: 'Quotation/UpdateQuotationDraftStatus?id=' + result.data.data,
	// 		  //     method: 'put'
	// 	    //   })
	//       // }
  //     }
  //     if (result) {
  //       // console.log(result)
  //       await SweetAlertService.successMessage('Submit successfully')
  //       props.onDialogClose(true)
  //     }
  //   }
  // }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <CommonForm
	      items={ formItems }
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
          // onClick={onConfirm}
          type="primary"
        >Confirm</Button>
      </div>
    </div>
  )
}

export default HrSalaryDialog
