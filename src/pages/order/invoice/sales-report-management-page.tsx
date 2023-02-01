import React, { useState ,useEffect } from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import SalesOrderManagementColumnModel from '../sales-order/sales-order-management-column-model'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../../services/api/api'
import CommonDialog from '../../../components/common/others/common-dialog'
import SalesOrderProductManagementDialog from '../sales-order/sales-order-product-management-dialog/sales-order-product-management-dialog'
import moment, { months } from 'moment'
import { Button, DatePicker } from 'antd'
import { useParams } from 'react-router-dom'
import { getCookie } from 'react-use-cookie'
import { useLocation } from 'react-router-dom';

const { RangePicker } = DatePicker

const baseGetUrl = 'Invoice/GetSaleReport'
const SalesReportPage = (props: { customerId: any }) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  // const [dialogTitle, setDialogTitle] = useState<string>()
  const [open, setOpen] = useState(false)
  const [orderData, setOrderData] = useState(false)
  const [sales, setSales] = useState<any>()
  const [profit, setProfit] = useState<any>()
  const [deliveryFee, setDeliveryFee] = useState<any>()
  const [urgentFee, setUrgentFee] = useState<any>()
  const [setupFee, setSetupFee] = useState<any>()
  const [prodList, setProdList] = useState<any>()
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false)
  
  const {id}:any  = useParams()
  const location = useLocation();
  let getUrlemployeePara = id == '1' ? '&employeeId=' + parseInt(getCookie('id')) : ''
  const [url, setUrl] = useState<string>(baseGetUrl + '?start='
        + moment().add(1, 'months').format('YYYY/MM/DD')
        + '&end=' + moment().add(1, 'days').format('YYYY/MM/DD'))

  const isNewOrder = false
  const dialogTitle = 'Order'

  const onDialogClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    console.log('Location changed',location);
    console.log('Location changed',id);
    getUrlemployeePara = id == '1' ? '&employeeId=' + parseInt(getCookie('id')) : ''
    const url = baseGetUrl + '?start='
      + moment().add(1, 'months').format('YYYY/MM/DD')
      + '&end=' + moment().add(1, 'days').format('YYYY/MM/DD')
      + getUrlemployeePara;
    setUrl(url)
    // id = useParams();
    setTriggerResetData(!triggerResetData)

  }, [location]);

  useEffect(() => {
    if (props.customerId) return
    else document.title = "Sales Report";
  }, [])


  const salesOrderProductManagementDialog = <SalesOrderProductManagementDialog orderData={orderData} isNewOrder={isNewOrder} onDialogClose={onDialogClose} customerId={props.customerId} />

  const setFooter = (data:any) => {
    let setupFee = 0, deliveryFee = 0, sales = 0, profit = 0, urgentFee = 0
    let prodArr:any=[];
    data.map((row: any) => {
      profit = profit + row.profit
      row.invoiceItem.map ((item:any) => {
        if (item.optionId === null) sales = sales + item.totalPrice
        if (item.optionId === 1) deliveryFee = deliveryFee + item.totalPrice
        if (item.optionId === 3) setupFee = setupFee + item.totalPrice
        if (item.optionId === 2) urgentFee = urgentFee + item.totalPrice
      })
    })
    data.map((row: any) => {
      profit = profit + row.profit
      row.invoiceItem.map ((item:any) => {
        let prodInfo = prodArr.filter((e:any)=>{
            return e.productId == item.productId
        })
        if (prodInfo.length>0){
          prodInfo[0].quantity = prodInfo[0].quantity + item.quantity;
          prodInfo[0].totalPrice = prodInfo[0].totalPrice + item.totalPrice;
        }
        else {
          if (item.productId)
            prodArr.push({
              totalPrice:item.totalPrice,
              quantity:item.quantity,
              productId:item.productId,
              productName:item.product.productName,
            })
        }
      })
    })    
    console.log(prodArr)
    setProdList(prodArr)
    setDeliveryFee(deliveryFee.toFixed(2))
    setSales(sales.toFixed(2))
    setSetupFee(setupFee.toFixed(2))
    setProfit(profit.toFixed(2))
    setUrgentFee(urgentFee.toFixed(2))
  }
  const getRenderData = (data: any) => {
    const renderData: any = []
    console.log(data)
    setFooter(data.filter((item: any) => item.paid === 1))
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
        employeeName: `${row.order?.employee?.firstName} ${row.order?.employee?.lastName}`,
        packingSlipNo: row.order.dispatching.map((e: any) => { return e.packingSlipNo }).join(',')
      })
    })
    console.log(renderData)
    return renderData
  }

  const getItemsStr = (row: any) => {
    let str: any = ''
    const a = row.invoiceItem?.map((item: any) => str += (item.product?.productName + (item.product?.productName)))
    const b = row.invoiceItem?.map((item: any) => str += (item.option?.optionName + (item.option?.optionName)))
    return str
  }
  const onChange = (date:any, dateString:any) => {
    console.log('date', date, dateString)
    const url = baseGetUrl + '?start=' + dateString[0] + '&end=' + dateString[1] + getUrlemployeePara
    setUrl(url)
    setTriggerResetData(!triggerResetData)
  }
  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'See Order',
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
  
  const showDetails = () => {
    setIsShowDetails(!isShowDetails)
  }

  const onFilterChange = (tableRef: any) => {
    setFooter(tableRef.current.dataManager.searchedData)
  }

  // const onSearchChange = (tableRef: any) => {
  //   setFooter(tableRef.current.dataManager.searchedData)
  // }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Invoice,
    getAllUrl: url,
    title: 'Sales Report' ,
    column: [...SalesOrderManagementColumnModel('invoice')]
      .filter((row: any) => !['Delivery Method', 'Stage', 'Account Note','Photos'].includes(row.title))
      .map((row: any) => (row.title === 'Paid' ? { ...row, defaultFilter: ['1'] } : row)),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.draft = parseInt(dataDetail.draft, 10)
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: actionButtons,
    onFilterChange: onFilterChange,
    isNotAddable: true,
    isNotEditable: true,
    isNotDeletable: true
  }
  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute', marginTop: '20px', marginLeft: '400px', zIndex: 10}}>
        <RangePicker onChange={onChange}/>
      </div>
      <CommonTablePage {...commonTablePageProps} />

      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={salesOrderProductManagementDialog} />
      <div>Product Sales:{sales}<Button type='primary' onClick={()=>showDetails()}>Details</Button></div>
      <div>Profit:{profit}</div>
      <div>Delivery Fee:{deliveryFee}</div>
      <div>Setup Fee:{setupFee}</div>
      <div>Urgent Fee:{urgentFee}</div>
      <div style={{border:"solid"}}> 
        {
          isShowDetails&&prodList&&prodList.map((prod: any) => (
          <div style={{display:"flex"}} key={prod.productId}>
            <div style={{width:'70ch'}}> <b>{prod.productName}</b></div>
            <div style={{width:'10%'}}>${prod.totalPrice}</div>
            <div style={{width:'15%'}}><b>QTY: </b>{prod.quantity}</div> 
          </div>
          ))
        }  
      </div>
    </div>
  )
}

export default SalesReportPage
