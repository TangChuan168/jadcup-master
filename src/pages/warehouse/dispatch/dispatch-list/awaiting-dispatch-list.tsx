import React, { useState ,useEffect, useRef} from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import SalesOrderManagementColumnModel
, { renderOrderProduct ,myfiler} from '../../../order/sales-order/sales-order-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'
import CommonDialog from '../../../../components/common/others/common-dialog'
// import DispatchedTable from './dispatched-table/dispatched-table'
import { ApiRequest } from '../../../../services/api/api'
import { getRandomKey } from '../../../../services/lib/utils/helpers'
import SalesOrderProductManagementDialog 
  from '../../../order/sales-order/sales-order-product-management-dialog/sales-order-product-management-dialog'
import { runInNewContext } from 'vm'


const refreshTime=5;
const AwaitingDispatchList = () => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [dialogContent, setDialogContent] = useState<any>()
  

  const [value, setValue] = useState<number>(refreshTime);
  const [timers, setTimers] = useState<Array<NodeJS.Timeout>>([]);
  const saveCallBack: any = useRef();

  const callBack = () => {
    if (open ) {
      setValue(5);
      return
    } 
    if (value <= 1) {
      setTriggerResetData(getRandomKey())
      setValue(5);
      return
    }
    setValue(value - 1);
  };

  useEffect(() => {
    saveCallBack.current = callBack;
    return () => { };
  });
  // useEffect(() => {
  //   document.title = "Raw Material Boxes Management";
  //  }, [])
  useEffect(() => {
    document.title = "Awaiting Dispatch";
    const tick = () => {
      saveCallBack.current();
    };
    const timer: NodeJS.Timeout = setInterval(tick, 60000);
    timers.push(timer);
    setTimers(timers);
    console.log(timers);
    return () => {
      clearInterval(timer);
    };
  }, []);


  const setColumnModel = () => {
    let newModel: any = [...SalesOrderManagementColumnModel('awaiting')]
      .filter((row: any) => row.title !== 'Stage' 
      && row.title !== 'Paid' 
      && row.title !== 'Order Details'
      && row.title !== 'Required Date'
      && row.title !== 'Created By')
    let index = newModel.findIndex((e:any)=>{
      return e.title == 'Required Date'
    })
    //newModel.splice(index,1)

    let index2 = newModel.findIndex((e:any)=>{
      return e.title == 'Location'
    })
    newModel[index2].lookup =
        { 1: 'New', 3: 'Approved', 10: 'Production', 11: 'Warehouse' }
    // newModel.push({
    //   title: 'Urgent',
    //   field: 'deliveryAsap',
    //   // defaultSort: 'desc',
    //   lookup: {0: 'No', 1: 'Yes'},
    //   render: (rowData: any) => rowData.deliveryAsap ? <b style={{color: 'red'}}>Yes</b> : <span>No</span>
    // })


 
    newModel = newModel.map((row: any) => (
      row.title === 'Items' &&
      ({
        ...row,
        filtering: true,
        editable: 'never',        
        // lookup: {0: 'Not Dispatch', 1: 'Dispatching'},
        // customFilterAndSearch: (filterValue: any, rowData: any) => {
        //   let result=false;
        //   rowData.orderProduct.map((e:any)=>{
        //     if (e?.product?.productName?.toUpperCase().includes(filterValue.toUpperCase())) result=true;
        //   })
        //   return result
        // },
        customFilterAndSearch: (filterValue: any, rowData: any) =>myfiler(filterValue,rowData),
        render: (rowData:any) => renderOrderProduct(rowData, true)
      })) || row

    )
 
    return newModel
  }

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    setTriggerResetData(getRandomKey())
  }

  // const dispatchedDialog = (orderData: any) => <DispatchedTable orderId={orderData?.orderId} />
  const salesOrderProductManagementDialog = (orderData: any) => <SalesOrderProductManagementDialog isAwaitingDispatchPage={true} isDispatchPage={true} isNewOrder={false} onDialogClose={onDialogClose} orderData={orderData} />
  
  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Finish',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        const result = await SweetAlertService.confirmMessage()
        if (result) {
          ApiRequest({
            url: 'SalesOrder/FinishDispatch?id=' + rowData.orderId,
            method: 'put'
          }).then(_ => {
            setTriggerResetData(getRandomKey())
          })
        }
      }
    },
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Handle',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('Handle Dispatch')
        setDialogContent(salesOrderProductManagementDialog(rowData))
        console.log('data#7653213!!!!', rowData)
      }
    }
  ]

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
	    renderData.push({
		    ...row,
		    cityId: row.deliveryCityId,
		    city: row.deliveryCity,
        requiredDate1: row.requiredDate,
        orderDate1: row.orderDate,
		    deliveryDate: row.deliveryDate && (new Date(row.deliveryDate + '.000Z')).toDateString(),
		    orderDate: row.orderDate && (new Date(row.orderDate + '.000Z')).toDateString(),
		    requiredDate: row.requiredDate && (new Date(row.requiredDate + '.000Z')).toDateString()
	    })
    })
    return renderData
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.AwaitingDispatch,
    title: 'Awaiting Dispatch',
    column: setColumnModel(),
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
    actionButtons: actionButtons,
    isNotEditable: true,
    isNotAddable: true,
    isNotDeletable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
      { value<refreshTime &&<div style={{position:'fixed',marginTop:"0px",right:"400px",zIndex:999,border:"solid 1px",padding:"10px",color:"red"}}>Refresh in {value} minutes!</div>}            
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={dialogContent} />
    </div>
  )
}

export default AwaitingDispatchList
