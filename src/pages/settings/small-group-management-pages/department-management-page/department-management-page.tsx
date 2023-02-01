import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import DepartmentManagementColumnModel from './department-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const DepartmentManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.Department}
      title="Department Management"
      column={DepartmentManagementColumnModel.DepartmentManagementColumn}
    />
  )
}

export default DepartmentManagementPage
