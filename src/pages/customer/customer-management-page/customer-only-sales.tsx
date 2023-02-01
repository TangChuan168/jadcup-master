import React from 'react'
import CustomerManagementPage from './customer-management-page'
import { getUserId } from '../../../services/lib/utils/auth.utils'

const CustomerOnlySales = () => {
	return <CustomerManagementPage salesId={getUserId()} />
}

export default CustomerOnlySales
