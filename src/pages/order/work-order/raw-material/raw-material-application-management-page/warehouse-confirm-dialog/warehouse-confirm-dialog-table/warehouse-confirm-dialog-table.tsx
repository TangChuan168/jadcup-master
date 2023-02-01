import React, { useEffect } from 'react'
import WarehouseConfirmDialogTableColumnModel from './warehouse-confirm-dialog-table-column-model'
import CommonTablePage from '../../../../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../../../../services/api/api-urls'

const WarehouseConfirmDialogTable = (props: {applicationId: any, rawMaterialId: any, onSelectionChange: any}): any => {
  useEffect(() => {
    console.log(props.applicationId)
  }, [props.applicationId])

  return (
    <CommonTablePage
      urlInfoKey={urlKey.RawMaterialBox}
      getAllUrl={'RawMaterialBox/GetRawMaterialBoxLocationByRawMaterialId?rawMaterialId=' + props.rawMaterialId}
      title="Confirm detail table"
      mappingRenderData={(data: any) => {
        console.log(data)
        const renderData = data.filter((row: any) => row.active).map((row: any) => ({...row, quantity: 1}))
        console.log(renderData)
        return renderData
      }}
      onSelectionChange={props.onSelectionChange}
      isEnableSelect={true}
      isNotEditable={true}
      isNotAddable={true}
      isNotDeletable={true}
      column={WarehouseConfirmDialogTableColumnModel({rawMaterialId: props.rawMaterialId})}
    />
  )
}

export default WarehouseConfirmDialogTable
