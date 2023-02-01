import React from 'react'

import SalesOrderManagementPage from '../sales-order/sales-order-management-page'

const OnlineSalesOrderManagementPage = () => {

  return (
    <div>
      <SalesOrderManagementPage isOnlineSalesOrder={true} />
    </div>
  )
}

export default OnlineSalesOrderManagementPage
