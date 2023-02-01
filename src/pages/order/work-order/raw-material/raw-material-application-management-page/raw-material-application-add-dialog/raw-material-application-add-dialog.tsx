import CommonForm, { ItemElementPropsInterface } from '../../../../../../components/common/common-form/common-form'
import { InputNumber, Button } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../../services/api/api'
import { urlKey, urlType } from '../../../../../../services/api/api-urls'
import React, { useEffect, useState } from 'react'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import { getUserId } from '../../../../../../services/lib/utils/auth.utils'

interface IFormValues {
  applyEmployeeId?: any
  rawMaterialId?: any
  applyQuantity?: any
}

const RawMaterialApplicationAddDialog = (props: {onDialogClose: any}) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  // store selection options from apis request
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [rawMaterialOptions, setRawMaterialOptions] = useState([])

  useEffect(() => {
    // console.log(props.orderData)
    setInitFormValues({applyEmployeeId: getUserId()})
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.RawMaterial).then(res => setRawMaterialOptions(res))
  }, [])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'applyEmployeeId', label: 'Apply Employee', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'rawMaterialId', label: 'Raw Material', rules: [{required: true}], inputElement: commonFormSelect(urlKey.RawMaterial, rawMaterialOptions)},
    {name: 'applyQuantity', label: 'Quantity(KG)', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      // console.log(requestValues)
      const result = await ApiRequest({
        urlInfoKey: urlKey.RawMaterialApplication,
        type: urlType.Create,
        data: formValues
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

export default RawMaterialApplicationAddDialog
