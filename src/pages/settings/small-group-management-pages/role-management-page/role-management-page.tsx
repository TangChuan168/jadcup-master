import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import RoleManagementColumnModel from './role-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const RoleManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.Role}
      title="Role Management"
      column={RoleManagementColumnModel.RoleManagementColumn}
    />
  )
}

export default RoleManagementPage
