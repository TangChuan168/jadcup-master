import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import PalletStackingManagementColumnModel from './pallet-stacking-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const PalletStackingManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.PalletStacking}
      title="Pallet Stacking Management"
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, quantity: parseInt(dataDetail.quantity, 10)})}
      mappingRenderData={(data: any) => data.map((row: any) => ({...row, layoutImage2: row.layoutImage}))}
      column={PalletStackingManagementColumnModel.PalletStackingManagementColumn}
    />
  )
}

export default PalletStackingManagementPage
