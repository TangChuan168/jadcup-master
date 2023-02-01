import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../../components/common/common-table/common-table-page'
import React, { useRef, useState,useEffect } from 'react'
import WorkOrderManagementColumnModel from './work-order-management-column-model'
import { urlKey } from '../../../../../services/api/api-urls'
import WorkOrderAddDialog from './work-order-add-dialog/work-order-add-dialog'
import CommonDialog from '../../../../../components/common/others/common-dialog'
import { ApiRequest } from '../../../../../services/api/api'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import { getRandomKey, nsStr } from '../../../../../services/lib/utils/helpers'
import SuborderCommonMachineList from '../../operator/suborder-list/suborder-common-machine-list'

const refreshTime=5;
const WorkOrderManagementPage = (props: {stockMonitorProductId?: any}) => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [isShowSpinner, setIsShowSpinner] = useState(true)
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [selectedMachine, setSelectedMachine] = useState<any>()
  const [footer, setFooter] = useState<any>()
  const [handleMachinesShown, setHandleMachinesShown] = useState<boolean>(false)

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

   useEffect(() => {
    document.title = "Work Order";
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

  const onDialogClose = (isModified: boolean) => {
    setIsShowSpinner(false)
    setOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }

  const updateApproveStatus = async (rowData: any) => {
    const result = await SweetAlertService.inputConfirm({type: 'textarea', title: 'WorkOrder Approve', placeholder: 'Comment', defaultValue: rowData.comments, handleRequired: true})
    if (result !== undefined) {
      ApiRequest({
        url: 'WorkOrder/ApproveWorkOrder?id=' + rowData.workOrderId + '&approvedComment=' + result,
        method: 'put'
      }).then(_ => {
        setTriggerResetData(getRandomKey())
      })
    }
  }

  // change work order status comments, using new put api request
  const updateStatusComments = async (rowData: any) => {
    const result = await SweetAlertService.inputConfirm({type: 'textarea', title: 'Change Comments', placeholder: 'Comment', defaultValue: rowData.comments})
    if (result ) {
      ApiRequest({
        url: 'WorkOrder/WorkOrderComments?id=' + rowData.workOrderId + '&comments=' + result,
        method: 'put'
      }).then(_ => {
        setTriggerResetData(getRandomKey())
      })
    }
  }

  const updateQuantity = async (rowData: any) => {
    const result = await SweetAlertService.inputConfirm({type: 'number', title: 'Update Quantity', placeholder: 'qty'})
    if (result !== null) {
      if (!result) {
        await SweetAlertService.errorMessage('Please type in quantity before submitting')
        return
      } else {
        console.log(result)
        ApiRequest({
          url: 'WorkOrder/UpdateWorkOrderQuantity?id=' + rowData.workOrderId + '&quantity=' + parseInt(result),
          method: 'put'
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
      }
    }
  }

  const updateUrgent = async (rowData: any) => {
    ApiRequest({
      url: 'WorkOrder/WorkOrderUrgent?id=' + rowData.workOrderId + '&urgent=' + !rowData.urgent,
      method: 'put'
    }).then(_ => {
      setTriggerResetData(getRandomKey())
    })
  }

  const workOrderProductManagementDialog = <WorkOrderAddDialog onDialogClose={onDialogClose} />

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'New WorkOrder',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('New WorkOrder')
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Show Machines',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setHandleMachinesShown(!handleMachinesShown)
      }
    }
  ]
  const onFilterChange = (tableRef: any) => {
    // setFooterInfo(tableRef.current.dataManager.searchedData)
    // debounce(setFooterInfo(tableRef.current.dataManager.searchedData),100000)
    debounce(() => setFooterInfo(tableRef.current.dataManager.searchedData),3000)
  }
  let timer:any;
  const debounce = (func:any, timeout = 1000) =>{
    console.log("debouse")
    if (timer) clearTimeout(timer) 
    timer = setTimeout(() => { func(); }, timeout);
  }  

  const setFooterInfo =  (tableRef: any) => {
    console.log("setFooterInfo")
    let total_qty = 0 ,appr_jobs=0,appr_qty=0;
    tableRef.map((e:any)=>{
      total_qty = total_qty + e.quantity
      if (e.workOrderStatusId>=1){
        appr_jobs = appr_jobs+1;
        appr_qty = appr_qty+e.quantity
      }
    })
    setFooter({
      jobs:tableRef.length,
      total_qty: total_qty,
      appr_jobs:appr_jobs,
      appr_qty:appr_qty,
      })
  }
  const getRenderData = (data: any) => {
    // console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      if (row.workOrderStatusId !== 0) {
        const newData = {
          ...row,
          actionId: row.actionDto?.actionId,
          urgent: row.urgent ? 1 : 0,
          productCode: row.product?.productCode,
          productFilter: row.product?.productName + nsStr(row.product?.productName) + ' ' + row.product?.description,
          createdEmployeeName: (row.createdEmployee?.firstName || '') + ' ' + (row.createdEmployee?.lastName || ''),
          createdAt1: row.createdAt,
          requiredDate1: row.requiredDate,
          createdAt: row.createdAt && (new Date(row.createdAt + '.000Z')).toLocaleString(),
          requiredDate: row.requiredDate && (new Date(row.requiredDate + '.000Z')).toLocaleDateString(),
          workOrderNo: row.workOrderNo && parseInt(row.workOrderNo)
        }
        if (props.stockMonitorProductId) {
          if (row.productId === props.stockMonitorProductId) {
            renderData.push(newData)
          }
        } else {
          renderData.push(newData)
        }
      }
    })
    // console.log(renderData)
    setFooterInfo(renderData);    
    return renderData
  }

  const getUpdateData = (dataDetail: any) => {
    if ([10, 0].includes(dataDetail.workOrderStatusId)) {
      SweetAlertService.errorMessage('This order is cancelled or completed, so not deletable.')
      return ''
    }
    return dataDetail
  }

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.WorkOrder,
    getAllUrl: selectedMachine?.machineId ? `/WorkOrder/GetWorkOrderByMachineId?machineId=${selectedMachine.machineId}` : `/WorkOrder/GetAllWorkOrder`,
    title: 'Work Order',
    column: WorkOrderManagementColumnModel({
      updateApproveStatus: updateApproveStatus,
      updateStatusComments: updateStatusComments,
      updateQuantity: updateQuantity,
      updateUrgent: updateUrgent,
    }),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => getUpdateData(dataDetail),
    triggerResetData: triggerResetData,
    onFilterChange: onFilterChange,    
    actionButtons: props.stockMonitorProductId ? [] : actionButtons,
    isNotDeletable: props.stockMonitorProductId,
    isNotEditable: true,
    isNotAddable: true,
    isShowSpinnerOnInit: isShowSpinner
  }

  return (
    <div>
    { value<refreshTime &&<div style={{position:'fixed',marginTop:"0px",right:"400px",zIndex:999,border:"solid 1px",padding:"10px",color:"red"}}>Refresh in {value} minutes!</div>}                  
      <div style={{display: handleMachinesShown ? 'block' : 'none'}}>
        <SuborderCommonMachineList selectMachine={(data: any) => {
          console.log(data)
          setSelectedMachine(data)
          setTriggerResetData(getRandomKey())}} areAll={true}/>
        <div style={{ marginBottom: '2rem' }}>&nbsp;</div>
      </div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={workOrderProductManagementDialog} />
      <div style={{marginTop:"-40px",marginLeft:"40px"}}>
        <span><b>Total Jobs:&nbsp;</b>{footer?.jobs}&nbsp;&nbsp;</span>
        <span><b>Total Qty:&nbsp;</b> {footer?.total_qty}&nbsp;&nbsp;</span>
        <span><b>Approved Jobs:&nbsp;</b>{footer?.appr_jobs}&nbsp;&nbsp;</span>
        <span><b>Approved Qty:&nbsp;</b> {footer?.appr_qty}&nbsp;&nbsp;</span>        
      </div>
    </div>
  )
}

export default WorkOrderManagementPage
