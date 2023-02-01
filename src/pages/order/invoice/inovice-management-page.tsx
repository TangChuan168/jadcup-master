import React, { useState ,useEffect} from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import SalesOrderManagementColumnModel from '../sales-order/sales-order-management-column-model'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../../services/api/api'
import CommonDialog from '../../../components/common/others/common-dialog'
import SalesOrderProductManagementDialog from '../../order/sales-order/sales-order-product-management-dialog/sales-order-product-management-dialog'
import Iselect from "../../../components/common/i-select";
import moment, { months } from 'moment'
import { Button, DatePicker } from 'antd'

const { RangePicker } = DatePicker

const baseGetUrl='Invoice/GetAllInvoice'
const InvoiceManagementPage = (props: { customerId: any }) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  // const [dialogTitle, setDialogTitle] = useState<string>()
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [selectOptions, setSelectOptions] = useState<any>([
    {value:1,label:'One months'},
    {value:2,label:'Three months'},
    {value:3,label:'One Year'}])
  const [selectedOption, setSelectedOption] = useState<any>();
  const [fileredInvoices, setFileredInvoices] = useState<any>();  
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<any>(null)

  const [url, setUrl] = useState<string>(baseGetUrl+"?start="
        + moment().add(-3,'months').format('YYYY/MM/DD')
        +'&end='+moment().add(1,'days').format('YYYY/MM/DD'))

  const isNewOrder = false;
  const dialogTitle = 'Order'

  useEffect(() => {
    if (props.customerId) return
    else document.title = "Invoice Management";
  }, [])

  const onDialogClose=() => {
    setOpen(false)
  }
  // const sourceSelectHandle =(value:any) =>{
  //   setUrlforChange(value);
  //   setTriggerResetData(!triggerResetData)
  // }
  // const setUrlforChange = (value:any) => {
  //   let url = baseGetUrl;
  //   if (value){
  //     let startDate,endDate;
  //     endDate = moment().add(1,'days').format('YYYY/MM/DD');
  //     if (value==1){
  //       startDate=moment().add(-1,'months').format('YYYY/MM/DD');
  //     }
  //     else if (value==2){
  //       startDate=moment().add(-3,'months').format('YYYY/MM/DD');
  //     }
  //     else if (value==3){
  //       startDate=moment().add(-1,'years').format('YYYY/MM/DD');
  //     }
  //     url = baseGetUrl+'?start=' + startDate+'&end='+endDate
  //   }    
  //   setUrl(url);
  // }
  const onChangeDateRange = (value: any) => {
    setStartDate(value?value[0]:null)
    setEndDate(value?value[1]:null)
    let url = baseGetUrl
    if (value && value.length === 2) {
      url = baseGetUrl + '?start=' + value[0].format('YYYY/MM/DD') + '&end=' + value[1].format('YYYY/MM/DD')
    }
    setUrl(url)
    setTriggerResetData(!triggerResetData)
  }
  const onClearDateRange = () => {
    setStartDate(null)
    setEndDate(null)
    setUrl(baseGetUrl+"?start="
      + moment().add(-3,'months').format('YYYY/MM/DD')
      +'&end='+moment().add(1,'days').format('YYYY/MM/DD'))
    setTriggerResetData(!triggerResetData)
  }
  const salesOrderProductManagementDialog = <SalesOrderProductManagementDialog orderData={orderData} isNewOrder={isNewOrder} onDialogClose={onDialogClose} customerId={props.customerId}  />

  // get brand id from pathname and split into array
  const getFinanceBrand = () => {
    const brandEndpoint = window.location.pathname.slice(8).split('&')
    const brandIdArray = brandEndpoint[0].length !== 0 ? brandEndpoint.map((id: any) => parseInt(id)) : null
    return brandIdArray
  }
  const onFilterChange = (tableRef: any) => {
    //setFooter(tableRef.current.dataManager.searchedData)
    console.log(tableRef.current.dataManager.searchedData)
    // setFileredInvoices(tableRef.current.dataManager.searchedData)
    // (debounceSetFileredInvoices(1000))(tableRef.current.dataManager.searchedData);
    let invs =  tableRef.current.dataManager.searchedData.map((e:any)=>{return {invoiceId:e.invoiceId}})
    sessionStorage.setItem("TmpFilter",JSON.stringify(
      invs
      ));
  }
  // const debounceSetFileredInvoices = (wait:any) => {
  //   let timeout:any;
  
  //   return function executedFunction(searchedData:any) {
  //     const later = () => {
  //       clearTimeout(timeout);
  //       setFileredInvoices(searchedData);
  //     };
  
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);
  //   };
  // };
  const onMarkAllPaid  = async () =>{
    const strfileredInvoices:any = sessionStorage.getItem("TmpFilter");
    const localfileredInvoices = strfileredInvoices?JSON.parse(strfileredInvoices):null;    

    if (!localfileredInvoices || localfileredInvoices.length>99 ||localfileredInvoices.length==0) {
      SweetAlertService.errorMessage("Too more records or no filter");
      return
    }

    const result = await SweetAlertService.confirmMessage("This will mark "+localfileredInvoices?.length+" invoices as paid!")
    if (!result) return;

    const invoices:any=[];
    localfileredInvoices.map((e:any)=>{
      invoices.push(e.invoiceId);
    })
    ApiRequest({
      url: 'Invoice/InvoicesMarkPaid' ,
      method: 'put',
      data: invoices,
    }).then(_ => {
      SweetAlertService.successMessage()
      setTriggerResetData(!triggerResetData)
    })
  }
  const getRenderData = (data: any) => {
    const renderData: any = []
    sessionStorage.setItem("TmpFilter","");
    data.map((row: any) => {
      renderData.push({
        ...row,
        cityId: row.deliveryCityId,
        city: row.deliveryCity,
        items: getItemsStr(row),
        orderProduct: row.invoiceItem.filter((item: any) => item.productId).map((item: any) => ({ ...item, price: item.totalPrice })),
        orderOption: row.invoiceItem.filter((item: any) => item.optionId).map((item: any) => ({ ...item, price: item.totalPrice })),
        orderDate1: row.invoiceDate,
        requiredDate1: row.dueDate,
        orderDate: row.invoiceDate && (new Date(row.invoiceDate + '.000Z')).toDateString(),
        requiredDate: row.dueDate && (new Date(row.dueDate + '.000Z')).toDateString(),
        PoNo: row.order.custOrderNo,
        accountNote: row.order.accountNote,
        packingSlipNo: row.order.dispatching.map((e: any, i: number) => { 
          return <div key={i} style={e.status==0?{textDecoration:"line-through"}:{}}>{e.packingSlipNo}</div> 
        })
      })
    })
    // use brand id array to filter invoices to show
    const brandIdArray = getFinanceBrand()
    return brandIdArray !== null ?
      renderData.filter((item: any) => brandIdArray.includes(item.customer.brandId)) : renderData
  }

  const getItemsStr = (row: any) => {
    let str: any = ''
    const a = row.invoiceItem?.map((item: any) => str += (item.product?.productName + (item.product?.productName)))
    const b = row.invoiceItem?.map((item: any) => str += (item.option?.optionName + (item.option?.optionName)))
    return str
  }

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Mark',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (!rowData.paid) {
          const result = await SweetAlertService.inputConfirm({ type: 'text', title: 'Input Invoice Note', placeholder: 'Invoice Number', defaultValue: rowData.invoiceNote })
          if (result) {
            ApiRequest({
              url: 'Invoice/InvoiceMarkPaid?invoiceId=' + rowData.invoiceId + '&paid=1' + '&invoiceNote=' + result,
              method: 'put'
            }).then(_ => {
              SweetAlertService.successMessage()
              setTriggerResetData(!triggerResetData)
            })
          }
        } else {
          const result = await SweetAlertService.confirmMessage()
          if (result) {
            ApiRequest({
              url: 'Invoice/InvoiceMarkPaid?invoiceId=' + rowData.invoiceId + '&paid=0' + '&invoiceNote=' + rowData.invoiceNote,
              method: 'put'
            }).then(_ => {
              SweetAlertService.successMessage()
              setTriggerResetData(!triggerResetData)
            })

            // SweetAlertService.successMessage('Already paid.')
          }
        }
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Note',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (!rowData.paid) {
          const result = await SweetAlertService.inputConfirm({ type: 'text', title: 'Input Invoice Note', placeholder: 'Invoice Number', defaultValue: '' })
          if (result) {
            ApiRequest({
              url: 'Invoice/InvoiceNote?invoiceId=' + rowData.invoiceId + '&invoiceNote=' + result,
              method: 'put'
            }).then(_ => {
              SweetAlertService.successMessage()
              setTriggerResetData(!triggerResetData)
            })
          }
        } else {
          SweetAlertService.successMessage('Success.')
        }
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Order',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        ApiRequest({
          url: 'SalesOrder/GetOrderById?id=' + rowData.orderId,
          method: 'get',          
        }).then(res => {
          setOrderData(res.data.data)
          setOpen(true)          
        })        
      }
    }
    
  ]

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Invoice,
    getAllUrl:url,
    title: 'Invoice',
    column: [...SalesOrderManagementColumnModel("invoice")]
      .filter((row: any) => !['Delivery Method', 'Stage'].includes(row.title))
      .filter((row: any) => row.title!="Profit")
      .filter((row: any) => row.title!="Sales Person")
      .map((row: any) => (row.title === 'Paid' ? { ...row, defaultFilter: ['0'] } : row)),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.draft = parseInt(dataDetail.draft, 10)
      return dataDetail
    },
    onFilterChange: onFilterChange,
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    isNotAddable: true,
    isNotEditable: true,
    isNotDeletable: true
  }

  return (
    <div style={{position:'relative'}}>
      {!props.customerId &&<div style={{position:'absolute',marginTop:'20px',marginLeft:'300px',zIndex:10, display: 'flex'}}>
        {/* <Iselect data={selectOptions} onChange={sourceSelectHandle} width={300}/> */}
        <RangePicker value={[startDate, endDate]} onChange={onChangeDateRange}/>
        <div ><Button type="primary" onClick={onClearDateRange} 
          style={{marginLeft:'20px'}}>
          Clear Date</Button>
        </div>
      </div>}
      <div ><Button type="primary" onClick={() => onMarkAllPaid()} 
        style={{position:'absolute',marginTop:'20px',marginLeft:'750px',zIndex:10}}>
          Mark as Paid for all</Button>
      </div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={salesOrderProductManagementDialog} />
    </div>
  )
}

export default InvoiceManagementPage
