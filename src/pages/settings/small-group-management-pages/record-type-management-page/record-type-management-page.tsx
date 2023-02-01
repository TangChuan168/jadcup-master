import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import RecordTypeManagementColumnModel from './record-type-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

export const RecordTypeManagementPage = () => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.RecordType}
      title="Record Type Management"
      column={RecordTypeManagementColumnModel.RecordTypeManagementColumn}
    />
  )
}

export default RecordTypeManagementPage
