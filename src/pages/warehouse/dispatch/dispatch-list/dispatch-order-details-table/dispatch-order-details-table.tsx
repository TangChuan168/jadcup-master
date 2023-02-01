import React, { useEffect, useState } from 'react'
import CommonTablePage from '../../../../../components/common/common-table/common-table-page'
import {urlKey, urlType} from '../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../services/api/api'
import CommonDialog from '../../../../../components/common/others/common-dialog'
import DispatchLocationTable from './dispatch-location-table/dispatch-location-table'
import {Button, Col, Input, Row , Form} from 'antd'
import SweetAlertService from '../../../../../services/lib/utils/sweet-alert-service'
import CommonForm, {ItemElementPropsInterface} from '../../../../../components/common/common-form/common-form'
import {commonFormSelect, getSelectOptions} from '../../../../../components/common/common-form/common-form-select'
import {DispatchOrderDetailsColumnModel} from './dispatch-order-details-column-model'
import { getCookie } from 'react-use-cookie'
import { data } from 'jquery'


const DispatchOrderDetailsTable = (props: {orderId: any, dispatchData?: any, isDispatchUpdate?: boolean, onDialogClose: any, orderData?:any, plateType?:any, balance?:any }):any => {
  const [form] = Form.useForm() 
  const [orderId, setOrderId] = useState<any>()
  const [tableData, setTableData] = useState<any>()
  const [requestData, setRequestData] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [orderProductData, setOrderProductData] = useState()
  const [selectedRows, setSelectedRows] = useState<any>()
  // const [selectAsDeliveredRows, setSelectAsDeliveredRows] = useState<any>()
  // const [selectAsCompleteRows, setSelectAsCompleteRows] = useState<any>()
  const [courierOptions, setCourierOptions] = useState([])
  const [formRef, setFormRef] = useState<any>()
  const [orderProductWithDetails, setOrderProductWithDetails] = useState<any>([])
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [palletType, setPalletType] = useState<string>();
  const [quantity, setQuantity] = useState<string>();  

  const onDialogClose = (selectedDataInfo: any) => {
    setOpen(false)
    if (selectedDataInfo?.details) {
      console.log(selectedDataInfo)
      setRequestDataFormSelectedRows(selectedDataInfo)
      setOrderProductWithDetails(getCurrentOrderProductWithDetails(selectedDataInfo))
      setTriggerResetData(!triggerResetData)
    }
  }

  const getCurrentOrderProductWithDetails = (selectedDataInfo: any) => {
    const restedArr = orderProductWithDetails.filter((row: any) => row.orderProductId !== selectedDataInfo.orderProductId)
    return [...restedArr, selectedDataInfo]
  }

  const dispatchLocationTable = <DispatchLocationTable onDialogClose={onDialogClose} isUpdate={props.isDispatchUpdate} dispatchData={props.dispatchData} orderProductData={orderProductData} orderId={orderId} orderProductWithDetails={orderProductWithDetails} />

  useEffect(() => {
    getSelectOptions(urlKey.Courier).then(res => setCourierOptions(res))
  }, [])

  useEffect(() => {
    if (!orderId && props.orderId) {
      setOrderId(props.orderId)
    }
  }, [orderId, props.orderId])

  const setRequestDataFormSelectedRows = (selectedDataInfo: any) => {
    const filteredRequestData: any = requestData.filter((item: any) => item.orderProductId !== selectedDataInfo.orderProductId)
    setRequestData([...filteredRequestData, ...selectedDataInfo.details])
  }

  const onCreateDispatch = () => {
    console.log('dispatch btn #222',requestData)
    console.log('button works dispatch page$ 345')
    //debugger;
    
    if (requestData?.length) {
      const requestDataLightfy = requestData.map((e:any)=>{
        return {
          boxId:e.boxId,
          productId:e.productId,
          quantity:e.quantity
        }
        })
        const datas ={
          OrderId: orderId,
          dispatchingDetails:requestDataLightfy,
          EmployeeId:parseInt(getCookie('id')),//
          DispatchId:'',//
          PlateTypeId:props.plateType.PlateTypeId,//
          CustomerId:props.orderData.customerId,//
          TranTypeId:1,
          Balance:parseInt(props.balance.plateQty),
          Quantity:parseInt(props.balance.plateQty),
          Notes:'',
          CreatedAt:null,
          StockId:'',
        }
        console.log('data',datas);
        ApiRequest({
          url: 'Dispatching/AddDispatching',
          data:datas,
          method:'post'
        }).then((res: any) => {
          console.log(res)
          props.onDialogClose(true, res.data.data)
        })
    };
    
  }

  const onUpdateDispatch = () => {
    // console.log(requestData)
    if (requestData?.length) {
      ApiRequest({
        url: 'Dispatching/UpdateDispatching',
        data: {
          dispatchId: props.dispatchData.dispatchId,
          dispatchingDetails: requestData
        },
        method: 'put'
      }).then((res: any) => {
        props.onDialogClose(true, props.dispatchData.dispatchId)
      })
    }
  }

  const onCompleteDispatch = async () => {
    if (formRef) {
      formRef.submit()
      const formValues = await formRef.validateFields()
      if (formValues) {
        console.log(formValues)
        console.log(props.dispatchData)
        console.log(tableData)
        const requestValues: any = {
          ...formValues,
          dispatchId: props.dispatchData.dispatchId,
          orderProducts: tableData.map((row: any) => ({
            orderProductId: row.orderProductId,
            deliveredQuantity: props.dispatchData.dispatchingDetails.reduce(((a: any, c: any) => a + (c.productId === row.productId ? c.quantity : 0)), 0),
            delivered: row.selectedQty >= ((props.dispatchData.dispatchingDetails.filter((d:any) => d.productId === row.productId)).quantity) ? 1 : 0
          }))
        }
        ApiRequest({
          url: 'Dispatching/CompleteDispatching',
          method: 'put',
          data: requestValues
        }).then(_ => {
          props.onDialogClose(true)
        })
      }
    } else {
      SweetAlertService.errorMessage('Please fill the form.')
    }
  }

  const getRenderData = async () => {
    console.log(orderProductWithDetails)
    const result = await ApiRequest({
      url: 'SalesOrder/GetOrderById?id=' + orderId,
      method: 'get',
    })
    console.log(result.data.data.orderProduct)
    const renderData: any = result.data.data.orderProduct.map((row: any) => {
      return {
        ...row,
        quantity: row.quantity * row.product.baseProduct.packagingType.quantity,
        delivered: row.delivered ? 1 : 0,
        selectedQty: orderProductWithDetails.filter((item: any) => item.orderProductId === row.orderProductId)[0]?.details?.reduce((a: any, c: any) => a + c.quantity, 0) ||
          props.dispatchData?.dispatchingDetails.filter((item: any) => item.productId === row.productId).reduce((a: any, c: any) => a + c.quantity, 0)
      }
    }) || []
    setTableData(renderData)
    return renderData
  }

  const actionButtons: any = props.dispatchData && !props.isDispatchUpdate ?
    [
      // {
      //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
      //   tooltip: 'Select as delivered',
      //   isFreeAction: false,
      //   onClick: (event: any, rowData: any) => {
      //     if (selectedRows?.length) {
      //       setSelectAsDeliveredRows(selectedRows)
      //       SweetAlertService.successMessage()
      //     }
      //   }
      // },
      // {
      //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
      //   tooltip: 'Select as complete',
      //   isFreeAction: false,
      //   onClick: (event: any, rowData: any) => {
      //     if (selectedRows?.length) {
      //       setSelectAsCompleteRows(selectedRows)
      //       SweetAlertService.successMessage()
      //     }
      //   }
      // }
    ] :
    [
      {
        icon: 'ghost', //Button attr of Ant design (danger, ghost)
        tooltip: 'Locations',
        isFreeAction: false,
        onClick: async (event: any, rowData: any) => {
          if (rowData.deliveredQuantity>=rowData.quantity){
            SweetAlertService.errorMessage("Aleardy deliveried");
            return
          }
            
          if (props.isDispatchUpdate) {
            const result = await ApiRequest({
              urlInfoKey: urlKey.OrderProduct,
              type: urlType.GetById,
              dataId: rowData.orderProductId
            })
            if (result) {
              setOpen(true)
              setOrderProductData(result.data.data)
            }
          } else {
            setOpen(true)
            setOrderProductData(rowData)
          }
          setDialogTitle(props.isDispatchUpdate 
              ? 'Locations - Update:'+ rowData.product.productCode
              : 'Locations - Create:'+ rowData.product.productCode)
        }
      }
    ]

  const onSelectionChange = (rows: any) => {
    setSelectedRows(rows)
  }

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'courierId', label: 'Courier', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Courier, courierOptions)},
    {name: 'trackingNo', span:10, label: 'Tracking No', rules: [{required: true}], inputElement: <Input />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  return orderId ? (
    
    <div>

      <CommonTablePage
        urlInfoKey={urlKey.City}
        title="Order Details"
        column={DispatchOrderDetailsColumnModel()}
        mappingRenderData={(data: any) => getRenderData()}
        actionButtons={actionButtons}
        isNotEditable={true}
        isNotDeletable={true}
        isNotAddable={true}
        isEnableSelect={false}
        triggerResetData={triggerResetData}
        onSelectionChange={onSelectionChange}
      />
      {/* <Form form={form} >
        <Row>
          <Col span={6}>
            <Form.Item name="palletType" label="Pallet Type" rules={[{ required: true, message: 'You need to input' }]}>
              <Input style={{ width: '100%' }} id="palletType" onChange={(e: any) => setPalletType(e.target?.value)}></Input >
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'You need to input' }]}>
              <Input style={{ width: '100%' }} id="quantity" onChange={(e: any) => setQuantity(e.target?.value)}></Input >
            </Form.Item>
          </Col>
        </Row>
      </Form>   */}
      {props.dispatchData && !props.isDispatchUpdate ? <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} /> : null}
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <button
          onClick={props.dispatchData ? (props.isDispatchUpdate ? onUpdateDispatch : onCompleteDispatch) : onCreateDispatch }
          
        >{props.dispatchData ? (props.isDispatchUpdate ? 'Update dispatch' : 'Complete') : 'Create dispatch'}</button>
      </div>
      <CommonDialog
        title={dialogTitle}
        open={open}
        onDialogClose={onDialogClose}
        dialogContent={dispatchLocationTable}
      />
    </div>
  ) : null
}

export default DispatchOrderDetailsTable
