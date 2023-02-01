import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import PaymentCycleManagementColumnModel from './payment-cycle-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const PaymentCycleManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.PaymentCycle}
      title="Payment Term Management"
      column={PaymentCycleManagementColumnModel.PaymentCycleManagementColumn}
    />
  )
}

export default PaymentCycleManagementPage
