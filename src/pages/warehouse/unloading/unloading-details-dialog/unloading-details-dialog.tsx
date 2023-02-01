import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import UnloadingDetailsHandleDialog from '../unloading-details-handle-dialog/unloading-details-handle-dialog'
import CommonDialog from '../../../../components/common/others/common-dialog'
import { urlKey } from '../../../../services/api/api-urls'
import { getRandomKey } from '../../../../services/lib/utils/helpers'
import UnloadingDetailsHandleBoxDialog from '../unloading-details-handle-dialog/unloading-details-handle-box-dialog'
import { ApiRequest } from '../../../../services/api/api'

interface IFormValue {
  poId: any
}

const UnloadingDetailsDialog = (props: {unloadingInspectionData: any; onDialogClose: any; isNewUnloadingInspection: boolean}) => {
  const [formRef, setFormRef] = useState<any>()
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [handleOpen, setHandleOpen] = useState(false)
  const [handleBoxOpen, setHandleBoxOpen] = useState(false)
  const [productId, setProductId] = useState<any>()
  const [initFormValue, setInitFormValue] = useState<IFormValue>()
  const [unloadingDetailData, setUnloadingDetailData] = useState<any>()

  // store selection options from apis request

  const [poOptions, setPo] = useState([])

  useEffect(() => {
    console.log(props.unloadingInspectionData)
    setInitFormValue({
      ...props.unloadingInspectionData
    })
    getSelectOptions(urlKey.PurchaseOrder)
      .then(res => {
        res.map((e:any) => {
          e.poNo = e.poNo + ': ' + e.suplier.suplierName
        })
        setPo(res.filter((row: any) => row.poStatusId === 2))
      })
  }, [])

  const onHandleDialogClose = (isModified: any) => {
    setHandleOpen(false)
    setHandleBoxOpen(false)
    setIsShowSpinner(false)
    // if (isModified) {
      setTriggerResetData(getRandomKey())
    // }
  }

  const unloadingDetailsHandleDialog = <UnloadingDetailsHandleDialog onDialogClose={onHandleDialogClose} unloadingDetailData={unloadingDetailData} inspectionId={props.unloadingInspectionData.inspectionId}/>
  const unloadingDetailsHandleBoxDialog = <UnloadingDetailsHandleBoxDialog onDialogClose={onHandleDialogClose} unloadingDetailData={unloadingDetailData} inspectionId={props.unloadingInspectionData.inspectionId} productId={productId}/>

  const formItem: ItemElementPropsInterface[] | any = [
    { name: 'poId', label: 'Purchase Order', rules: [{ required: true }], inputElement: commonFormSelect(urlKey.PurchaseOrder, poOptions, ['poNo'], true) },
  ]

  const unloadingDetailsColumn = [
    {
      title: 'Raw Material',
      field: 'rawMaterialName',
      sorting: false,
    },
    {
      title: 'Suplier Product Code',
      field: 'suplierProductCode',
      sorting: false,
    },
    {
      title: 'Unit',
      field: 'unit',
      sorting: false,
    },
    {
      title: 'Received Qty',
      field: 'revQuantity',
      sorting: false,
    },
    {
      title: 'Handled Qty',
      field: 'handledQuantity',
      sorting: false,
    },
    {
      title: 'Pallet Qty',
      field: 'palletQuantity',
      sorting: false,
    },
    {
      title: 'Dispatched Qty',
      field: 'dispatchedQuantity',
      sorting: false,
    },    
    {
      title: 'Notes',
      field: 'note',
      sorting: false,
    },
  ]

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Handle',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        const result = await ApiRequest({
          url: '/RawMaterial/GetRawMaterialById?id=' + rowData.rawMaterialId,
          method: 'get'
        })
        setProductId(result.data.data.productId)
        result.data.data.productId ? setHandleBoxOpen(true) : setHandleOpen(true)
        setUnloadingDetailData(rowData)
        // setIsNewUnloadingInspection(false)
        // setInspectionId(rowData.inspectionId)
      }
    },
  ]

  const getRenderData = (data: any) => {
    for (let i = 0; i < data.po.poDetail.length; i++) {
      for (let j = 0; j < data.unloadingDetail.length; j++) {
        if (data.po.poDetail[i].rawMaterialId === data.unloadingDetail[j].rawMaterialId) {
          data.unloadingDetail[j].rawMaterialName = data.po.poDetail[i].rawMaterial.rawMaterialName
          data.unloadingDetail[j].suplierProductCode = data.po.poDetail[i].suplierProductCode
          data.unloadingDetail[j].unit = data.po.poDetail[i].unit
        }
      }
    }
    console.log(data.unloadingDetail)
    return data.unloadingDetail
  }

  const getUpdateData = (dataDetail: any) => {
    return dataDetail
  }

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    getAllUrl: 'UnloadingInspection/GetUnloadingInspectionById?id=' + props.unloadingInspectionData?.inspectionId,
    title: '',
    column: unloadingDetailsColumn,
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => getUpdateData(dataDetail),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotDeletable: true,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonForm items={formItem} initFormValues={initFormValue} onFormBlur={onFormBlur} onFormChange={onFormChange} />
      <CommonTablePage {...commonTablePageProps} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '2rem'}}>
        <Button onClick={() => props.onDialogClose(false)}>
        Close
        </Button>
        {/* <Button disabled={false} onClick={() => console.log('Confirm')} type='primary' style={{ marginLeft: '2rem' }}>
        Confirm
        </Button> */}
      </div>
      <CommonDialog title={'Handle Details'} open={handleOpen} onDialogClose={onHandleDialogClose} dialogContent={unloadingDetailsHandleDialog} />
      <CommonDialog title={'Handle Boxes Details'} open={handleBoxOpen} onDialogClose={onHandleDialogClose} dialogContent={unloadingDetailsHandleBoxDialog} />
    </div>
  )
}

export default UnloadingDetailsDialog
