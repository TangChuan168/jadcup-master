import React, { useState,useEffect } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import { toLocalDateTime } from '../../../../services/lib/utils/helpers'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { BoxManagementColumnModel } from './box-management-column-model'
import { Button } from 'antd'

const BoxManagementPage = (): any => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [selectedRows, setSelectedRows] = useState<any>()

  useEffect(() => {
    document.title = "Boxes Management";
   }, [])
  const getRenderData = (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        productName: row.product?.productName,
        createdAt1: row.createdAt,
        createdAt: toLocalDateTime(row.createdAt),
        position: row.position,
        palletCode: row.palletCode,
      })
    })
    return renderData
  }
  const getUpdateData = async (dataDetail: any, type: any) => {
    if (type === urlType.Delete) {
      let isInStock = await checkBoxInStock(dataDetail)
      //temp test
      isInStock = true
      const { boxId } = dataDetail

      const result = isInStock ?
        await ApiRequest({
          url: 'Box/ObsoleteBox?id=' + boxId,
          method: urlType.Delete,
          isShowSpinner: false
        })
        :
        await ApiRequest({
          url: 'Box/DeleteBox?id=' + boxId,
          method: urlType.Delete,
          isShowSpinner: false
        })
      if (result) {
        setTriggerResetData(!triggerResetData)
      }
      return 'resolve'
    }
    return dataDetail
  }

  const checkBoxInStock = async (rowData: any) => {
    const { productId } = rowData
    if (productId) {
      const result = await ApiRequest({
        url: 'Box/GetBoxLocationByProductId?productId=' + productId,
        method: urlType.Get,
        isShowSpinner: true
      })
      const inStock = result.data.data.find((e:any) => e.boxId === rowData.boxId)
      return !!inStock
    }
  }

  const qtyButton = (rowData: any) => {
    return (
      <Button
        onClick={async () => {
          const newQuantity = await SweetAlertService.inputConfirm({
            type: 'number',
            title: 'Edit Quantity',
            placeholder: 'quantity',
            defaultValue: rowData.quantity
          })
          console.log(newQuantity)
          if (newQuantity) {
            let inStock = await checkBoxInStock(rowData)
            inStock = true
            const result = inStock ?
              await ApiRequest({
                url: 'Box/UpdateStockBoxQuantity?boxId=' + rowData.boxId + '&quantity=' + newQuantity,
                method: 'PUT',
                isShowSpinner: false
              })
              :
              await ApiRequest({
                url: 'Box/UpdateBoxQuantity?boxId=' + rowData.boxId + '&quantity=' + newQuantity,
                method: 'PUT',
                isShowSpinner: false
              })
            if (result) {
              await SweetAlertService.successMessage('Submit successfully')
              setTriggerResetData(!triggerResetData)
            }
          }
        }}
      >Edit</Button>
    )
  }

  const onSelectionChange = (rows: any) => {
    console.log(rows)
    setSelectedRows(rows)
  }

  const actionButtons: any = [
    {
      icon: '',
      tooltip: 'Batch delete',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        const confirmResult = await SweetAlertService.confirmMessage()
        if (!confirmResult) {
          return
        }
        const ids = selectedRows.map((row: any) => row.boxId)
        ApiRequest({
          url: 'Box/ObsoleteBoxs',
          method: 'put',
          data: ids
        }).then(_ => {
          setTriggerResetData(!triggerResetData)
        })
      }
    },
  ]

  return (
    <div>
      <CommonTablePage
        urlInfoKey={urlKey.Box}
        title="Obsolete Box"
        isNotAddable={true}
        isNotEditable={true}
        actionButtons={actionButtons}
        mappingUpdateData={(dataDetail: any, type: any) => getUpdateData(dataDetail, type)}
        mappingRenderData={(data: any) => getRenderData(data)}
        column={BoxManagementColumnModel({qtyButton})}
        triggerResetData={triggerResetData}
        isEnableSelect={true}
        onSelectionChange={onSelectionChange}
      />
    </div>
  )
}

export default BoxManagementPage
