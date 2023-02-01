import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CustomerGroup2ManagementColumnModel from './customer-group2-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CustomerGroup2ManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.CustomerGroup2}
      title="Customer Group 2 Management"
      column={CustomerGroup2ManagementColumnModel.CustomerGroup2ManagementColumn}
    />
  )
}

export default CustomerGroup2ManagementPage
