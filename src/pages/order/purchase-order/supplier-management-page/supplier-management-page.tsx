import React, { useState,useEffect } from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import CommonDialog from '../../../../components/common/others/common-dialog'
import { urlKey } from '../../../../services/api/api-urls'
import { SupplierManagementColumnModel } from './supplier-management-column-model'
import SupplierManagementDialog from './supplier-management-dialog/supplier-management-dialog'
import { getDiffDays } from '../../../../services/lib/utils/helpers'

export const SupplierManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isRawMaterial, setIsRawMaterial] = useState(false)
  const [isNewSupplier, setIsNewSupplier] = useState(false)

  useEffect(() => {
    document.title = "Supllier Management";
   }, [])
  const onDialogClose = (isModified?: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    setTriggerResetData(!triggerResetData)
  }

  const supplierManagementDialog = <SupplierManagementDialog isNewSupplier={isNewSupplier} isRawMaterial={isRawMaterial} onDialogClose={onDialogClose} data={orderData} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Supplier Edit')
        setIsRawMaterial(false)
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Raw Material Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Supplier Raw Material Edit')
        setIsRawMaterial(true)
      }
    }
    // ,
    // {
    //   icon: '', //Button attr of Ant design (danger, ghost)
    //   tooltip: 'New Supllier',
    //   isFreeAction: true,
    //   onClick: (event: any, rowData: any) => {
    //     setIsNewSupplier(true)
    //     setOpen(true)
    //     setOrderData({})
    //     setDialogTitle('New Sales Order')
    //   }
    // }    
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if (row.active) {
        renderData.push({
          ...row,
          qualification: row.qualification.map((item: any) => ({
            ...item,
            expDate: item.expDate && (new Date(item.expDate + '.000Z')).toDateString(),
            isExpiredAlert: getDiffDays(item.expDate) <= 7
          }))
        })
      }
    })
    return renderData
  }

  const getUpdateData = (dataDetail: any) => {
    return {
      ...dataDetail,
      suplierType: dataDetail.qualification?.length ? 1 : 0
    }
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Supplier,
    title: 'Supplier',
    column: SupplierManagementColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => getUpdateData(dataDetail),
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotEditable: true,
    // isNotAddable: true,    
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={supplierManagementDialog} />
    </div>
  )
}
