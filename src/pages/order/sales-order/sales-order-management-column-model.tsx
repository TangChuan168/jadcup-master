import React from 'react'
import { AlertOutlined } from '@ant-design/icons'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, getItemsObj, getRandomKey, nbsStr, renderFn } from '../../../services/lib/utils/helpers'
import CommonDatePickerFilter from '../../../components/common/others/common-date-picker-filter'
import moment from 'moment'
import ItipsForOrderDetails from '../../../components/common/i-tips/order-details'
import ItipsForProduct from '../../../components/common/i-tips/product'
import { Popover } from 'antd'

export const colKey: any = {
  customerId: urlKey.Customer,
  employeeId: urlKey.Employee,
  totalPrice: 'totalPrice',
  deliveryName: 'deliveryName',
  deliveryAddress: 'deliveryAddress',
  postalCode: 'postalCode',
  comments: 'comments',
  requiredDate: 'requiredDate',
  orderDate: 'orderDate',
  deliveryDate: 'deliveryDate',
  deliveryAsap: 'deliveryAsap',
  paid: 'paid',
  deliveryCityId: urlKey.City,
  orderStatusId: urlKey.OrderStatus,
  deliveryMethodId: urlKey.DeliveryMethod,
  orderNo: 'orderNo',
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.customerId, label: '', otherOptions: {required: true, type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['customerCode']}},
    {key: colKey.employeeId, label: 'Sales', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}},
    {key: colKey.totalPrice, label: 'Price', otherOptions: {type: 'inputNumber'}},
    {key: colKey.deliveryName, label: 'Delivery Name'},
    {key: colKey.deliveryDate, label: 'Delivery Date'},
    {key: colKey.deliveryAddress, label: 'Delivery Address'},
    {key: colKey.postalCode, label: 'Postal Code'},
    {key: colKey.orderNo, label: 'Order No', otherOptions: {disabled: true}},
    {key: colKey.comments, label: 'Comments', otherOptions: {type: 'inputTextArea'}},
    {key: colKey.deliveryCityId, label: 'Delivery City', otherOptions: {type: 'select'}},
    {key: colKey.orderStatusId, label: 'Location', otherOptions: {type: 'select'}},
    {key: colKey.deliveryMethodId, label: '', otherOptions: {type: 'select'}}
  ]
}

const colInfos: any = {
  basicInfo: {
    title: 'Company Name',
    field: 'basicInfo',
    keywords: [colKey.customerId, colKey.employeeId, colKey.orderNo, colKey.comments]
  },
  deliveryInfo: {
    title: 'Delivery Method',
    field: 'deliveryInfo',
    keywords: [colKey.deliveryName, colKey.deliveryCityId, colKey.deliveryAddress, colKey.postalCode, colKey.deliveryMethodId, colKey.deliveryDate]
  },
  items: {
    title: 'Items',
    field: 'items',
  },
  stage: {
    title: 'Stage',
    field: 'stage',
    keywords: [colKey.orderStatusId]
  }
}

export const renderOrderProduct = (rowData: any, isAwaitingDispatchPage?: boolean, dispatchDatials?: any,isInvoice?: boolean,) => {
  return (rowData.orderProduct?.length && (
    <div>
      {
        rowData.orderProduct.map((row: any) => (
          <div key={getRandomKey()} style={{display:'flex'}}>
            {
              row.productId ? (
                // <div style={{width:isAwaitingDispatchPage?'58%':(isInvoice?'80%':(dispatchDatials?.length?'75%':'82%'))}}>
              <div style={{width:'58ch'}}>
                  {/* {nbsStr(row.product?.productName,false,58)}&nbsp;&nbsp; */}
                  <ItipsForProduct id={row.productId} isNotCutting={true} label={nbsStr(row.product?.productName,false,58)}></ItipsForProduct>
                </div>
              ) : null
            }
            {/* <b>Qty:</b>&nbsp;{row.quantity}*{row.product.baseProduct.packagingType.quantity}&nbsp;&nbsp; */}
            {
              isInvoice ?
                (
                  <div style={{width:'35ch',flex:1,display:'flex'}}>
                    <div style={{width:'17ch'}}>
                      <b>Carton:</b>&nbsp;{row.packageQty}*{row.product.baseProduct?.packagingType?.quantity}</div>
                    <div style={{width:'17ch'}}>
                      <b>$</b>{row.unitPrice.toFixed(2)}<b></b>
                      {row.purchPrice &&  <span> [Pch: ${row.purchPrice ? row.purchPrice.toFixed(2) : 0}]</span>}
                    </div>
                    {/* { row.purchPrice &&
                      <div style={{flex: 1}}>
                        <b>PP: $</b>{row.purchPrice ? row.purchPrice.toFixed(2) : 0}
                      </div>} */}
                    {/* { row.purchPrice &&  <div style={{flex: 0.5}}>
                        <b>Unit: </b>{row.unit}
                    </div>} */}
                </div>
                ) :
                (
                  <div style={{width:'18%',flex:1,textAlign:'left'}}>
                    <b >Qty:</b>&nbsp;{row.quantity}*{row.product.baseProduct?.packagingType?.quantity}&nbsp;
                    {
                      dispatchDatials?.length && nbsStr('/ ' + dispatchDatials.filter((item: any) => item.productId === row.productId).length)
                    }
                  {
                      dispatchDatials?.length && nbsStr(' - ' + dispatchDatials.filter((item: any) => item.productId === row.productId)
                          .reduce((previousValue:any, currentValue:any)=>previousValue + currentValue.quantity,0))
                    }                    
                  </div>
                )
            }


            {/* <span> */}
            {/* <b>Price:</b>&nbsp;{row.price}&nbsp;&nbsp; */}
            {/* </span> */}
            
            {
              isAwaitingDispatchPage ? (
                <div style={{width:'30%',display:'flex'}}>
                  <div style={{width:'36%'}}>
                  {/* <b>Stock:</b>&nbsp;{row.stockQuantity}{row.inDeliveryingQuantity > 0 ?<span>-{row.inDeliveryingQuantity}={row.stockQuantity-row.inDeliveryingQuantity}</span>:null} */}
                  <b>Stk:</b>&nbsp;{row.stockQuantity>10000?(row.stockQuantity/1000).toFixed(0)+"K":row.stockQuantity}
                  </div>
                  <div style={{width:'32%'}}><b>Dsp:</b>&nbsp;{row.inDeliveryingQuantity}</div>
                  <div style={{width:'32%',color: row.deliveredQuantity==0?(row.stockQuantity>0?'green':'black'):(row.deliveredQuantity < row.quantity*row.product.baseProduct?.packagingType?.quantity?'blue':'red')}}>
                    &nbsp;(
                    {/* <b>Delivered:</b>&nbsp;{row.delivered ? 'Yes' : 'No'}&nbsp;
                    <b>Qty:</b>&nbsp;{row.deliveredQuantity}) */}
                    <b>Del:</b>{row.deliveredQuantity})
                  </div>
                  </div>
              ) : null
            }
            {/* {
              isInvoice ?(
                <div style={{width:'10%',flex:1}}>
                  <b>$</b>{row.unitPrice}<b></b>
                </div>
              ):null
            } */}
          </div>
        ))
      }
      {
        rowData.orderOption?.map((row: any) => {
          const total = rowData.orderOption?.reduce((acc: any, option: any) => acc + option.price, 0)
          return <div key={getRandomKey()}>
            {
              row.optionId ? (
                <span>
                  <b>Option:</b>&nbsp;{nbsStr(row.option?.optionName)}&nbsp;&nbsp;
                </span>
              ) : null
            }
            <span>
              {/* <b>Price:</b>&nbsp;${row.totalPrice?row.totalPrice.toFixed(2):total}&nbsp;&nbsp; */}
              <b>Price:</b>&nbsp;${row.price.toFixed(2)}&nbsp;&nbsp;
            </span>
            {/* <span> */}
            {/* <b>Price:</b>&nbsp;{row.price}&nbsp;&nbsp; */}
            {/* </span> */}
          </div>
        }) || null
      }
      {/* <div>-----</div> */}
      {/*<div>*/}
      {/*  <b>Gst:</b>&nbsp;${rowData.priceInclgst}*/}
      {/*</div>*/}
      {/* <div> */}
      {/* <b>Total Price:</b>&nbsp;${rowData.totalPrice - rowData.priceInclgst} */}
      {/* </div> */}
    </div>
  )) || null
}
export const myfiler=(
  filterValue:any,
  rowData:any
) => {
  const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1);
  for (let ele of rowData.orderProduct){
    const prodName = (ele.product?.productName.replace(/-/g, '\u2011').trim()).toUpperCase();
    if (prodName.indexOf(filter.toUpperCase()) >=0) return true;
  }
  return false;
}        
const SalesOrderManagementColumnModel = (type:string) => {
  if (type=='invoice'){
    return [
      {
        ...getColModelItem(colInfos.basicInfo, keyInfosArray),
        // render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), [colKey.customerId])
        render: (rowData: any) =>rowData.customer.customerCode,
      },
      {
        title: 'Sales Person',
        field: 'employeeName',
        render: (rowData: any) => rowData.employeeName
      },
      {
        ...getColModelItem(colInfos.deliveryInfo, keyInfosArray),
        render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData.order), [colKey.deliveryMethodId])
        // render: (rowData: any) => rowData.order.deliveryMethod.deliveryMethodName
      },
      {
        title: colInfos.items.title,
        field: colInfos.items.field,
        sorting: false,
        filtering: true,
        editable: 'never',
        render: (rowData:any) => renderOrderProduct(rowData,false,false,true),
        customFilterAndSearch:(        filterValue:any,
          rowData:any) =>myfiler(
          filterValue,
          rowData
        )        
      },
      {
        title: 'Invoice Date',
        field: 'invoiceDate',
        render: (rowData: any) => moment.utc(rowData.invoiceDate).local().format('DD/MM/YYYY')
      },
      {
        title: 'Price',
        field: 'totalPrice',
        render: (rowData: any) => '$'+rowData.priceInclgst.toFixed(2)
      },
      {
        title: 'Account Note',
        field: 'accountNote',
        render: (rowData: any) => rowData.accountNote
      },
      {
        title: 'PO No',
        field: 'PoNo',
        render: (rowData: any) => rowData.PoNo
      },          
      {
        title: 'Invoice Note',
        field: 'invoiceNote',
        render: (rowData: any) => rowData.invoiceNote
      },  
      {
        title: 'Packing Slip',
        field: 'packingSlipNo',
        render: (rowData: any) => rowData.packingSlipNo,
        customFilterAndSearch:(  filterValue:any, rowData:any) => {
          let strPackingSlipNo =""
          rowData.order.dispatching.map((e:any)=>{
            strPackingSlipNo = strPackingSlipNo+","+e.packingSlipNo;
          })
          if (strPackingSlipNo.includes(filterValue)) return true;
          return false;
        }
       
      },            
      {
        title: 'Profit',
        field: 'profit',
        render: (rowData: any) => '$'+rowData.profit
      },
      {
        title: 'Paid',
        field: colKey.paid,
        initialEditValue: 1,
        type: 'numeric',
        lookup: {0: 'No', 1: 'Yes'}
      }
    ]    
    
  } else if (type === 'newInvoice') {
    return [
      {
        ...getColModelItem(colInfos.deliveryInfo, keyInfosArray),
        render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData.order), [colKey.deliveryMethodId])
        // render: (rowData: any) => rowData.order.deliveryMethod.deliveryMethodName
      },
      {
        title: 'Product Description',
        field: 'productOrOptionName',
        render: (rowData: any) => rowData.productOrOptionName
      },
      {
        title: 'Pack',
        field: 'packageQty',
        render: (rowData: any) => rowData.packageQty
      },
      {
        title: 'QTY',
        field: 'numberQuantity',
        render: (rowData: any) => rowData.numberQuantity
      },
      {
        title: 'Total',
        field: 'totalQty',
        render: (rowData: any) => rowData.totalQty
      },
      {
        title: 'Unit Price',
        field: 'unitPrice',
        render: (rowData: any) => rowData.unitPrice
      },
      {
        title: 'Amount',
        field: 'totalPrice',
        render: (rowData: any) => rowData.totalPrice
      },
      {
        title: 'Profit Rate',
        field: 'profitRate',
        render: (rowData: any) => rowData.profitRate
      },
      {
        title: 'Reserve Price',
        field: 'reservePrice',
        render: (rowData: any) => rowData.reservePrice
      },
      {
        title: 'Total',
        field: 'reserveTotalPrice',
        render: (rowData: any) => rowData.reserveTotalPrice
      }
    ]
  }
  return [
    {
      ...getColModelItem(colInfos.basicInfo, keyInfosArray),
      // render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), [colKey.customerId])
      render: (rowData: any) =>rowData.customer.customerCode,
    },
    {
      ...getColModelItem(colInfos.deliveryInfo, keyInfosArray),
      //  render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), [colKey.deliveryMethodId])
      render: (rowData: any) =>rowData.deliveryMethod?.deliveryMethodName,
      
    },
    {
      title: colInfos.items.title,
      field: colInfos.items.field,
      sorting: false,
      // filtering: true,
      editable: 'never',      
      render: (rowData:any) => renderOrderProduct(rowData),
      customFilterAndSearch:(        filterValue:any,
        rowData:any) =>myfiler(
        filterValue,
        rowData
      )
      //  (
      //   filterValue:any,
      //   rowData:any
      // ) => {
      //   const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1);
        
      //   for (let ele of rowData.orderProduct){
      //     const prodName = ele.product?.productName.replace(/-/g, '\u2011').trim();
      //     console.log(prodName);
      //     if (prodName.indexOf(filter) >=0) return true;
      //   }
      //   return false;
      // }         
    },  
    {
      title: 'Note',
      field: 'newWarehouseNote',
      // defaultSort: 'desc',
    },    
     {
      title: 'Order Date',
      field: 'orderDate1',
      type: 'datetime',
      editable: 'never',      
      render: (rowData: any) =>
      <div>
          {
            rowData.deliveryAsap == 1 && <div>
              <Popover
                content={rowData.urgentNote}
                // placement='right'
                title={<div style={{ textAlign: 'center' }}>Urgent</div>}
                // trigger='hover'
                // visible={true}
              >
                 <AlertOutlined style={{ textAlign: 'center' ,fontSize: '24px', color: 'red' }} />
              </Popover>
             
              </div>
          }
        <div>
          {moment.utc(rowData.approvedDate?rowData.approvedDate:rowData.orderDate).local().format('DD/MM/YYYY')}
        </div>
      </div>,
      // filterComponent: (props:any) => {
      //   return (
      //     <>
      //       <CommonDatePickerFilter
      //         columnDef={props.columnDef}
      //         onFilterChanged={props.onFilterChanged}
      //       />
      //     </>
      //   )
      // },
      customFilterAndSearch: (
        filterValue:any,
        rowData:any
      ) => {
        if (filterValue && (!filterValue.startDate || !filterValue.endDate || filterValue.startDate > filterValue.endDate)) {
          return false
        }
        return !filterValue || (rowData.createdAt >= filterValue.startDate && rowData.createdAt.slice(0, 10) <= filterValue.endDate)
      },            
    },
    {
      title: 'Box',
      field: 'newWarehouseNote',
      // defaultSort: 'desc',
    }, 
    {
      title: 'Required Date',
      field: 'requiredDate1',
      render: (rowData: any) => moment.utc(rowData.requiredDate).local().format('DD/MM/YYYY')
    },
    {
      title: 'PO No',
      field: 'custOrderNo',
      render: (rowData: any) => rowData.custOrderNo
    },  
    {
      title: 'Created By',
      field: 'operEmployeeName',
      // render: (rowData: any) => rowData.operEmployeeName,
    },     
    {
      title: 'Paid',
      field: colKey.paid,
      initialEditValue: 0,
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'}
    },
    {
      title: 'Location',
      field: 'orderStatusId',
      sorting: false,
      lookup: { 1: 'New', 2: 'Online', 3: 'Approved', 10: 'Production', 11: 'Warehouse', 15: 'Delivered', 16: 'Paid', 20: 'Closed' },
      render: (rowData: any) => <div><div>
        {rowData[colKey.orderStatusId]?.[colKey.orderStatusId + 'Name']}
        </div>
        {type=='awaiting'&&<ItipsForOrderDetails id={rowData.orderId} />        }
      </div>
    },
    {
      title: 'Order Details',
      field: 'orderId',
      render: (rowData: any) => (
        <ItipsForOrderDetails id={rowData.orderId}/>
      )
    }
  ]
}

export default SalesOrderManagementColumnModel;
 

