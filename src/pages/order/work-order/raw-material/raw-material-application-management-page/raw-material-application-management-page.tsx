import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../../components/common/common-table/common-table-page'
import React, { useState } from 'react'
import { urlKey } from '../../../../../services/api/api-urls'
import CommonDialog from '../../../../../components/common/others/common-dialog'
import RawMaterialApplicationManagementColumnModel from './raw-material-application-management-column-model'
import RawMaterialApplicationAddDialog from './raw-material-application-add-dialog/raw-material-application-add-dialog'
import { ApiRequest } from '../../../../../services/api/api'
import moment from 'moment'

const RawMaterialApplicationManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false) // Dialog
  const [dialogTitle, setDialogTitle] = useState<string>()

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const rawMaterialApplicationManagementDialog = <RawMaterialApplicationAddDialog onDialogClose={onDialogClose} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'New application',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('New RawMaterial Application')
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Process',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        console.log(rowData)
        if (rowData.processed === 0 || rowData.isComplete) {
          await SweetAlertService.errorMessage('This order is not confirmed by warehouse or is completed, so not editable.')
          return
        }
        const result = await SweetAlertService.inputConfirm({type: 'number', title: 'Quantity', placeholder: 'qty'})
        if (result !== null) {
          if (!result) {
            await SweetAlertService.errorMessage('Please type in quantity before submitting')
            return
          } else {
            console.log(result)
            ApiRequest({
              url: 'RawMaterialApplication/ReceiveRawMaterial?rawMaterialApplicationId=' + rowData.applicationId + '&quantity=' + parseInt(result),
              method: 'put'
            }).then(_ => {
              setTriggerResetData(!triggerResetData)
            })
          }
        }
      }
    }
  ]

  const getRenderData = (data: any) => {
    // console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        isComplete: row.receivedAt ? 1 : 0,
        rawMaterialCode: row.rawMaterial?.rawMaterialCode,
        appliedAt1: row.appliedAt,
        appliedAt: row.appliedAt && moment.utc(row.appliedAt).local().format('DD/MM/YYYY'),
        applyEmployeeName: (row.applyEmployee?.firstName || '') + ' ' + (row.applyEmployee?.lastName || '')
      })
    })
    console.log(renderData)
    return renderData
  }

  const getUpdateData = (dataDetail: any) => {
    if (dataDetail.receivedAt) {
      SweetAlertService.errorMessage('This order is completed, so not deletable.')
      return ''
    }
    return dataDetail
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.RawMaterialApplication,
    title: 'Raw Material Application',
    column: RawMaterialApplicationManagementColumnModel(),
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
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={rawMaterialApplicationManagementDialog} />
    </div>
  )
}

export default RawMaterialApplicationManagementPage
