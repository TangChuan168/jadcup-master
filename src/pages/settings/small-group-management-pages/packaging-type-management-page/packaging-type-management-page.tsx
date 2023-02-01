import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import PackagingTypeManagementColumnModel from './packaging-type-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const PackagingTypeManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.PackagingType}
      title="Packaging Type Management"
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, quantity: parseInt(dataDetail.quantity, 10)})}
      column={PackagingTypeManagementColumnModel.PackagingTypeManagementColumn}
    />
  )
}

export default PackagingTypeManagementPage
