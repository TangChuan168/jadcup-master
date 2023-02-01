import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CustomerGroup5ManagementColumnModel from './customer-group5-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CustomerGroup5ManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.CustomerGroup5}
      title="Customer Group 5 Management"
      column={CustomerGroup5ManagementColumnModel.CustomerGroup5ManagementColumn}
    />
  )
}

export default CustomerGroup5ManagementPage
