import React, { useEffect } from 'react'
import { useState } from 'react'
import CommonDialog from '../../../../components/common/others/common-dialog'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import { getRandomKey } from '../../../../services/lib/utils/helpers'
import { MoveToCellModal } from '../../temporary-Zone/move-to-cell-modal'
import RawMaterialEditDialog from './raw-material-edit/raw-material-edit-dialog'
import RawMaterialBoxColumnModel from './raw-material-box-edit-dialog-column-model'
import { getLocationCode } from '../../dispatch/dispatch-list/dispatch-order-details-table/dispatch-location-table/dispatch-location-table'
import { MoveToTempZone } from '../../relocate-plate/relocate-plate-page'

const RawMaterialBoxEditDialog = (props: { rawMaterialBoxData: any, onDialogClose2: any, inspectionId: any, unloadingInspectionData: any }) => {
  console.log(props.inspectionId)
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isAddPlate, setIsAddPlate] = useState(false)
  const [isUpdatePlate, setIsUpdatePlate] = useState(false)
  const [selectedBoxCode, setSelectedBoxCode] = useState<any>()
  const [inspectionId, setInspectionId] = useState<any>(props.inspectionId)
  const [selectedRowData, setSelectedRowData] = useState<any>()
  const [selectedCell, setSelectedCell] = useState<any>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [zoneTypeOptions, setZoneTypeOptions] = useState<any>()

  useEffect(() => {
    console.log(props.rawMaterialBoxData)
    ApiRequest({
      url: 'TempZone/GetZoneType',
      method: 'get',
      isShowSpinner: false
    }).then((res: any) => {
      const obj: any = {}
      res.data.data.forEach((row: any) => {
        obj[row.zoneType] = row.zoneTypeName
      })
      setZoneTypeOptions(obj)
    })
  }, [])

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add New Raw Material',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setInspectionId(inspectionId)
        setDialogTitle('')
        setIsAddPlate(false)
        setSelectedBoxCode(null)
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add Pallet',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (!rowData.plateId) {
          setOpen(true)
          setDialogTitle('')
          setIsAddPlate(true)
          setIsUpdatePlate(false)
          setSelectedBoxCode(rowData.boxCode)
        } else {
          SweetAlertService.errorMessage('Already added pallet')
        }
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Update Pallet',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (!rowData.plateId) {
          SweetAlertService.errorMessage('Please add firstly.')
        } else {
          setOpen(true)
          setDialogTitle('')
          setIsAddPlate(false)
          setIsUpdatePlate(true)
          setSelectedBoxCode(rowData.boxCode)
        }
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Shelf',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (!rowData.plateId) {
          SweetAlertService.errorMessage('Assign pallet firstly')
          return
        }
        if (rowData.cell) {
          SweetAlertService.errorMessage('Already moved to cell')
        } else {
          setSelectedRowData(rowData)
          showModal()
        }
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Tempzone',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        MoveToTempZone(rowData.plateId, zoneTypeOptions, () => {
          setTriggerResetData(getRandomKey())
        })
      }
    }
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    ApiRequest({
      url: 'ShelfPlate/AddShelfPlate',
      method: 'post',
      data: {
        cellId: selectedCell,
        plateId: selectedRowData.plateId
      }
    }).then(_ => {
      setButtonDisabled(true)
      setTriggerResetData(getRandomKey())
    })
  }

  const selectOnChangeHandler = (value:any) => {
    console.log(value)
    setSelectedCell(value)
    setButtonDisabled(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setButtonDisabled(true)
  }

  const onDialogClose = (isModified: boolean) => {
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const RawMaterialManagementDialog = <RawMaterialEditDialog unloadingInspectionData={props.unloadingInspectionData} inspectionId={inspectionId} onDialogClose={onDialogClose} isAddPlate={isAddPlate} isUpdatePlate={isUpdatePlate} boxCode={selectedBoxCode} />

  const commonTableProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.RawMaterialBox,
    getAllUrl: 'RawMaterialBox/GetRawMaterialBoxAndBoxByInspectionId?inspectionId=' + inspectionId,
    title: 'Raw Material Box Table',
    column: RawMaterialBoxColumnModel,
    mappingRenderData: (data: any) => data.rawMaterialBoxes?.map((row: any) => ({...row, isCell: row.cell ? 1 : 0, locationCode: getLocationCode(row)})),
    mappingUpdateData: async (dataDetail: any, type: any) => {
      console.log(dataDetail)
      if (type === urlType.Delete && !dataDetail.plateId) {
        await ApiRequest({
          url: 'RawMaterialBox/DeleteRawMaterialBox?barCode=' + dataDetail.boxCode,
          method: 'delete',
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
        return 'resolve'
      }
      return dataDetail
    },
    actionButtons: actionButtons,
    triggerResetData: triggerResetData,
    isNotEditable: true,
    isNotAddable: true,
  }

  return (
    <>
      <CommonTablePage {...commonTableProps} />
      <MoveToCellModal buttonDisabled={buttonDisabled} isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk} selectOnChangeHandler={selectOnChangeHandler} />
      <CommonDialog width={'47%'} title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={RawMaterialManagementDialog} />
    </>
  )
}

export default RawMaterialBoxEditDialog

