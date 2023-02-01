import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import CityManagementColumnModel from './city-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const CityManagementPage = ():any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.City}
      title="City Management"
      column={CityManagementColumnModel.CityManagementColumn}
    />
  )
}

export default CityManagementPage
