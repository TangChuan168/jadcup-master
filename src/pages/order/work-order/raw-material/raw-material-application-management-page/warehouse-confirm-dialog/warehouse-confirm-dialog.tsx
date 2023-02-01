import CommonForm, { ItemElementPropsInterface } from '../../../../../../components/common/common-form/common-form'
import { Button } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../../services/api/api'
import { urlKey } from '../../../../../../services/api/api-urls'
import React, { useEffect, useState } from 'react'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import WarehouseConfirmDialogTable from './warehouse-confirm-dialog-table/warehouse-confirm-dialog-table'
import { getUserId } from '../../../../../../services/lib/utils/auth.utils'

interface IFormValues {
  applyEmployeeId?: any
}

const WarehouseConfirmDialog = (props: {applicationId: any, rawMaterialId: any, onDialogClose: any}) => {
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [applicationDetails, setApplicationDetails] = useState<any>([])

  // store selection options from apis request
  const [employeeOptions, setEmployeeOptions] = useState([])

  const [tableRow, setTableRow] = useState([])

  useEffect(() => {
    // console.log(props.orderData)
    setInitFormValues({applyEmployeeId: getUserId()})
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    ApiRequest({
      url: 'ApplicationDetails/GetAllApplicationDetails?applicationId=' + props.applicationId,
      method: 'get'
    }).then(res => setApplicationDetails(res.data.data))
  }, [])

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'applyEmployeeId', label: 'Apply By', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
  ]

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    const result = await SweetAlertService.confirmMessage()
    if (!result) {
      return
    }
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      if (!tableRow?.length) {
        await SweetAlertService.errorMessage('Please set up table firstly!')
        return
      }
      const deleteArrays = applicationDetails.filter((row: any) => !tableRow.filter((item: any) => item.rawMaterialBoxId === row.rawMaterialBoxId)[0])
      const postArrays: any = tableRow.filter((row: any) => !applicationDetails.filter((item: any) => item.rawMaterialBoxId === row.rawMaterialBoxId)[0])
      console.log(deleteArrays)
      console.log(postArrays)
      for (const row of deleteArrays) {
        await ApiRequest({
          url: 'ApplicationDetails/DeleteApplicationDetails?id=' + row.detailsId,
          method: 'delete'
        })
      }
      for (const row of postArrays) {
        await ApiRequest({
          url: 'ApplicationDetails/AddApplicationDetails',
          method: 'post',
          data: {
            applicationId: props.applicationId,
            rawMaterialBoxId: row.rawMaterialBoxId,
            quantity: 1
          }
        })
      }
      const result = await ApiRequest({
        url: 'RawMaterialApplication/ProcessRawMaterialApplication?id=' + props.applicationId + '&warehouseEmployeeId=' + formValues.applyEmployeeId,
        method: 'put'
      })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const onSelectionChange = (value: any) => {
    console.log(value)
    setTableRow(value)
  }

  return (
    <div style={ {width: '97%', margin: '0 auto 1rem'} }>
      <WarehouseConfirmDialogTable applicationId={props.applicationId} rawMaterialId={props.rawMaterialId} onSelectionChange={onSelectionChange} />
      <CommonForm items={formItems} onFormChange={() => null} onFormBlur={onFormBlur} initFormValues={initFormValues} />
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

export default WarehouseConfirmDialog
