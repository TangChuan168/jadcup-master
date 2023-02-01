import React, { useState ,useEffect} from 'react'

import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import QuotationManagementColumnModel from './quotation-management-column-model'
import QuotationManagementEditDialog from './quotation-management-edit-dialog/quotation-management-edit-dialog'
import CommonDialog from '../../../components/common/others/common-dialog'
// import EmailModal from './quotation-email-dialog'
import quotationPdfGenerate from '../../static/pdf/quotation/quotation-pdf-generate'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import QuotationManagementApproveDialog from './quotation-management-approve-dialog/quotation-management-approve-dialog'
import {getCookie} from 'react-use-cookie'
import EmailModal1 from '../../../components/common/email-dialog'
import EmailsModals from '../../../components/common/multi-emails-dialog'
import { ApiRequest } from '../../../services/api/api'
import { getRandomKey } from '../../../services/lib/utils/helpers'
import { MailOutlined } from '@ant-design/icons'
import ProductManagementPage from '../../product/product-management-page/product-management-page'
import moment from 'moment'

export interface Email {
  employeeEmail: string
  customerEmail: string
  quotationNo:string
  quotationId:string
  employeeFirstName: string
  roleId:number
  employeeNumber:string
  customerCode:string
}

const QuotationManagementPage = (props: {customerId?: any, isOnlyDraft?: boolean, isBaseDraft?: boolean,isPriceContract?:boolean}) => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false) // Quotation Dialog
  const [open2, setOpen2] = useState(false) // Quotation Dialog
  const [productListOpen, setProductListOpen] = useState(false)
  const [quotationData, setQuotationData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewQuotation, setIsNewQuotation] = useState(false)
  // const [quotationCustomerId, setQuotationCustomerId] = useState<any>(props.customerId)
  const [selectedRows, setSelectedRows] = useState<any>()


  useEffect(() => {
    if (props.customerId) return
    else if (props.isOnlyDraft) document.title = "Draft Quatation Management";
    else if (props.isBaseDraft) document.title = "Base Draft Quatations Management";
    else document.title = "Quatation Management";
  }, [])

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const onDialogClose2 = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen2(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const onProductListOpen = () => {
    setProductListOpen(true)
  }

  const quotationManagementEditDialog = <QuotationManagementEditDialog customerId={props.customerId} isNewQuotation={isNewQuotation} onDialogClose={onDialogClose} quotationData={quotationData} isPriceContract={props.isPriceContract || quotationData?.isFinal}/>

  const quotationManagementApproveDialog = <QuotationManagementApproveDialog customerId={props.customerId} onDialogClose={onDialogClose2} quotationData={quotationData} onProductListOpen={onProductListOpen} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      // isFreeAction: false,
      position: 'row',
      onClick: (event: any, rowData: any) => {
        console.log(rowData)
        setOpen(true)
        setQuotationData(rowData)
        setDialogTitle( props.isPriceContract?'Contract Price':'Quotation Edit')
        if (rowData.isFinal==1)
          setDialogTitle('Contract Price')
        setIsNewQuotation(false)
      }
    },
    !props.isBaseDraft && {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Confirm',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (!rowData.inclLowerPrice) {
          SweetAlertService.errorMessage('Already Confirmed.')
          return
        }
        const result = await SweetAlertService.confirmMessage('Sure to approve current lower price?')
        if (result) {
          ApiRequest({
            url: 'Quotation/UpdateQuotation',
            method: 'put',
            data: {
              ...rowData,
              effDate: rowData.effDate1,
              expDate: rowData.expDate1,
              quotationItem: rowData.quotationItem.map((row: any) => ({...row, isLowerPrice: 0}))
            }
          }).then(_ => {
            setTriggerResetData(getRandomKey())
          })
        }
      }
    },
    {
      icon: 'danger', //Button attr of Ant design (danger, ghost)
      tooltip: 'Approve',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (props.isBaseDraft) {
          ApiRequest({url: 'Quotation/ApproveDrafts', method: 'put', data: selectedRows.map((item: any) => item.quotationId)})
          .then((res: any) => {
            console.log(res)
            setTriggerResetData(getRandomKey())
          })
        } else {
          console.log(rowData)
          if (!rowData.draft) {
            SweetAlertService.errorMessage('Already approved.')
            return
          }
          if (rowData.inclLowerPrice) {
            SweetAlertService.errorMessage('Lower price existed.')
            return
          }
          
          setOpen2(true)
          setQuotationData(rowData)
          setIsNewQuotation(false)
        }
      }
    },
    {
      icon: '',
      tooltip: 'New a Quotation',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setQuotationData({})
        setDialogTitle('New Quotation')
        setIsNewQuotation(true)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: <MailOutlined />,
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (props.isBaseDraft ){
          let emails:any = [];
          selectedRows.map(async (item: any) => {
            if (item.contactId)
            {
              await ApiRequest({
                url: 'Contact/GetContact?id='+item.contactId,
                method: 'get',
              }).then(res => {
                //email = 
                emails.push(res.data?.data?.email)
              })
            }
            else
            {
              emails.push( item.customer.email )     
    //         emails.push(email)
            }       
          })
          EmailsModal(emails);
          return 
        }
        // console.log(rowData,'rowData in quotation')
        if (rowData.inclLowerPrice) {
          SweetAlertService.errorMessage('Lower price existed.')
          return
        }
        if (rowData.quotationItem.filter((row: any) => row.isLowerPrice).length) {
          SweetAlertService.errorMessage('Some quotation prices are lower than the original price.')
          return
        }
        let email:string='';
        if (rowData.contactId)
        {
          await ApiRequest({
            url: 'Contact/GetContact?id='+rowData.contactId,
            method: 'get',
          }).then(res => {
            email = res.data?.data?.email
          })
        }
        else
        {
          email = rowData.customer.email
        }

        
        const personInEmail:Email = {
          employeeEmail: getCookie('email'),
          customerEmail: email,
          quotationNo: rowData.quotationNo,
          quotationId: rowData.quotationId,
          employeeFirstName:rowData.employee.firstName,
          roleId:rowData.employee.roleId,
          employeeNumber:rowData.employee.mobile,
          customerCode:rowData.customer.customerCode
        }
        // console.log(personInEmail)
        setRowData(personInEmail)

        setIsEmailModalVisible(true)

        const obj = {
          ...rowData,
          customerName: rowData.customer.company,
          email: rowData.customer.email,
          // address: rowData.customer.address2 + ' ' + rowData.customer.address1,
          address: rowData.customer.address2,
          phone: rowData.customer.phone,
          tradingName: rowData.customer?.customerCode,
          validDate: rowData.expDate,
          quoteDate: rowData.effDate,
          quotationNo: rowData.quotationNo,
          tableContent: getTableContent(rowData.quotationItem),
          options: rowData.quotationOption.map((res:any) => {
            if (res.customizeOptionNotes === null) {
              return res.quotationOptionItem.quotationOptionItemName
            }

            return res.customizeOptionNotes
          })
        }
        quotationPdfGenerate(obj, 'getBlob', getBlob)
      }
    },
    !props.isBaseDraft ? {} : {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Delete',
      // isFreeAction: false,
      position: 'toolbarOnSelect',
      onClick: (event: any, rowData: any) => {
        ApiRequest({url: 'Quotation/DeleteDrafts', method: 'delete', data: selectedRows.map((item: any) => item.quotationId)})
        .then((res: any) => {
          setTriggerResetData(getRandomKey())
          console.log(res)
        })
      }
    },
  ]
  const EmailsModal = (emails: any) => {
    setEmailList(emails)
    setIsEmailsModalVisible(true)
  }
  const getTableContent = (data: any) => {
    const resultArrObj: any = {}
    data.map((res:any) => {
      const productTypeName = res.baseProduct?.productType?.productTypeName || res.product?.baseProduct?.productType?.productTypeName
      if (resultArrObj[productTypeName]) {
        resultArrObj[productTypeName].push(tableNewData(res))
      } else {
        resultArrObj[productTypeName] = []
        resultArrObj[productTypeName].push(tableNewData(res))
      }
    })
    return resultArrObj
  }

  const tableNewData = (res: any) => {
    if (res.productId === null) {
      res.baseProduct.price = res.price
      res.baseProduct.notes = res.notes
      res.baseProduct.notes2 = res.notes2
      res.baseProduct.description = null
      res.baseProduct.itemDesc = res.itemDesc
      return res.baseProduct
    }
    res.product.price = res.price
    res.product.notes = res.notes
    res.product.notes2 = res.notes2
    return res.product
  }

  const getBlob = (blob?:any) => {
    console.log(blob, 'blob111')
    setEmailBlob(blob)
  }

  const onSelectionChange = (rows: any) => {
    console.log(rows)
    setSelectedRows(rows)
  }

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if ((props.customerId && (props.customerId === row.customerId)) || !props.customerId) {
        renderData.push({
          ...row,
          quotationNo:props.isPriceContract?null:row.quotationNo,
          inclLowerPrice: row.quotationItem?.filter((item: any) => item.isLowerPrice).length ? 1 : 0,
          custConfirmed: row.custConfirmed ? 1 : 0,
          effDate1: row.effDate,
          expDate1: row.expDate,
          effDate: row.effDate && moment.utc(row.effDate).local().format('DD/MM/YYYY'),
          custConfimedAt1: row.custConfimedAt && moment.utc(row.custConfimedAt).local().format('DD/MM/YYYY'),
          expDate: row.expDate && (new Date(row.expDate + '.000Z')).toDateString(),
        })
      }
    })
    return props.isOnlyDraft ? renderData.filter((row: any) => row.draft === 1) : (props.isBaseDraft ? renderData.filter((row: any) => row.draft === 2) : renderData)
  }
  const getUrl = () => {
    if (props.customerId)
      return '/Quotation/GetQuotationByCustomerId?id=' + props.customerId;
    if (props.isBaseDraft)
      return '/Quotation/GetAllQuotation?draft=2';
    if (props.isPriceContract)
      return '/Quotation/GetAllQuotation?isFinal=1';
    else
      return '/Quotation/GetAllQuotation';
  }
  const getTitle = () => {
    if (props.isOnlyDraft)
      return 'Draft Quotation'
    if (props.isBaseDraft)
      return 'Base Draft Quotation'
    if (props.isPriceContract)
      return 'Contract Price'
    else
      return 'Quotation';
  }
  const getColumn = () => {
    if (props.isOnlyDraft) 
      return  QuotationManagementColumnModel().filter((row: any) => row.title !== 'Draft')
    else if (props.isPriceContract)
       return  QuotationManagementColumnModel().filter((row: any) => row.title !== 'Draft' 
       && row.title !== 'Valid Date' && row.title !== 'Quote Date')
    else
       return QuotationManagementColumnModel()
  }
  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Quotation,
    getAllUrl: getUrl(),
    title: getTitle(),
    column: getColumn(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.draft = parseInt(dataDetail.draft, 10)
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: props.isPriceContract? actionButtons.filter((row: any) => row.tooltip && row.tooltip == 'Edit'):actionButtons.filter((row: any) => row.tooltip),
    isNotAddable: true,
    isNotEditable: true,
    isShowSpinnerOnInit: isShowSpinner,
    isEnableSelect: props.isBaseDraft ? true : false,
    onSelectionChange: props.isBaseDraft ? onSelectionChange : null
  }

  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [isEmailsModalVisible, setIsEmailsModalVisible] = useState(false)
  const [rowData, setRowData] = useState<Email>()
  const [emailBlob, setEmailBlob] = useState()
  const [emailList, setEmailList] = useState("")
  

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={quotationManagementEditDialog} />
      <CommonDialog title={'Quotation Approve'} open={open2} onDialogClose={onDialogClose2} dialogContent={quotationManagementApproveDialog} />
      <EmailModal1 visible={isEmailModalVisible} onCancel={() => setIsEmailModalVisible(false)} rowData={rowData} blob={emailBlob} quotationRowData={rowData}/>
      <EmailsModals visible={isEmailsModalVisible} onCancel={() => setIsEmailsModalVisible(false)} EmailList={emailList} />
      {/* const EmailsModal = (props:{visible:boolean, onCancel:()=>void, rowData:any, quotationRowData?:Email}) => { */}
      <CommonDialog
		    title={quotationData?.customer?.customerCode + ' - Product Edit'}
		    open={productListOpen}
		    dialogContent={<ProductManagementPage customerId={quotationData?.customerId} />}
	      onDialogClose={() => setProductListOpen(false)}
	    />
    </div>
  )
}

export default QuotationManagementPage
