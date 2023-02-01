import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../../components/common/common-table/common-table-page'
import React, { useState } from 'react'
import { urlKey } from '../../../../../services/api/api-urls'
import CommonDialog from '../../../../../components/common/others/common-dialog'
import RawMaterialApplicationManagementColumnModel from './raw-material-application-management-column-model'
import { ApiRequest } from '../../../../../services/api/api'
import WarehouseConfirmDialog from './warehouse-confirm-dialog/warehouse-confirm-dialog'
import moment from 'moment'

const WarehouseConfirmManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false) // Dialog
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [dialogApplicationId, setDialogApplicationId] = useState<any>()
  const [dialogRawMaterialId, setDialogRawMaterialId] = useState<any>()

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const warehouseConfirmDialog = <WarehouseConfirmDialog applicationId={dialogApplicationId} rawMaterialId={dialogRawMaterialId} onDialogClose={onDialogClose} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Confirm',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (rowData.processed === 1) {
          await SweetAlertService.errorMessage('This order is completed, so not editable.')
          return
        }
        setDialogApplicationId(rowData.applicationId)
        setDialogRawMaterialId(rowData.rawMaterialId)
        console.log(rowData)
        setDialogTitle('Confirm Detail')
        setOpen(true)
      }
    }
  ]

  const getRenderData = (data: any) => {
    // console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        isComplete: row.processed,
        rawMaterialCode: row.rawMaterial?.rawMaterialCode,
        appliedAt1: row.appliedAt,
        appliedAt: row.appliedAt && moment.utc(row.appliedAt).local().format('DD/MM/YYYY'),
        applyEmployeeName: (row.applyEmployee?.firstName || '') + ' ' + (row.applyEmployee?.lastName || '')
      })
    })
    console.log(renderData)
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.RawMaterialApplication,
    title: 'Warehouse Confirm',
    column: RawMaterialApplicationManagementColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    isNotAddable: true,
    isNotDeletable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={warehouseConfirmDialog} />
    </div>
  )
}

export default WarehouseConfirmManagementPage
