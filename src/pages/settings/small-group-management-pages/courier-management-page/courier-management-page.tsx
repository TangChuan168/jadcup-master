import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CourierManagementColumnModel from './courier-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CourierManagementPage = ():any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.Courier}
      title="Courier Management"
      column={CourierManagementColumnModel.CourierManagementColumn}
    />
  )
}

export default CourierManagementPage
