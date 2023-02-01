import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import ContractTypeManagementColumnModel from './contract-type-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

export const ContractTypeManagementPage = () => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ContractType}
      title="Contract Type Management"
      column={ContractTypeManagementColumnModel.ContractTypeManagementColumn}
    />
  )
}

export default ContractTypeManagementPage
