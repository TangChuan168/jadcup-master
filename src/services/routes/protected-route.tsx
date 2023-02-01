import React from 'react'
import { Route, Redirect, useLocation } from 'react-router-dom'
import { authenticated, getCustomerUserId } from '../lib/utils/auth.utils'
import CommonHeader from '../../components/layout/common-header'
import CommonFooter from '../../components/layout/common-footer'
import { BackTop } from 'antd'
import SaleOrderManagementForCustomer from '../../pages/order/sales-order/sales-order-management-for-customer'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ProtectedRoute = ({component: Component, ...rest}) => {
  const location = useLocation()

  return (
    <Route
      {...rest }
      render={
        (props) => {
          if (getCustomerUserId()) {
            return (
              <div style={{margin: '1rem'}}>
                <SaleOrderManagementForCustomer />
              </div>
            )
          }
          if (rest.path === '/' && !authenticated()) {
            return (
              <Component {...props} />
            )
          }
          if (rest.path === '/' && authenticated()) {
            window.location.href = '/home'
          }
          const pages: any = localStorage.getItem('pages')
          const isAuthPage = (
            location.pathname === '/home' ||
            location.pathname === '/' ||
            location.pathname !== '/' && location.pathname !== '/home' && (pages && JSON.parse(pages).filter((row: any) => row.pageUrl === location.pathname)[0])
          )
          if (authenticated() && !!isAuthPage) {
            return (
              <div style={{display: 'flex', height: '100vh', flexDirection: 'column', width: '100%', minWidth: '1000px'}}>
                <CommonHeader />
                <div style={{flex: 1, margin: '1.5rem auto 0'}}>
                  <div style={{minWidth: '1000px', minHeight: '720px', width: '95vw'}}>
                    <BackTop visibilityHeight={200} style={{right: '1rem', bottom: '7rem'}} />
                    <Component {...props} />
                  </div>
                </div>
                <CommonFooter />
              </div>
            )
          } else {
            return <Redirect to={
              {
                pathname: '/',
                state: {
                  from: props.location
                }
              }} />
          }
        }
      }
    />
  )
}
