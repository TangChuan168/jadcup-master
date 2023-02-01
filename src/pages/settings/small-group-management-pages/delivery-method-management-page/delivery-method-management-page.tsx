import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import DeliveryMethodManagementColumnModel from './delivery-method-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const DeliveryMethodManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.DeliveryMethod}
      title="Delivery Method Management"
      column={DeliveryMethodManagementColumnModel.DeliveryMethodManagementColumn}
    />
  )
}

export default DeliveryMethodManagementPage
