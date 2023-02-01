import React, { useEffect, useState } from 'react'
import { urlKey, urlType } from '../../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../../components/common/common-form/common-form'
import { Button, Input,InputNumber, Switch } from 'antd'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import SupplierQualificationManagementTable
  from './supplier-qualification-management-table/supplier-qualification-management-table'
import RawMaterialManagementPage
  from '../../../../settings/small-group-management-pages/raw-material-management-page/raw-material-management-page'
import SupplierRawMaterialTable from './supplier-raw-material-table/supplier-raw-material-table'
import { commonFormSelect, getSelectOptions } from '../../../../../components/common/common-form/common-form-select'

interface IQualification {
  suplierId?: any
  expDate?: any
  qualificationName?: any
  qualificationUrls?: any
}

interface IFormValues {
  suplierId?: any
  suplierName?: number
  suplierType?: any
  qualification?: IQualification[]
}

const SupplierManagementDialog = (props: { data: any, onDialogClose: any, isRawMaterial: boolean ,isNewSupplier :boolean}) => {
  const [formRef, setFormRef] = useState<any>()
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  useEffect(() => {
    setInitFormValues(props.data)    
    getSelectOptions(urlKey.Currency).then(res => {
	    setCurrencyOptions(res)
    })
  }, [props.data])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'suplierName', label: 'Supplier Name', span: 4,rules: [{required: true}], inputElement: <Input />},
    {name: 'address', label: 'Address', span: 4,inputElement: <Input />},
    {name: 'primaryPerson', label: 'Primary Person', span: 4,inputElement: <Input />},    
    {name: 'phone', label: 'Mobile', span: 4,inputElement: <Input />},
    {name: 'office', label: 'Office/DDI', span: 4,inputElement: <Input />},    
    {name: 'email', label: 'Email', span: 4,inputElement: <Input />},
    {name: 'gstNumber', label: 'GST Number',span: 4, inputElement: <Input />},    
    {name: 'taxRate', label: 'Tax Rate[0.00]',span: 4,inputElement: <InputNumber step="0.01"/>}, 
 
    {name: 'currencyId', label: 'Currency',span: 4, inputElement: commonFormSelect(urlKey.Currency, currencyOptions, ['currencyName'])}, 
    {name: 'suplierType', label: 'With Qualification',span: 4, inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    {name: 'note', label: 'Note', span: 8,inputElement: <Input />},    
    {name: 'paymentTerm', label: 'Payment Terms',span: 24, inputElement:<Input.TextArea showCount={true} maxLength={2000} autoSize={ true } />},
  ]
  const onFormChange = async (changedValues: any, newValues: any, form: any) => {
    console.log(changedValues)
    console.log(newValues)
  }

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
      const requestValues = {
        ...formValues,
        suplierType: formValues.suplierType ? 1 : 0,
        suplierId: props.data?.suplierId,
      }
      console.log(requestValues)
      const result = await ApiRequest({
        urlInfoKey: urlKey.Supplier,
        type: urlType.Update,
        data: requestValues
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const getModalFooter = () => {
    return (
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={() => {
            props.onDialogClose()
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
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      {props.isRawMaterial ? <SupplierRawMaterialTable supplierId={props.data?.suplierId} /> : <SupplierQualificationManagementTable supplierId={ props.data.suplierId } />}
      {getModalFooter()}
    </div>
  )
}

export default SupplierManagementDialog
