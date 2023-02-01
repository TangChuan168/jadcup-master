import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CustomerSourceManagementColumnModel from './customer-source-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CustomerSourceManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.CustomerSource}
      title="Customer Source Management"
      column={CustomerSourceManagementColumnModel.CustomerSourceManagementColumn}
    />
  )
}

export default CustomerSourceManagementPage
