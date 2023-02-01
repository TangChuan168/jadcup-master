import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import BrandManagementColumnModel from './brand-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

export const BrandManagementPage = () => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.Brand}
      title="Brand Management"
      column={BrandManagementColumnModel.BrandManagementColumn}
    />
  )
}

export default BrandManagementPage
