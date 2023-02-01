import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../../components/common/common-table/common-table-page'
import React, { useRef,useState ,useEffect} from 'react'
import StockMonitorColumnModel from './stock-monitor-column-model'
import { urlKey, urlType } from '../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'
import CommonDialog from '../../../../../components/common/others/common-dialog'
import SalesOrderManagementPage from '../../../sales-order/sales-order-management-page'
import WorkOrderManagementPage from '../work-order-management-page/work-order-management-page'
import { getCookie } from 'react-use-cookie'
import Swal from 'sweetalert2'
import { getRandomKey } from '../../../../../services/lib/utils/helpers'

const refreshTime=5;

const StockMonitorPage = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<any>()
  const [value, setValue] = useState<number>(refreshTime);
  const [timers, setTimers] = useState<Array<NodeJS.Timeout>>([]);
  const saveCallBack: any = useRef();

  const callBack = () => {
    if (open ) {
      setValue(5);
      return
    } 
    if (value <= 1) {
      setTriggerResetData(!triggerResetData)
      setValue(5);
      return
    }
    setValue(value - 1);
  };

  useEffect(() => {
    saveCallBack.current = callBack;
    return () => { };
  });

    useEffect(() => {
    document.title = "Product Inventory";
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

  // useEffect(() => {   
  //   document.title="Product Inventory"
  // }, [])
  const updateQuantity = async (rowData: any, isSemi: boolean) => {
    const employeeId = parseInt(getCookie('id'))
    const defaultQty = isSemi ? rowData.suggestedSemiQuantity : rowData.suggestedQuantity
    console.log(defaultQty)
    // const result = await SweetAlertService.inputConfirm({type: 'number', title: 'New WorkOrder', placeholder: 'qty', defaultValue: defaultQty})
    const result:any =  await Swal.fire ({
      title: 'Create a work order',
      html:
        '<div ><div><label for="orderquantity">Order QTY:  </label>'+
        '<input id="orderquantity" type="number" style="width:200px" value="'+defaultQty+'" class="swal2-input" placeholder="Quantity">' +
        '</div><div><label for="ordernote"> Order Note:  </label>'+
        '<input style="width:200px" id="ordernote" class="swal2-input" placeholder="Note">'+
        '</div><div><label for="requirdate"> REQ   Date: </label>'+
        '<input id="requirdate" type="date" style="width:200px" value='+moment().add(14, 'days')+'class="swal2-input" placeholder="Require Date">'+
        '</div></div>',
      showCancelButton: true,        
      onOpen: () => {
          ( document.getElementById("requirdate")  as HTMLInputElement).valueAsDate = moment().add(14,'days').toDate() ;
        },        
      preConfirm: () => ({
        orderquantity: document.getElementById("orderquantity"),
        ordernote: document.getElementById("ordernote"),
        requirdate: document.getElementById("requirdate"),
      })
    });
    console.log(result)
    if (result.isConfirmed==false) return;
    // let ress :any = result
    // console.log(result.value.orderquantity.value)
    // console.log(result.value.ordernote.value)
    // console.log(result.value.requirdate.value)
    // console.log((HTMLElement)(result.value?.listener))
    // return 
    if (result.value?.orderquantity.value !== null) {
      let qty = result.value?.orderquantity.value || defaultQty
      qty = parseInt(qty)
      if (qty <= 0) {
        await SweetAlertService.errorMessage('Please input a valid qty')
        return
      }
      const confirmResult = await SweetAlertService.confirmMessage('A new work order with ' + qty + ' qty will be created.')
      if (confirmResult) {
        ApiRequest({
          urlInfoKey: urlKey.WorkOrder,
          type: urlType.Create,
          data: {
            orderTypeId: isSemi ? 2 : 1,
            productId: rowData.productId,
            quantity: qty,
            comments:result.value.ordernote.value??"",
            requiredDate: ( result.value.requirdate.value!="")
                ?result.value.requirdate.value:moment().add(2, 'weeks'),
            urgent: 0,
            workOrderSourceId: 3,
            workOrderStatusId: 1,
            createdEmployeeId:employeeId,
            approvedEmployeeId:employeeId            
          }
        }).then(_ => {
          setTriggerResetData(!triggerResetData)
        })
      }
    }
  }

  const getRenderData = (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        low: row.low ? 1 : 0,
        suggestedQuantity: row.productInventoryInfo?.suggestedQuantity,
        suggestedSemiQuantity: row.semiProductInventoryInfo?.suggestedSemiQuantity,
      })
    })
    console.log(renderData)
    return renderData
  }

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Sales Order',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('Sales Order - ' + rowData.productName)
        setDialogContent(<SalesOrderManagementPage stockMonitorProductId={rowData.productId} />)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Work Order',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('Work Order - ' + rowData.productName)
        setDialogContent(<WorkOrderManagementPage stockMonitorProductId={rowData.productId} />)
      }
    }
  ]

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.StockMonitor,
    title: 'Stock Monitor',
    column: StockMonitorColumnModel({
      updateQuantity: updateQuantity,
    }),
    mappingRenderData: (data: any) => getRenderData(data),
    triggerResetData: triggerResetData,
    isNotEditable: true,
    isNotDeletable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: true,
    actionButtons: actionButtons
  }

  return (
    <div>
      { value<refreshTime &&<div style={{position:'fixed',marginTop:"0px",right:"400px",zIndex:999,border:"solid 1px",padding:"10px",color:"red"}}>Refresh in {value} minutes!</div>}                  
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog open={open} title={dialogTitle} onDialogClose={() => setOpen(false)} dialogContent={dialogContent} />
    </div>
  )
}

export default StockMonitorPage
