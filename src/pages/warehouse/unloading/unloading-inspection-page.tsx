import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import React, { useState,useEffect } from 'react'
import CommonDialog from '../../../components/common/others/common-dialog'
import { urlKey } from '../../../services/api/api-urls'
import { getRandomKey, toLocalDate, toLocalDateTime } from '../../../services/lib/utils/helpers'
import RawMaterialBoxEditDialog from './raw-material-box-edit/raw-material-box-edit-dialog'
import UnloadingInspectionAddDialog from './unloading-inspection-add-dialog/unloading-inspection-add-dialog'
import BoxesEditDialog from './boxes-edit-dialog/boxes-edit-dialog'
import UnloadingDetailsDialog from './unloading-details-dialog/unloading-details-dialog'
import UnloadingInspectionColumnModel from './unloading-inspection-column-model'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../../services/api/api'
import { CheckOutlined, EditOutlined, OrderedListOutlined,  } from '@ant-design/icons'

const UnloadingInspectionManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [unloadingInspectionData, setUnloadingInspectionData] = useState<any>()
  const [isNewUnloadingInspection, setIsNewUnloadingInspection] = useState(false)
  const [isComplete, setisComplete] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [unloadingDetailsOpen, setUnloadingDetailsOpen] = useState(false)
  const [rawMaterialBoxData, setRawMaterialBoxData] = useState<any>()
  const [inspectionId, setInspectionId] = useState<any>()

  useEffect(() => {
    document.title = "Unloading Management";
  }, [])

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    // if (isModified) {
      setTriggerResetData(getRandomKey())
    // }
  }

  const onDialogClose2 = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen2(false)
    setTriggerResetData(getRandomKey())
  }

  const onDialogClose3 = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen3(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const onUnloadingDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setUnloadingDetailsOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const unloadingDetailsDialog = <UnloadingDetailsDialog isNewUnloadingInspection={isNewUnloadingInspection}  unloadingInspectionData={unloadingInspectionData} onDialogClose={onUnloadingDialogClose} />

  const UnloadingInspectionManagementDialog = <UnloadingInspectionAddDialog isNewUnloadingInspection={isNewUnloadingInspection} isComplete={isComplete} unloadingInspectionData={unloadingInspectionData} onDialogClose={onDialogClose} />

  const RawMaterialEditDialog = < RawMaterialBoxEditDialog unloadingInspectionData={unloadingInspectionData} rawMaterialBoxData={rawMaterialBoxData} inspectionId={inspectionId} onDialogClose2={onDialogClose2}/>

  const boxesEditDialog = <BoxesEditDialog unloadingInspectionData={unloadingInspectionData} inspectionId={inspectionId} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: <div><OrderedListOutlined />Details</div>,
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setUnloadingDetailsOpen(true)
        setUnloadingInspectionData(rowData)
        setIsNewUnloadingInspection(false)
        setInspectionId(rowData.inspectionId)
      }
    },
    {
      icon:'ghost',// 'EditOutlined', //Button attr of Ant design (danger, ghost)
      tooltip: <div><EditOutlined />Edit</div>,
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setUnloadingInspectionData(rowData)
        setIsNewUnloadingInspection(false)
        setisComplete(false)
        setInspectionId(rowData.inspectionId)
      }
    },
    {
      icon: 'danger', //Button attr of Ant design (danger, ghost)
      tooltip: <div><CheckOutlined />Complete</div>,
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setUnloadingInspectionData(rowData)
        setIsNewUnloadingInspection(false)
        setisComplete(true)        
        setInspectionId(rowData.inspectionId)
      }
    },    
    // {
    //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
    //   tooltip: 'Complete',
    //   isFreeAction: false,
    //   onClick: async (event: any, rowData: any) => {
    //     if (rowData.po?.poStatusId === 10) {
    //       SweetAlertService.errorMessage('Already completed.')
    //       return
    //     }
    //     const result = await SweetAlertService.confirmMessage()
    //     if (result) {
    //       ApiRequest({
    //         url: 'PurchaseOrder/CompleteUnlooingPO?id=' + rowData.poId,
    //         method: 'put'
    //       }).then(_ => {
    //         setTriggerResetData(getRandomKey())
    //       })
    //     }
    //   }
    // },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'New',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setisComplete(false)        
        setUnloadingInspectionData({})
        setIsNewUnloadingInspection(true)
      }
    }
  ]

  const getRenderData = (data: any) => {
  // console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        unloadingDate1: row.unloadingDate,
        arrivalTime1: row.arrivalTime,
        takeAwayDate1: row.takeAwayDate,
        unloadingDate: toLocalDate(row.unloadingDate),
        arrivalTime: toLocalDateTime(row.arrivalTime),
        takeAwayDate: toLocalDate(row.takeAwayDate),
        poStatus:row.po.poStatusId,
        poNo:row.po?.poNo,
        suplierName:row.po?.suplier?.suplierName
      })
    })
    console.log(renderData)
    return renderData
  }

  const getUpdateData = (dataDetail: any) => {
    return dataDetail
  }

  const AddNewMaterialDialog = (rowData: any) => {
    setOpen2(true)
    setRawMaterialBoxData(rowData.rawMaterialBox)
    setInspectionId(rowData.inspectionId)
  }

  const AddNewBoxDialog = (rowData: any) => {
    setOpen3(true)
    setUnloadingInspectionData(rowData)
    setIsNewUnloadingInspection(false)
    setInspectionId(rowData.inspectionId)
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.UnloadingInspection,
    title: 'Purchase Receiving List',
    column: UnloadingInspectionColumnModel({
      AddNewMaterialDialog: AddNewMaterialDialog,
      AddNewBoxDialog: AddNewBoxDialog,
    }),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => getUpdateData(dataDetail),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={'Unloading Details'} open={unloadingDetailsOpen} onDialogClose={onUnloadingDialogClose} dialogContent={unloadingDetailsDialog} />
      <CommonDialog title={''} open={open} onDialogClose={onDialogClose} dialogContent={UnloadingInspectionManagementDialog} />
      <CommonDialog title={'Edit Raw Material Box'} open={open2} onDialogClose={onDialogClose2} dialogContent={RawMaterialEditDialog} />
      <CommonDialog title={'Edit Boxes'} open={open3} onDialogClose={onDialogClose3} dialogContent={boxesEditDialog} />
    </div>
  )
}

export default UnloadingInspectionManagementPage
