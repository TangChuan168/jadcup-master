import React from 'react'
import SalesOrderManagementPage from './sales-order-management-page'
import { getUserId } from '../../../services/lib/utils/auth.utils'

const SaleOrderManagementForSales = () => {
  return <SalesOrderManagementPage salesId={getUserId()} />
}

export default SaleOrderManagementForSales
