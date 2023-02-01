import React, { useEffect, useState } from 'react'
import CommonTablePage from '../../../../../components/common/common-table/common-table-page'
import {urlKey, urlType} from '../../../../../services/api/api-urls'
import CommonDialog from '../../../../../components/common/others/common-dialog'
import {DispatchedColumnModel} from './dispatched-column-model'
import {ApiRequest} from '../../../../../services/api/api'
import SalesOrderProductManagementDialog
  from '../../../../order/sales-order/sales-order-product-management-dialog/sales-order-product-management-dialog'
import DispatchOrderDetailsTable from '../dispatch-order-details-table/dispatch-order-details-table'
import packingSlipPdfGenerate from '../../../../static/pdf/packing-slip/packing-slip-pdf-generate'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import Iselect from "../../../../../components/common/i-select";
import moment, { months } from 'moment'
import { Button, DatePicker } from 'antd'

const { RangePicker } = DatePicker

const DispatchedTable = (props: {orderId: any}):any => {
  const [orderId, setOrderId] = useState<any>()
  const [selectOptions, setSelectOptions] = useState<any>([
    {value:1,label:'One months'},
    {value:2,label:'Three months'},
    {value:3,label:'One Year'}])

  const [selectedOption, setSelectedOption] = useState<any>();
  const [open, setOpen] = useState(false)
  // const [filename, setFilename] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [dialogContent, setDialogContent] = useState<any>()
  const [startDate, setStartDate] = useState<any>(null)
  const [endDate, setEndDate] = useState<any>(null)
  const [url, setUrl] = useState<any>("Dispatching/GetAllDispatching?start="
        + moment().add(-1,'months').format('YYYY/MM/DD')
        +'&end='+moment().add(1,'days').format('YYYY/MM/DD'))
  const onDialogClose = async (isModified: boolean, newDispatchingId?: any) => {
    setOpen(false)
    if (isModified) {
        if (newDispatchingId) {
        console.log(newDispatchingId)
        const confirmResult = await SweetAlertService.confirmMessage('Do you want to config tracking no and courier at the moment?')
        if (confirmResult) {
          const result = await ApiRequest({
            url: 'Dispatching/GetSingleDispatching?dispatchId=' + newDispatchingId,
            method: 'get',
            isShowSpinner: true
          })
          if (result) {
            openCompleteDialog(result.data.data)
          }
        }
      }
    }
    setTriggerResetData(!triggerResetData)    
  }
  //For automatic open new dispatch dialog
  const getIsPackingSlip=(()=>{
    const pageUrl = window.location.pathname;
    if (pageUrl=="/delivered"){
  
      return true;
    }
    else{
      return false;
    }
  }) 
  useEffect(() => {   
    if (getIsPackingSlip()){
      document.title="Delivered List"
    }
    else{
      document.title="Dispatch List"
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    if (!orderId && props.orderId && !isCancelled) {
      setOrderId(props.orderId)
    }
    return () => {
      isCancelled = true
    }
  }, [props.orderId, orderId])

  const salesOrderProductManagementDialog = (orderData: any, dispatchData: any) => <SalesOrderProductManagementDialog isAwaitingDispatchPage={true} dispatchData={dispatchData} isNewOrder={false} onDialogClose={onDialogClose} orderData={orderData} />

  const dispatchOrderDetailsTable = (orderData: any, dispatchData: any) => <DispatchOrderDetailsTable onDialogClose={onDialogClose} dispatchData={dispatchData} orderId={orderData.orderId} />
  const getBlob = (filename:any,blob?:any) => {
    // myBlob = new Blob(blob, {type: 'application/pdf'})

    const blobURL = URL.createObjectURL(blob)
    let downloadlink  =document.createElement("a");
    downloadlink.href = blobURL;
    downloadlink.download =filename
    document.body.appendChild(downloadlink);
    downloadlink.click();
    document.body.removeChild(downloadlink);    
  }
  const pdfActionButton = [
    {
      icon: 'danger', //Button attr of Ant design (danger, ghost)
      tooltip: 'Download',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        const carton = rowData.dispatchingDetails.map((res:any) => {
          return {
            product: res.box.product.productCode,
            quantity: res.quantity,
            description: res.box.product.productName,
            carton: rowData.dispatchingDetails.filter((res1:any) => res1.productId === res.productId &&
              res1.quantity === res.quantity).length
          }
        })
        console.log(rowData)
        
        // console.log(carton,'carton')
        // console.log(rowData.dispatchingDetails.map((res:any) => {
        //   return res.box.productId
        // }))
        // arrayDeduplication(carton)
        const sorted = groupBy(carton, function(item:any) {
          return [item.product,item.quantity]
        })
        // console.log(sorted,'sorted')
        const finalCarton = sorted.map((res:any) => {
          const sum = res.reduce((accumulator:any, currentValue:any) => accumulator + currentValue.quantity, 0)
          return arrayDeduplication(res).map((res:any) => {
            res.sum = sum
            return res
          })

        })
        // console.log(finalCarton.flat(Infinity),'quantity')
        console.log(rowData);
        const obj = {
          tableContent: finalCarton.flat(Infinity),
          customer: rowData.order,
          deliveredAt: rowData.deliveredAt,
          packingSlipNo:rowData.packingSlipNo,
          employee:rowData.employee?.firstName,
          outstanding:rowData.dispatchingOutStanding
        }
        console.log(obj);        
        //for test page size
        // for (let i=0 ; i<100; i++){
        //   obj.tableContent.push(obj.tableContent[0]);
        // }
        // console.log(obj)
        // let getblob
        let filename = 'PS'+rowData.packingSlipNo+'_'+rowData.order?.customer?.customerCode;
        packingSlipPdfGenerate(obj,"getBlob",getBlob,filename)
      }
    }
  ]
  const newDispatch = async () => {
    const result = await ApiRequest({
      urlInfoKey: urlKey.SalesOrder,
      type: urlType.GetById,
      dataId: props.orderId,
      isShowSpinner: false
    })
    if (result) {
      console.log('dispatch page data result from back end # 123441413', result)
      setOpen(true)
      setDialogTitle('Locations - Create')
      setDialogContent(salesOrderProductManagementDialog(result.data.data, null))
    }
  }
  //  const openCompleteDialog = async (rowData: any) => {
  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Create new dispatch',
      isFreeAction: true,
      onClick: async (event: any, rowData: any) => {
        newDispatch()
      }
    },
    // {
    //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
    //   tooltip: 'Edit',
    //   isFreeAction: false,
    //   onClick: async (event: any, rowData: any) => {
    //     if (rowData.status === 1) {
    //       // console.log(rowData)
    //       const result = await ApiRequest({
    //         urlInfoKey: urlKey.SalesOrder,
    //         type: urlType.GetById,
    //         dataId: rowData.orderId,
    //         isShowSpinner: false
    //       })
    //       if (result) {
    //         setOpen(true)
    //         setDialogTitle('Locations - Update')
    //         setDialogContent(salesOrderProductManagementDialog(result.data.data, rowData))
    //         // console.log(rowData)
    //       }
    //     }
    //   }
    // },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Delivered',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        if (rowData.status === 1) {
          // console.log(rowData)
          await openCompleteDialog(rowData)
        }else
          SweetAlertService.errorMessage("This order has already Delivered!")
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Delete',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
          const confirmed =await SweetAlertService.confirmMessage();
          if (confirmed){
              const result = await ApiRequest({
                url: 'Dispatching/DeleteDispatching?id=' + rowData.dispatchId,
                method: 'delete',
                isShowSpinner: true
              }
            )  
            setTriggerResetData(!triggerResetData)              
          }
        }
      },    
    ...pdfActionButton,
  ]

  const openCompleteDialog = async (rowData: any) => {
    const result = await ApiRequest({
      urlInfoKey: urlKey.SalesOrder,
      type: urlType.GetById,
      dataId: rowData.orderId,
      isShowSpinner: false
    })
    if (result) {
      setOpen(true)
      setDialogTitle('Locations - Complete')
      setDialogContent(dispatchOrderDetailsTable(result.data.data, rowData))
    }
  }

  const actionButtons2 = [
    ...pdfActionButton
  ]

  const groupBy = (array:any, f:any) => {
    const groups:any = {}
    array.forEach(function(o:any) {
      const group = JSON.stringify(f(o))
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return Object.keys(groups).map(function(group) {
      return groups[group]
    })
  }

  const arrayDeduplication = (arr:any) => {
    const result = []
    const obj:any = {}
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].product]) {
        result.push(arr[i])
        obj[arr[i].product] = true
      }
    }
    return result
  }

  const getRenderData = (data: any) => {
    let renderData: any[] = []
    data.map((row: any) => {
      row.status && renderData.push({
        ...row,
        customerStr: row.order?.customer?.customerCode,
        courierName: row.courier?.courierName,
        createdAt1: row.createdAt,
        createdAt: row.createdAt && (new Date(row.createdAt + '.000Z')).toLocaleString(),
        custOrderNo:row.order?.custOrderNo
      })
    })
    console.log(renderData)
    if (props.orderId) return renderData
    renderData = renderData.filter((row:any)=>{
      return getIsPackingSlip()? row.status == 2:row.status == 1
    })
    return renderData
  }
  const setUrlforChange = (value:any) => {
    let url = 'Dispatching/GetAllDispatching';
    if (orderId){
      url = 'Dispatching/GetAllDispatching?orderId=' + orderId
      setUrl(url);
      return
    }
    if (value){
      let startDate,endDate;
      endDate = moment().add(1,'days').format('YYYY/MM/DD');
      if (value==1){
        startDate=moment().add(-1,'months').format('YYYY/MM/DD');
      }
      else if (value==2){
        startDate=moment().add(-3,'months').format('YYYY/MM/DD');
      }
      else if (value==3){
        startDate=moment().add(-1,'years').format('YYYY/MM/DD');
      }
      url = 'Dispatching/GetAllDispatching?start=' + startDate+'&end='+endDate
    }    
    setUrl(url);
  }
  const sourceSelectHandle =(value:any) =>{
    setUrlforChange(value);
    setTriggerResetData(!triggerResetData)
  }

  const onChangeDateRange = (value: any) => {
    setStartDate(value?value[0]:null)
    setEndDate(value?value[1]:null)
    let url = 'Dispatching/GetAllDispatching'
    if (orderId) {
      url = 'Dispatching/GetAllDispatching?orderId=' + orderId
      setUrl(url)
      setTriggerResetData(!triggerResetData)
      return
    }
    if (value && value.length === 2) {
      url = 'Dispatching/GetAllDispatching' + '?start=' + value[0].format('YYYY/MM/DD') + '&end=' + value[1].format('YYYY/MM/DD')
    }
    setUrl(url)
    setTriggerResetData(!triggerResetData)
  }
  const onClearDateRange = () => {
    setStartDate(null)
    setEndDate(null)
    setUrl('Dispatching/GetAllDispatching?start='
      + moment().add(-1,'months').format('YYYY/MM/DD')
      +'&end='+moment().add(1,'days').format('YYYY/MM/DD'))
    setTriggerResetData(!triggerResetData)
  }

  return (
    <div style={{position:'relative'}}>
      {!orderId &&<div style={{position:'absolute',marginTop:'20px',marginLeft:'400px',zIndex:10, display: 'flex'}}>
        {/* <Iselect data={selectOptions} onChange={sourceSelectHandle} width={300}/> */}
        <RangePicker value={[startDate, endDate]} onChange={onChangeDateRange}/>
        <div ><Button type="primary" onClick={onClearDateRange} 
          style={{marginLeft:'20px'}}>
          Clear Date</Button>
        </div>
      </div>}
      {
        (props.orderId) ? (
          <div>
            <CommonTablePage
              urlInfoKey={urlKey.Dispatch}
              getAllUrl={'Dispatching/GetAllDispatching?orderId=' + props.orderId}
              title={'Dispatched table'}
              column={DispatchedColumnModel().map((row: any) => {
                // if (row.title === 'Status') {
                //   row.defaultFilter = ['1']
                // }
                return row
              }).filter((row: any) => {
                return row.title!='Customer'&& row.title!='Po Number' && row.field!='imgs'
              })
            }
              mappingRenderData={(data: any) => getRenderData(data)}
              actionButtons={actionButtons}
              isNotEditable={true}
              isNotAddable={true}
              isNotDeletable={true}              
              triggerResetData={triggerResetData}
            />
          
          </div>
        ) : (
          <CommonTablePage
          urlInfoKey={urlKey.Dispatch}
          getAllUrl={url}
            title={getIsPackingSlip()?'Delivered List':'Dispatch list'}
            column={DispatchedColumnModel()
              .filter((row: any) => {
                if  (!getIsPackingSlip() && row.field=="imgs") 
                  return false;
                else 
                  return true;
              })
              .map((row: any) => {
              if (row.title === 'Location') {
                row.defaultFilter = ['2']
              }
              return row
            })}
            actionButtons={getIsPackingSlip()?actionButtons2:actionButtons.filter((e:any)=>{return e.tooltip!='Create new dispatch'})}
            mappingRenderData={(data: any) => getRenderData(data)}
            isNotEditable={true}
            isNotAddable={true}
            isNotDeletable={true}
            triggerResetData={triggerResetData}
          />
          
        )
        
      }
        <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={dialogContent} />
    </div>
  )
}

export default DispatchedTable
