import React, { useState ,useEffect} from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import SalesOrderManagementColumnModel from './sales-order-management-column-model'
import SalesOrderProductManagementDialog from './sales-order-product-management-dialog/sales-order-product-management-dialog'
import CommonDialog from '../../../components/common/others/common-dialog'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { getRandomKey, nsStr } from '../../../services/lib/utils/helpers'
import { ApiRequest } from '../../../services/api/api'
import Iselect from "../../../components/common/i-select";
import moment, { months } from 'moment'
import Swal from 'sweetalert2'
import { getUserId } from '../../../services/lib/utils/auth.utils'
import { Button, DatePicker } from 'antd'
import {getCookie} from 'react-use-cookie'
const { RangePicker } = DatePicker

const baseGetUrl='SalesOrder/GetAllOrder'
const SalesOrderManagementPage = (props: {customerId?: any, stockMonitorProductId?: any, isOnlineSalesOrder?: boolean, 
        isOnlineCustomer?: boolean, salesId?:number, isDraft?: boolean}) => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isNewOrder, setIsNewOrder] = useState(false)
  const [selectOptions, setSelectOptions] = useState<any>([
    {value:1,label:'One months'},
    {value:2,label:'Three months'},
    {value:3,label:'One Year'}])
  const [selectedOption, setSelectedOption] = useState<any>();
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<any>(null)

  const [url, setUrl] = useState<string>(baseGetUrl+"?start="
        + moment().add(-3,'months').format('YYYY/MM/DD')
        +'&end='+moment().add(1,'days').format('YYYY/MM/DD'))

  useEffect(() => {
    if (props.customerId || props.stockMonitorProductId) return
    else if (props.isOnlineSalesOrder ) document.title = "Prepay Orders";
    else if (props.salesId ) document.title = "Orders List";
    else if (props.isOnlineCustomer ) document.title = "My Orders";
    else  document.title = "Orders Admin";
  }, [])
      

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const salesOrderProductManagementDialog = <SalesOrderProductManagementDialog isNewOrder={isNewOrder} onDialogClose={onDialogClose} orderData={orderData} customerId={props.customerId} isOnlineCustomer={props.isOnlineCustomer} isDraft={props.isDraft}/>

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Edit',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (props.isOnlineCustomer && rowData.orderStatusId !== 2) {
          return
        }
        setOpen(true)
        setOrderData(rowData)
        setDialogTitle('Order Edit')
        setIsNewOrder(false)
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add new order',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setOrderData({})
        setDialogTitle('New Sales Order')
        setIsNewOrder(true)
      }
    }
  ]

  const getActionButton = () => {
    if (props.isOnlineSalesOrder) {
      actionButtons.pop()
      actionButtons.push({
        icon: '', //Button attr of Ant design (danger, ghost)
        tooltip: 'Approve',
        isFreeAction: false,
        onClick: async (event: any, rowData: any) => {
          // const result = await SweetAlertService.inputConfirm({ type: 'text', title: 'Input Invoice Note', placeholder: 'Invoice Number', defaultValue: '' })
          const result = await Swal.fire({
            title: "Confirm Require Date&Invoice Number",
            // type: "warning",
            html: '<div><input type="date" id="reqdate" class="form-control" autofocus></div>'+
                  '<div style ="margin-top:10px" ><input type="text" id="invoiceNum" class="form-control"></div>',
            onOpen: () => {
                ( document.getElementById("reqdate")  as HTMLInputElement).valueAsDate = moment().add(14,'days').toDate() ;
              },
            preConfirm: () => {
                return {
                    req:( document.getElementById("reqdate")  as HTMLInputElement).valueAsDate,
                    inv:( document.getElementById("invoiceNum")  as HTMLInputElement).value 
                }
              }     
          });

          let reqDate = moment(result.value?.req).format('YYYY/MM/DD');
          let invNote = result.value?.inv;

          if (invNote) {
            ApiRequest({
              url: 'SalesOrder/ApproveOrder?id=' + rowData.orderId + '&invoiceNote=' + invNote+'&reqDate=' + reqDate,
              method: 'put'
            }).then(_ => {
              setTriggerResetData(getRandomKey())
            })
          }
          else {
              SweetAlertService.errorMessage("Please inupt invoice note");
          }
        }
      })
    }
    else if (props.isDraft){
      actionButtons.pop() 
      // actionButtons.pop()              
      actionButtons.push({
        icon: '', //Button attr of Ant design (danger, ghost)
        tooltip: 'Approve',
        isFreeAction: false,
        onClick: async (event: any, rowData: any) => {
          // const result = await 
          ApiRequest({
            url: 'SalesOrder/ApprovedDraftOrder?id=' + rowData.orderId,
            method: 'put'
          }).then(_ => {
            setTriggerResetData(getRandomKey())
          })          
        }    
      })  
    } else {
      actionButtons.push({
        icon: '', //Button attr of Ant design (danger, ghost)
        tooltip: 'Copy Order',
        isFreeAction: false,
        onClick: (event: any, rowData: any) => {
          console.log(rowData)
          const newData = {
            customerId: rowData.customerId,
            totalPrice: rowData.totalPrice,
            employeeId: rowData.employeeId,
            priceInclgst: rowData.priceInclgst,
            requiredDate: rowData.requiredDate1,
            deliveryName: rowData.deliveryName,
            deliveryAddress: rowData.deliveryAddress,
            postalCode: rowData.postalCode,
            orderDate: rowData.orderDate1,
            comments: rowData.comments,
            deliveryAsap: rowData.deliveryAsap,
            orderStatusId: rowData.orderStatusId,
            deliveryCityId: rowData.deliveryCityId,
            deliveryMethodId: rowData.deliveryMethodId,
            custOrderNo: rowData.custOrderNo,
            accountNote: rowData.accountNote,
            warehouseNote: rowData.warehouseNote,
            operEmployeeId: getCookie('customerUserId')?0:parseInt(getCookie('id')),
            newWarehouseNote: rowData.newWarehouseNote,
            urgentNote: rowData.urgentNote,
            orderProduct: rowData.orderProduct,
            orderOption: rowData.orderOption,
          }
          ApiRequest({url: 'SalesOrder/CopyOrder', method: 'post', data: newData}).then((res: any) => {
            SweetAlertService.successMessage()
            setTriggerResetData(getRandomKey())
          }).catch((err: any) => {
            SweetAlertService.errorMessage('Copy Order Failed.', err.data.innerMessage)
          })
        }
      })
    }
    return actionButtons
  }

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      if ((props.customerId && (props.customerId === row.customerId)) || !props.customerId) {
        const newData = {
          ...row,
          cityId: row.deliveryCityId,
          city: row.deliveryCity,
          items: getItemsStr(row),
          orderDate1: row.orderDate,
          requiredDate1: row.requiredDate,
          deliveryDate: row.deliveryDate && (new Date(row.deliveryDate + '.000Z')).toDateString(),
          orderDate: row.orderDate && (new Date(row.orderDate + '.000Z')).toDateString(),
          requiredDate: row.requiredDate && (new Date(row.requiredDate + '.000Z')).toDateString(),
          orderStatusId: row.orderStatus?.orderStatusId,
          accountNote:row.accountNote,
          warehouseNote:row.warehouseNote,
          operEmployeeName:row.operEmployee?.firstName?row.operEmployee?.firstName:'Online'
        }

        if (props.stockMonitorProductId) {
          if (row.orderProduct.filter((item: any) => item.productId === props.stockMonitorProductId)[0]) {
            renderData.push(newData)
          }
        } else {
          renderData.push(newData)
          // if (props.isOnlineSalesOrder) {
          //   if (row.orderStatusId === 2) {
          //     renderData.push(newData)
          //   }
          // } else {
          //   if (props.salesId) {
          //     if (newData.employeeId === props.salesId) {
          //       renderData.push(newData)
          //     }
          //   } else {
          //     renderData.push(newData)
          //   }
          // }
        }
      }
    })
    return renderData
  }

  const getItemsStr = (row: any) => {
    let str: any = ''
    const a = row.orderProduct?.map((item: any) => str += (item.product?.productName + nsStr(item.product?.productName)))
    const b = row.orderOption?.map((item: any) => str += (item.option?.optionName + nsStr(item.option?.optionName)))
    return str
  }

  const getColumn = () =>{
    let column =  [...SalesOrderManagementColumnModel('order')].map((row: any) => {
      if (row.title === 'Location') {
        if (props.stockMonitorProductId) {
          return {...row, defaultFilter: [3, 10, 11]}
        }
      }
      return row
    })
    column = column.filter((e:any) => {
      return (e.title != 'Note')});
    if (props.isOnlineSalesOrder){
      column = column.filter((e:any) => {
        return (e.title != 'Location')&&(e.title != 'Paid')&&(e.title != 'Order Details')
      })
    }
    if (props.isDraft){
      column = column.filter((e:any) => {
        return (e.title != 'Location')&&(e.title != 'Paid')&&(e.title != 'Order Details')
      })
    }    
    if (props.isOnlineCustomer){
      column = column.filter((e:any) => {
        return (e.title != 'Location')&&(e.title != 'Paid')&&(e.title != 'Created By')&&(e.title != 'Order Details')
      })
    } 
       
    return column;
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

  const getAllUrlById = () => {
    if (props.isDraft) {
      return '/SalesOrder/GetDraft?salesId=' + getUserId()
    }    
    if (props.customerId && !props.salesId) {
      return '/SalesOrder/GetByCust?customerId=' + props.customerId
    }
    if (!props.customerId && props.salesId) {
      return '/SalesOrder/GetBySales?salesId=' + props.salesId
    }
    if (props.isOnlineSalesOrder) {
      return '/SalesOrder/GetAllOrder?orderStatusId=2'
    }
    return url
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.SalesOrder,//SalesOrder/GetAllOrder
    getAllUrl: getAllUrlById(),
    title: (props.salesId || props.isOnlineCustomer) ? 'Order' : (props.isOnlineSalesOrder ? 'Online Order and Prepayment Approval' : 'Order Management'),
    column: getColumn(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: async (dataDetail: any) => {
      if (dataDetail.orderStatusId >= 10) {
        const result = await SweetAlertService.confirmMessage('This order is in production or dispatch. Sure to delete?')
        if (!result) {
          return null
        }
      }
      dataDetail.paid = parseInt(dataDetail.paid, 10)
      dataDetail.deliveryCityId = dataDetail.cityId
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: props.stockMonitorProductId ? [] : getActionButton(),
    isNotDeletable: props.stockMonitorProductId,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div style={{position:'relative'}}>
      {!props.customerId && !props.isDraft &&
        <div style={{position:'absolute',marginTop:'18px',marginLeft:'400px',zIndex:10, display: 'flex'}}>
          {/* <Iselect data={selectOptions} onChange={sourceSelectHandle} width={300}/> */}
          <RangePicker value={[startDate, endDate]} onChange={onChangeDateRange}/>
          <div ><Button type="primary" onClick={onClearDateRange} 
            style={{marginLeft:'20px'}}>
            Clear Date</Button>
          </div>
        </div>}
      <CommonTablePage {...commonTablePageProps}
      />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={salesOrderProductManagementDialog} />
    </div>
  )
}

export default SalesOrderManagementPage
