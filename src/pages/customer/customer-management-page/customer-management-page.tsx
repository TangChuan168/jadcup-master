import React, { useState ,useEffect} from 'react'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import { urlKey, urlType } from '../../../services/api/api-urls'
import CustomerManagementColumnModel from './customer-management-column-model'
import { ApiRequest } from '../../../services/api/api'
import { baseUrl } from '../../../services/api/base-url'
import QuotationManagementPage from '../quotation-management-page/quotation-management-page'
import CommonDialog from '../../../components/common/others/common-dialog'
import SalesOrderManagementPage from '../../order/sales-order/sales-order-management-page'
import ExtraAddressManagementPage from './extra-address-management-page/extra-address-management-page'
import ContactManagementPage from './contact-management-page/contact-management-page'
import {getRandomKey} from '../../../services/lib/utils/helpers'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import CustomerFilePage from './customer-file-page/customer-file-page'
import { ContactsOutlined } from '@ant-design/icons'

const CustomerManagementPage = (props: {salesId?: any, salesView?: boolean}): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<any>()
  let isCreate = false

  useEffect(() => {
    if (props.salesId) document.title = "Customer Management"; 
    else if (props.salesView) document.title = "Customers List";
    else document.title = "Customer Admin Management";
  }, [])

  const resetData = () => {
    setTriggerResetData(getRandomKey())
  }

  const attachmentManagementDialog = (customerId: any) => <CustomerFilePage customerId={customerId}  />

  const quotationManagementDialog = (customerId: any) => <QuotationManagementPage customerId={customerId} />

  const orderManagementDialog = (customerId: any) => <SalesOrderManagementPage customerId={customerId} />

  const extraAddrDialog = (customerId: any) => <ExtraAddressManagementPage customerId={customerId} isReadOnly={props.salesView} />

  const contactDialog = (customerId: any) => <ContactManagementPage customerId={customerId} isReadOnly={props.salesView} />

  const updateCustomerStatus = (rowData: any, statusId: any) => {
    ApiRequest({
      url: baseUrl + 'Customer/UpdateCustomerStatus?id=' + rowData.customerId + '&statusId=' + statusId,
      method: 'put'
    }).then(_ => {
      resetData()
    })
  }

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Attach',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(attachmentManagementDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Quote',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(quotationManagementDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Order',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(orderManagementDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Addr',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(extraAddrDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: <ContactsOutlined />,
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(contactDialog, rowData)
      }
    }
  ]

  const openDialog = (dialogFn: any, rowData: any) => {
    setDialogContent(dialogFn(rowData.customerId))
    setDialogTitle(rowData.company + ' -- ' + rowData.customerCode)
    setOpen(true)
  }

  return (
    <div>
      <CommonTablePage
        urlInfoKey={ urlKey.Customer }
        title={props.salesView ? 'Customer' : ((props.salesId ? '' : 'All ') + 'Customer Management')}
        column={ CustomerManagementColumnModel({updateCustomerStatus: updateCustomerStatus, isSalesCustomer: !!props.salesId, isSalesView: props.salesView},) }
        mappingUpdateData={(dataDetail: any, type: any) => {
          if (type === urlType.Update && props.salesView) {
            return
          }
          isCreate = type === urlType.Create
          if (props.salesId && isCreate) {
            dataDetail.employeeId = props.salesId
            dataDetail.paymentCycleId = 6
            dataDetail.statusId = 3
            dataDetail.leadRating = 3
          }
          if (!dataDetail.leadRating) {
            dataDetail.leadRating = 3
          }
          if (dataDetail.leadRating > 5) {
            SweetAlertService.errorMessage('Rating must be lower equal than 5.')
            return
          }
          return dataDetail
        }}
        mappingRenderData={(data: any) => {
          if (isCreate) {
            const newCustomer = data[data.length - 1]
            openDialog(extraAddrDialog, newCustomer)
            ApiRequest({url: 'OnlineUser/AddOnlineUser', method: 'post', data: {
              userName: newCustomer.customerNumber.toString(),
              password: '123456',
              customerId: newCustomer.customerId
            }})
          }
          let returnData = data.map((row: any) => ({
            ...row,
            createdAtDate: row.createdAt && (new Date(row.createdAt + '.000Z')).toDateString(),
          }))
          if (props.salesId) {
            returnData = returnData.filter((row: any) => row.employeeId === props.salesId)
          }
          return returnData
        }}
        triggerResetData={triggerResetData}
        isNotAddable={props.salesView}
        isNotDeletable={props.salesView}
        isNotEditable={props.salesView}
        actionButtons={props.salesView ? actionButtons.filter((row: any) =>{ return row.tooltip === 'Addr'}) : actionButtons}
      />
      <CommonDialog open={open} title={dialogTitle} onDialogClose={() => setOpen(false)} dialogContent={dialogContent} />
    </div>
  )
}

export default CustomerManagementPage
