import React from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../../components/common/common-form/common-form'
import { Button, InputNumber } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../../services/api/api'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import { urlKey, urlType } from '../../../../../services/api/api-urls'

interface IFormValues {
  inspectionId?: any
  quantity?: any
  rawMaterialId?: any
  plateId?: any
  boxCount?: any
}

const RawMaterialEditDialog = (props: { unloadingInspectionData: any, inspectionId: any, onDialogClose: any, isAddPlate?: boolean, isUpdatePlate?: boolean, boxCode?: any, isBoxesEdit?: boolean, canGenerate?: boolean, unloadingDetailData?: any }) => {
  console.log(props.inspectionId)
  const [formRef, setFormRef] = useState<any>()
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [initFormValues, setInitFormValues] = useState<IFormValues>()

  // store selection options from apis request
  const [rawMaterialOptions, setRawMaterialOptions] = useState<any>([])
  const [plateOptions, setPlateOptions] = useState([])

  useEffect(() => {
    ApiRequest({
      urlInfoKey: urlKey.UnloadingInspection,
      type: urlType.GetById,
      dataId: props.inspectionId,
      isShowSpinner: true,
    }).then(res => {
      console.log(res)
      const options = res.data.data.po.poDetail
        .map((row: any) => ({...row, ...row.rawMaterial, renderQty: 'QTY: ' + row.packagingQty}))
        .filter((row: any) => props.isBoxesEdit ? row.outSourceProd : !row.outSourceProd)
      console.log(options)
      setRawMaterialOptions(options || [])
    })
    getSelectOptions('', 'Plate/GetEmptyAvailable?package=0')
      .then(res => {
        setPlateOptions(res)
      })
  }, [props.boxCode])

  const formItems: ItemElementPropsInterface[] | any = [
    !props.unloadingDetailData && { name: 'rawMaterialId', label: 'Raw Material', rules: [{ required: true }], inputElement: commonFormSelect(urlKey.RawMaterial, rawMaterialOptions, props.isBoxesEdit ? ['rawMaterialName', 'renderQty'] : ['rawMaterialName']), showDefault: true },
    { name: 'quantity', label: props.isBoxesEdit ? 'Quantity' : 'Count', rules: [{ required: true }], inputElement: <InputNumber /> },
  ]

  const formItems2: ItemElementPropsInterface[] | any = [
    { name: 'plateId', label: 'Pallet', rules: [{ required: true }], inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false) },
  ]

  const formItems3: ItemElementPropsInterface[] | any = [
    formItems[0],
    { name: 'boxCount', label: 'Box Count', span: 4, rules: [{ required: true }], inputElement: <InputNumber /> },
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
    console.log(changedValues)
    console.log(newValues)
  }

  const onFormBlur = (form: any) => null

  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    console.log(formValues)
    console.log(props.inspectionId)
    if (formValues) {
      if (props.isBoxesEdit) {
        formValues.quantity = rawMaterialOptions.filter((row: any) => row.rawMaterialId === (props.unloadingDetailData ? props.unloadingDetailData.rawMaterialId : formValues.rawMaterialId))[0]?.packagingQty
      }
      const result = props.isAddPlate ?
        await ApiRequest({
          url: 'RawMaterialBox/AddListToPlate',
          method: 'post',
          data: props.boxCode?.map((item: any) => ({rawMaterialBoxId: item.title.rawMaterialBoxId, plateId: formValues.plateId}))
        }) :
        (
          props.isUpdatePlate ?
            await ApiRequest({
              url: 'RawMaterialBox/updateListToPlate',
              method: 'put',
              data: props.boxCode?.map((item: any) => ({rawMaterialBoxId: item.title.rawMaterialBoxId, plateId: formValues.plateId}))
            }) :
            await ApiRequest({
              url: 'RawMaterialBox/GenerateMaterialProductBox?inspectionId=' + props.inspectionId + '&rawMaterialId=' + (props.unloadingDetailData ? props.unloadingDetailData.rawMaterialId : formValues.rawMaterialId) + '&productQuantityPerBox=' + (props.isBoxesEdit ? formValues.quantity : 1) + '&boxCount=' + (props.isBoxesEdit ? formValues.boxCount : formValues.quantity),
              method: 'post',
            })
        )
      if (result) {
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const onNewTemporaryPlate = () => {
    ApiRequest({
      url: 'Plate/AddTemporaryPlate?plateTypeId=2',
      method: 'post',
      isShowSpinner: true
    }).then(_ => {
      props.isAddPlate ?
        ApiRequest({
          url: 'RawMaterialBox/AddListToPlate',
          method: 'post',
          data: props.boxCode?.map((item: any) => ({rawMaterialBoxId: item.title.rawMaterialBoxId, plateId: _.data.data}))
        }) :
        (
          props.isUpdatePlate &&
            ApiRequest({
              url: 'RawMaterialBox/updateListToPlate',
              method: 'put',
              data: props.boxCode?.map((item: any) => ({rawMaterialBoxId: item.title.rawMaterialBoxId, plateId: _.data.data}))
            })
        )
      setTriggerResetData(!triggerResetData)
      ApiRequest({
        url: 'Plate/GetAllPlate',
        method: 'get',
        isShowSpinner: true
      }).then(res => {
        setTriggerResetData(!triggerResetData)
        props.onDialogClose(true)
      })
    })
  }

  return (
    <div style={{ width: '97%', margin: '0 auto 1rem' }}>
      <CommonForm items={(props.isAddPlate || props.isUpdatePlate) ? formItems2 : (props.isBoxesEdit ? formItems3 : formItems)} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      {props.canGenerate && <Button type="primary" style={{marginTop: '1rem'}} onClick={onNewTemporaryPlate}>Generate Pallet</Button>}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{ marginRight: '2rem' }}
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

export default RawMaterialEditDialog
