import React, { useState ,useEffect} from 'react'
import moment from 'moment'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import CommonDialog from '../../../../components/common/others/common-dialog'
import { urlKey } from '../../../../services/api/api-urls'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { PurchaseOrderColumnModel } from './purchase-order-column-model'
import PurchaseOrderDialog from './purchase-order-dialog/purchase-order-dialog'
import { ApiRequest } from '../../../../services/api/api'
import EmailModal1 from '../../../../components/common/email-dialog'
import {getCookie} from 'react-use-cookie'
import { toLocalDate } from '../../../../services/lib/utils/helpers'
// import quotationPdfGenerate from '../../static/pdf/PurchaseOrder/PurchaseOrder-pdf'
import PurchaseOrderPdf from '../../../static/pdf/purchaseOrder/purchaseOrder-pdf'

interface Email {
  employeeEmail: string
  customerEmail: string
}

export const PurchaseOrderPage = (props: {isApprovePage?: boolean}) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [pdfData, setPdfData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewOrder, setIsNewOrder] = useState(false)

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    setTriggerResetData(!triggerResetData)
  }
  const getBlob = (blob?:any) => {
    console.log(blob, 'blob111')
    setEmailBlob(blob)
  }
  useEffect(() => {
    if (props.isApprovePage ) document.title = "PO Approve";
    else  document.title = "Purchase Order";
  }, [])

  const purchaseOrderDialog = <PurchaseOrderDialog isNewOrder={isNewOrder} onDialogClose={onDialogClose} orderData={orderData} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Order Edit')
        setIsNewOrder(false)
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Email',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (rowData.poStatusId !== 2) {
          SweetAlertService.errorMessage('This order status should be approved.')
          return
        }
        console.log(rowData)

        const personInEmail = {
          employeeEmail: getCookie('email'),
          customerEmail: rowData.suplier.email
        }
        // console.log(personInEmail)
        setRowData(personInEmail)
        const obj = {
          employeeEmail: getCookie('email'),
          // address: rowData.customer.address2 + ' ' + rowData.customer.address1,
          ...rowData
        }

        // PurchaseOrderPdf(obj)
        setPdfData(obj)
        PurchaseOrderPdf(obj, 'getBlob', getBlob)
        setIsEmailModalVisible(true)        
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add new order',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData({})
        setDialogTitle('New Purchase Order')
        setIsNewOrder(true)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Approve',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (rowData.poStatusId !== 1) {
          SweetAlertService.errorMessage('This order\'s status is not awaiting approved.')
          return
        }
        const result = await SweetAlertService.confirmMessage()
        if (result) {
          ApiRequest({
            url: 'PurchaseOrder/ApprovePurchaseOrder?id=' + rowData.poId,
            method: 'put'
          }).then(_ => {
            setTriggerResetData(!triggerResetData)
          })
        }
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Draft',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (rowData.poStatusId !== 2) {
          SweetAlertService.errorMessage('This order\'s status is not approved.')
          return
        }
        const result = await SweetAlertService.confirmMessage()
        if (result) {
          ApiRequest({
            url: 'PurchaseOrder/DraftPurchaseOrder?id=' + rowData.poId,
            method: 'put'
          }).then(_ => {
            setTriggerResetData(!triggerResetData)
          })
        }
      }
    },    
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Complete',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (rowData.poStatusId !== 10) {
          SweetAlertService.errorMessage('This order has not been unloaded.')
          return
        }
        const result = await SweetAlertService.confirmMessage()
        if (result) {
          ApiRequest({
            url: 'PurchaseOrder/CompletePurchaseOrder?id=' + rowData.poId,
            method: 'put'
          }).then(_ => {
            setTriggerResetData(!triggerResetData)
          })
        }
      }
    },
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        supplierName: row.suplier?.suplierName,
        deliveryDate1: moment.utc(row.deliveryDate).local().format('DD/MM/YYYY'),
        // toLocalDate(row.deliveryDate),
        createdEmployeeName: (row.createdEmployee?.firstName || '') + ' ' + (row.createdEmployee?.lastName || '')
      })
    })
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.PurchaseOrder,
    title: props.isApprovePage ? 'Purchase Order Approve' : 'Purchase Order',
    column: PurchaseOrderColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    triggerResetData: triggerResetData,
    actionButtons: props.isApprovePage ? actionButtons : actionButtons.filter((row: any) => row.tooltip !== 'Approve' && row.tooltip !== 'Complete' && row.tooltip !== 'Draft'),
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [rowData, setRowData] = useState<Email>()
  const [emailBlob, setEmailBlob] = useState()

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={purchaseOrderDialog} />
      <EmailModal1 visible={isEmailModalVisible} onCancel={() => setIsEmailModalVisible(false)} rowData={rowData} blob={emailBlob} pdfData={pdfData} />
    </div>
  )
}
