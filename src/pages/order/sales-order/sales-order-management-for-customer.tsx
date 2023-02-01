import React from 'react'
import SalesOrderManagementPage from './sales-order-management-page'
import { Button } from 'antd'
import { getCustomerUserId, logoutCustomer } from '../../../services/lib/utils/auth.utils'
import { useHistory } from 'react-router-dom'

const SaleOrderManagementForCustomer = () => {
  const history = useHistory()

  return (
    <div>
      <div style={{textAlign: 'right'}}>
        <Button
          type={'primary'}
          style={{marginBottom: '1rem'}}
          onClick={() => logoutCustomer(() => history.push('/'))}
        >Logout</Button>
      </div>
      <SalesOrderManagementPage customerId={parseInt(getCustomerUserId(), 10)} isOnlineCustomer={true} />
    </div>
  )
}

export default SaleOrderManagementForCustomer
