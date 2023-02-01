import React from 'react'

import SalesOrderManagementPage from '../sales-order/sales-order-management-page'

const DraftSalesOrderManagementPage = () => {

  return (
    <div>
      <SalesOrderManagementPage isDraft={true} />
    </div>
  )
}

export default DraftSalesOrderManagementPage
