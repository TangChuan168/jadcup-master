import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CustomerGroup3ManagementColumnModel from './customer-group3-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CustomerGroup3ManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.CustomerGroup3}
      title="Customer Group 3 Management"
      column={CustomerGroup3ManagementColumnModel.CustomerGroup3ManagementColumn}
    />
  )
}

export default CustomerGroup3ManagementPage
