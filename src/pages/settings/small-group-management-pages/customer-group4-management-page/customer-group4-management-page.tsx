import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CustomerGroup4ManagementColumnModel from './customer-group4-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CustomerGroup4ManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.CustomerGroup4}
      title="Customer Group 4 Management"
      column={CustomerGroup4ManagementColumnModel.CustomerGroup4ManagementColumn}
    />
  )
}

export default CustomerGroup4ManagementPage
