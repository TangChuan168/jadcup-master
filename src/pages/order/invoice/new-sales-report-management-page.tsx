import React, { useState ,useEffect, useRef, useMemo, useCallback } from 'react'
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
import Iselect from '../../../components/common/i-select'
import { getAllProductRequest } from '../../../services/others/warehouse-management-services'
import { getEmployeeRequest } from '../../../services/others/work-arrangement-services'
import { ColDef, ExcelRow, GridReadyEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-enterprise'
// import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const { RangePicker } = DatePicker

const baseGetUrl = 'Invoice/GetNewSaleReport'
const NewSalesReportPage = (props: { customerId: any }) => {
  // this is using for export excel file
  // const _exporter = React.createRef<ExcelExport>()
  const gridRef = useRef<AgGridReact<any>>(null)

  const [triggerResetData, setTriggerResetData] = useState(false)
  // const [dialogTitle, setDialogTitle] = useState<string>()
//   const [open, setOpen] = useState(false)
//   const [orderData, setOrderData] = useState(false)
//   const [sales, setSales] = useState<any>()
//   const [profit, setProfit] = useState<any>()
//   const [deliveryFee, setDeliveryFee] = useState<any>()
//   const [urgentFee, setUrgentFee] = useState<any>()
//   const [setupFee, setSetupFee] = useState<any>()

  const [invoiceData, setInvoiceData] = useState<any>()
  const [dataExportBy, setDataExportrBy] = useState<any>([])
  const [selectExportBy, setSelectExportBy] = useState<'product' | 'sale' | 'customer'>()
  const [productList, setProductList] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number>()
  const [customerList, setCustomerList] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<number>()
  const [employeeList, setEmployeeList] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<number>()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [exportedData, setExportedData] = useState<any[]>([])
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'productOrOptionName', width: 200 },
    { field: 'packageQty' },
    { field: 'numberQuantity' },
    { field: 'totalQty' },
    { field: 'unitPrice' },
    { field: 'totalPrice' },
    { field: 'profitRate' },
    { field: 'reservePrice' },
    { field: 'reserveTotalPrice' },
  ])
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      // sortable: false,
      // filter: false,
      // resizable: false,
      // minWidth: 50,
      // flex: 1,
    }
  }, [])
  const popupParent = useMemo<HTMLElement>(() => {
    return document.body
  }, [])
  const onGridReady = useCallback((params: GridReadyEvent) => {}, [])

  const {id}:any  = useParams()
  const location = useLocation();
  let getUrlemployeePara = id == '1' ? '&employeeId=' + parseInt(getCookie('id')) : ''
  const [url, setUrl] = useState<string>(baseGetUrl + '?start='
        + moment().add(1, 'months').format('YYYY/MM/DD')
        + '&end=' + moment().add(1, 'days').format('YYYY/MM/DD'))


  useEffect(() => {
    setDataExportrBy([{label: 'By Product', value: 'product'}, {label: 'By Customer', value: 'customer'}, {label: 'By Sale', value: 'sale'}])
    getAllProductRequest()
      .then(res => {
        const selectArray: any[] = []
        res.data.data.forEach((product:any) => selectArray.push(
          {
            value: product.productId,
            label: product.productName
          }
        ))
        setProductList(selectArray)
      })
    ApiRequest({url: 'Customer/GetAllCustomer', method: 'get'})
      .then(res => {
        const selectArray = res.data.data.map((customer: any) => ({
          label: customer.company + ' / ' + customer.customerCode,
          value: customer.customerId
        }))
        setCustomerList(selectArray)
      })
    getEmployeeRequest()
      .then((res) => {
        const selectArray = res.data.data.map((employee: any) => ({
          label: employee.firstName + ' / ' + employee.lastName,
          value: employee.employeeId
        }))
        setEmployeeList(selectArray)
      })
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


//   const salesOrderProductManagementDialog = <SalesOrderProductManagementDialog orderData={orderData} isNewOrder={isNewOrder} onDialogClose={onDialogClose} customerId={props.customerId} />

  const setFooter = (data:any) => {
    let setupFee = 0, deliveryFee = 0, sales = 0, profit = 0, urgentFee = 0
    data.map((row: any) => {
      profit = profit + row.profit
      row.invoiceItem.map ((item:any) => {
        if (item.optionId === null) sales = sales + item.totalPrice
        if (item.optionId === 1) deliveryFee = deliveryFee + item.totalPrice
        if (item.optionId === 3) setupFee = setupFee + item.totalPrice
        if (item.optionId === 2) urgentFee = urgentFee + item.totalPrice
      })
    })
    // setDeliveryFee(deliveryFee.toFixed(2))
    // setSales(sales.toFixed(2))
    // setSetupFee(setupFee.toFixed(2))
    // setProfit(profit.toFixed(2))
    // setUrgentFee(urgentFee.toFixed(2))
  }
  const getRenderData = (data: any) => {
    let renderData: any = []
    renderData = data
    console.log(renderData)

    // const strucData = renderData.map((item: any) => {
    //   return {...item,
    //     totalQty: item.packageQty * item.quantity,
    //     totalWholePrice: item.unitPrice * item.quantity
    //   }
    // })

    const groupedData = groupData(renderData, 'productOrOptionName')
    const exportedArrayData: any[] = []
    for (const key in groupedData) {
      const items = groupedData[key]
      const result: any[] = []
      const reservePrices = Array.from(new Set(items.map((item: any) => item.reservePrice)))
      const unitPrices = Array.from(new Set(items.map((item: any) => item.unitPrice)))

      reservePrices.forEach((reservePrice: any) => {
        unitPrices.forEach((unitPrice: any) => {
          const dataToCal = items.filter((item: any) => item.unitPrice === unitPrice && item.reservePrice === reservePrice)
          if (dataToCal.length !== 0) {
            let totalQtyAll = 0
            let totalPriceAll = 0
            let totalReservePriceAll = 0
            dataToCal.forEach((item: any) => {
              totalQtyAll += item.quantity
              totalPriceAll += (item.totalPrice.toFixed(2) * 100)
              totalReservePriceAll += (item.reserveTotalPrice.toFixed(2) * 100)
            })

            const data = {...dataToCal[0], numberQuantity: dataToCal.length, totalPrice: totalPriceAll / 100, totalQty: totalQtyAll, reserveTotalPrice: totalReservePriceAll / 100}
            result.push(data)
          }
        })
      })
      exportedArrayData.push(result)
    }

    const finalData = exportedArrayData.flat().sort((a: any, b: any) => a.optionId - b.optionId)

    finalData.forEach((item: any) => {
      item.profitRate = item.reservePrice === 0 ? null : Number(((item.unitPrice - item.reservePrice) / item.reservePrice).toFixed(2))
    })

    setExportedData(finalData)
    console.log(finalData)

    return finalData
  }

  const onChange = (date:any, dateString:any) => {
    console.log('date', date, dateString)
    setStartDate(dateString[0])
    setEndDate(dateString[1])
  }
  const actionButtons: any = [

  ]

  const onFilterChange = (tableRef: any) => {
    setFooter(tableRef.current.dataManager.searchedData)
  }

  // const onSearchChange = (tableRef: any) => {
  //   setFooter(tableRef.current.dataManager.searchedData)
  // }

  const onSelectDataExportrBy = (value: any) => {
    setSelectExportBy(value)
    switch (value) {
      case 'product':
        setSelectedCustomer(undefined)
        setSelectedEmployee(undefined)
        break
      case 'customer':
        setSelectedProduct(undefined)
        setSelectedEmployee(undefined)
        break
      case 'sale':
        setSelectedCustomer(undefined)
        setSelectedProduct(undefined)
        break
    }
  }

  const onSelectProduct = (value: number) => {
    setSelectedProduct(value)
  }

  const onSelectCustomer = (value: number) => {
    setSelectedCustomer(value)
  }

  const onSelectEmployee = (value: number) => {
    setSelectedEmployee(value)
  }

  const onConfirm = () => {
    let exportString = ''
    switch (selectExportBy) {
      case 'product':
        exportString = '&productId=' + selectedProduct
        break
      case 'customer':
        exportString = '&customerId=' + selectedCustomer
        break
      case 'sale':
        exportString = '&salesId=' + selectedEmployee
        break
      default:
        break
    }
    const url = baseGetUrl + '?start=' + startDate + '&end=' + endDate + exportString + getUrlemployeePara
    setUrl(url)
    setTriggerResetData(!triggerResetData)
  }

  const groupData = (arr: any, property: any) => {
    const data = arr.reduce((group: any, item: any) => {
      const pro = item[property]
      group[pro] = group[pro] ?? []
      group[pro].push(item)
      return group
    }, {})
    return data
  }

  const dateToYMD = (date: Date) => {
    const strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const d = date.getDate()
    const m = strArray[date.getMonth()]
    const y = date.getFullYear()
    return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ' ' + y
  }

  const getHeader = (): ExcelRow[] => {
    let exportBy = ''
    let exportName = ''
    switch (selectExportBy) {
      case 'customer':
        exportBy = 'Customer'
        exportName = customerList?.filter((item: any) => item.value === selectedCustomer)[0].label
        break
      case 'product':
        exportBy = 'Product'
        exportName = productList?.filter((item: any) => item.value === selectedProduct)[0].label
        break
      case 'sale':
        exportBy = 'Sales'
        exportName = employeeList?.filter((item: any) => item.value === selectedEmployee)[0].label
        break
      default:
        break
    }
    const startStr = dateToYMD(new Date(startDate))
    const endStr = dateToYMD(new Date(endDate))
    return [
      {
        cells: [
          { data: { value: 'JADCUP - Order Summary by ' + exportBy, type: 'String' }, mergeAcross: 8},
        ],
      },
      { cells: [] },
      {
        cells: [
          { data: { value: exportName, type: 'String' }, mergeAcross: 8},
        ],
      },
      {
        cells: [
          { data: { value: startStr + ' to ' + endStr, type: 'String' }, mergeAcross: 8},
        ],
      },
      { cells: [] },
    ]
  }

  const getFooter = (): ExcelRow[] => {
    const noReturnItems = exportedData.filter((item: any) => item.productOrOptionName !== 'Return')
    const returnItems = exportedData.filter((item: any) => item.productOrOptionName === 'Return')
    const subTotalWithoutRe = noReturnItems?.reduce((acc: number, item: any) => (acc + item.totalPrice.toFixed(2) * 100), 0) / 100
    const returnTotal = returnItems?.reduce((acc: number, item: any) => (acc + item.totalPrice.toFixed(2) * 100), 0) / 100
    const subTotal: number = exportedData?.reduce((acc: number, item: any) => (acc + item.totalPrice.toFixed(2) * 100), 0) / 100
    const gst = subTotal * 0.15
    const totalReserve = exportedData?.reduce((acc: number, item: any) => (acc + item.reserveTotalPrice.toFixed(2) * 100)) / 100
    return [
      { cells: [] },
      {
        cells: [
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Summary', type: 'String'}, mergeAcross: 1},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Profit Summary', type: 'String'}, mergeAcross: 1},
        ],
      },
      { cells: [] },
      {
        cells: [
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Subtotal: ', type: 'String'}},
          { data: { value: '$' + subTotalWithoutRe, type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Net Sales: ', type: 'String'}},
          { data: { value: '$' + subTotal, type: 'String'}},
        ],
      },
      {
        cells: [
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Return: ', type: 'String'}},
          { data: { value: '-$' + Math.abs(returnTotal), type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Total Reserve: ', type: 'String'}},
          { data: { value: '$' + totalReserve, type: 'String'}},
        ],
      },
      {
        cells: [
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'GST: ', type: 'String'}},
          { data: { value: '$' + gst.toFixed(2), type: 'String'}},
        ],
      },
      {
        cells: [
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Total: ', type: 'String'}},
          { data: { value: '$' + (subTotal + gst).toFixed(2), type: 'String'}},
          { data: { value: '', type: 'String'}},
          { data: { value: 'Net Profit: ', type: 'String'}},
          { data: { value: '$' + (subTotal - totalReserve), type: 'String'}},
        ],
      },
    ]
  }

  const onExportExcel = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel({prependContent: getHeader(), appendContent: getFooter()})
  }, [exportedData, selectExportBy, customerList, selectedCustomer, productList, selectedProduct, employeeList, selectedEmployee, startDate, endDate])

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Invoice,
    getAllUrl: url,
    title: 'Sales Report',
    column: [...SalesOrderManagementColumnModel('newInvoice')]
      .filter((row: any) => !['Delivery Method', 'Stage', 'Account Note'].includes(row.title))
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
      <div style={{position: 'absolute', top: '20px', left: '200px', zIndex: 10}}>
        <RangePicker onChange={onChange}/>
      </div>
      <div style={{position: 'absolute', top: '20px', left: '500px', zIndex: 10}}>
        Export By: &nbsp;<Iselect onChange={onSelectDataExportrBy} data={dataExportBy} width={200} value={''} placeholder={'Select Export By'}/>
      </div>
      {selectExportBy === 'product' &&
        <div style={{position: 'absolute', top: '20px', left: '800px', zIndex: 10}}>
          Product: &nbsp;<Iselect onChange={onSelectProduct} data={productList} width={300} value={''} placeholder={'Select Product'}/>
        </div>
      }
      {selectExportBy === 'customer' &&
        <div style={{position: 'absolute', top: '20px', left: '800px', zIndex: 10}}>
          Customer: &nbsp;<Iselect onChange={onSelectCustomer} data={customerList} width={300} value={''} placeholder={'Select Customer'}/>
        </div>
      }
      {selectExportBy === 'sale' &&
        <div style={{position: 'absolute', top: '20px', left: '800px', zIndex: 10}}>
          Customer: &nbsp;<Iselect onChange={onSelectEmployee} data={employeeList} width={300} value={''} placeholder={'Select Sale'}/>
        </div>
      }
      <div style={{position: 'absolute', top: '20px', left: '1200px', zIndex: 10}}>
        <Button type='primary' onClick={onConfirm}
          disabled={startDate === undefined || endDate === undefined || selectExportBy === undefined ||
          (selectExportBy === 'product' && selectedProduct === undefined) ||
          (selectExportBy === 'customer' && selectedCustomer === undefined) ||
          (selectExportBy === 'sale' && selectedEmployee === undefined)}>Confirm</Button>
      </div>
      <div style={{position: 'absolute', top: '20px', left: '1300px', zIndex: 10}}>
        <Button type='primary' onClick={onExportExcel} disabled={exportedData.length === 0}>Export Excel</Button>
      </div>
      <CommonTablePage {...commonTablePageProps} />

      {/* <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={salesOrderProductManagementDialog} /> */}

      <div className="grid-wrapper" style={{opacity: '0',display:'none'}}>
        <div className="ag-theme-alpine">
          <AgGridReact<any>
            ref={gridRef}
            rowData={exportedData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            popupParent={popupParent}
            onGridReady={onGridReady}
          ></AgGridReact>
        </div>
      </div>
    </div>
  )
}

export default NewSalesReportPage
