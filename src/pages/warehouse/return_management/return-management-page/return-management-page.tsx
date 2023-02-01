import React, { useEffect, useState } from 'react'
import CommonTable from '../../../../components/common/common-table/common-table'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { ReturnManagementColumnModel } from './return-management-column-model'
import { ReturnColumnModel } from './return-column-model'
import { Button, Col, Form, Input, Row, Tooltip, Table, Checkbox, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import { commonFormSelect } from './../../../../components/common/common-form/common-form-select'
import moment from 'moment'
import { getCookie } from 'react-use-cookie'
import ConfirmReturnDialog from '../confirm-return-dialog'
import CommonDialog from '../../../../components/common/others/common-dialog'
import ReturnSlipPdfGenerate from '../../../static/pdf/return-slip/return-slip-pdf-generate'

const { Option } = Select

const ReturnManagementPage = (): any => {
  const [form] = Form.useForm()
  const [data, setData] = useState<any>()
  const [selectedRows, setSelectedRows] = useState<any>()
  const [palletOptions, setPalletOptions] = useState<any>([])
  const [selectedPallet, setSelectedPallet] = useState<any>()
  const [dispatching, setDispatching] = useState<any>()
  const [returnList, setReturnList] = useState<any>()  
  const [flag, setFlag] = useState<boolean>(false) 
  const [buttonTitle, setButtonTitle] = useState<any>("Query History")
  const [extraAddress, setExtraAddress] = useState<any>()
  const [deliveryMethod, setDeliveryMethod] = useState<any>()
  const [confirmOpen, setConfirmOpen] = useState<any>()
  const [selectedReturnData, setSelectedReturnData] = useState<any>()
  const [invoiceData, setInvoiceData] = useState<any>()

  const [returnReason, setReturnReason] = useState<any>()
  const [creditOrReplace, setCreditOrReplace] = useState<any>()
  const [selectedExtraAddressId, setSelectedExtraAddressId] = useState<any>()
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<any>()

  

  const getPalletData = () => {
    ApiRequest({
      url: 'Plate/GetAvailablePlate',
      method: 'get',
      isShowSpinner: true
    }).then(resPlate => {
      setPalletOptions(resPlate.data.data)
    })
  }
  const getDeliveryMethodData = () => {
    ApiRequest({
      url: 'DeliveryMethod/GetAllDeliveryMethod',
      method: 'get',
    }).then(res => {
      setDeliveryMethod(res.data.data)
      console.log(res.data.data)
    })
  }
  const showReturnData = () => {
      if (flag==false){
        getReturnData();
        setButtonTitle("New Record");
      }
      else{
        setButtonTitle("Query History");
      }
      setFlag(!flag);
  }
  const getReturnData = () => {
    ApiRequest({
      url: 'Dispatching/GetReturnItem',
      method: 'get',
      isShowSpinner: true
    }).then(res => {
      res.data.data.map((e:any)=>{
        e.createdBy = e.employee?.firstName
        e.packingSlip = e.dispatch?.packingSlipNo
        e.customer = e.dispatch?.order?.customer?.customerCode
      })
      setReturnList(res.data.data)
    })
 
  }  
  useEffect(() => {
    document.title = "Return Management";
    getPalletData()
    getDeliveryMethodData()
  }, [])


  const handleSubmit = async(value: any) => {
    console.log(selectedPallet) 
    console.log(selectedRows)      
    console.log(dispatching) 
    const groupData = groupByProd(selectedRows);
    let text = 'You will return PackingSlip '+dispatching.packingSlipNo+"<br>";
    groupData.map((e:any) =>{
      text = text + e.productName +'*'+e.boxQuantity+"Cartons,"+e.quantity+"pcs"+"<br>"
    })
    const res = await SweetAlertService.confirmMessage(text)
    if (!res) return
    const sumbitData = {
      dispatchingId: dispatching.dispatchId,
      plateId: selectedPallet,
      boxIds: selectedRows.map((e:any) => {return e.boxId }),
      OperEmployeeId: parseInt(getCookie('id'))
    }
    const submitDispatchDatta = {
      dispatchingId: dispatching.dispatchId,
      plateId: selectedPallet,
      boxIds: selectedRows.map((e:any) => {return e.boxId }),
      OperEmployeeId: parseInt(getCookie('id')),
      reason: returnReason,
      creditReplacement: creditOrReplace,
      returnAddressId: selectedExtraAddressId,
      deliveryMethodId: selectedDeliveryMethod
    }
    ApiRequest({
      url: 'Dispatching/ReturnItem',
      data: dispatching.status === 1 ? sumbitData : submitDispatchDatta,
      method: 'post'
    }).then((res: any) => {
      // console.log(res)
      setData(null)
      setDispatching(null)
      setSelectedPallet(null)
      getPalletData()
      SweetAlertService.successMessage();
    })    
  }
  const groupByProd = (selectedRows:any)=> {
    const unique_product:any = [];

    selectedRows.forEach((value:any) => {
      let obj = {
        productId:value.productId,
        productName:value.productName
      };
      if (!unique_product.find((e:any) => e.productId == obj.productId)) {
        unique_product.push(obj);
      }
    });
    unique_product.map((u:any)=>{
      u.quantity=0;
      u.boxQuantity=0;
      selectedRows.map((s:any)=>{
        if (u.productId == s.productId){
          u.quantity = u.quantity + s.quantity;
          u.boxQuantity ++;
        }
      })
    })
    console.log(unique_product)
    return unique_product
  }
  const onChangePlate = (value: any) => {
    setSelectedPallet(value)
  }

  const onSelectionChange = (rows: any) => {
    console.log(rows)
    setSelectedRows(rows)
  }

  const formFinishHandler = (values: any) => {
    ApiRequest({
      url: 'Dispatching/GetByBoxCodeOrPackingSlipNo?NO=' + values.CodeNumber,
      method: 'get'
    }).then((res: any) => {
      // console.log(res)
      const tabledata = transferData(res.data.data.dispatchingDetails)
      setData(tabledata)
      setDispatching(res.data.data)
      setSelectedPallet(null)
      const customerId = res.data.data.order.customerId
      ApiRequest({
        url: 'ExtraAddress/GetAllExtraAddress?customerId=' + customerId,
        method: 'get'
      }).then((res: any) => {
        setExtraAddress(res.data.data)
      })
      const orderId = res.data.data.order.orderId
      ApiRequest({
        url: 'Invoice/GetAllInvoice?orderId='+orderId,
        method: 'get',
        isShowSpinner: true
      }).then(res => {
        // res.data.data.length>0;
        setInvoiceData(res.data.data)
      }) 
      resetInput();   
    }).catch((err:any) => {
      setData(null)
      setDispatching(null)
    })
  }
  const resetInput = () => {
    setReturnReason(null);
    setCreditOrReplace(null);
    setSelectedExtraAddressId(null);
    setSelectedDeliveryMethod(null);
  }
  const transferData = (data: any) => {
    data.map((e: any) => {
      e.barCode = e.box.barCode
      e.productName = e.box.product.productName
    })
    return data
  }

  const submitValid = () => {
    return invoiceData.length == 0 ? false :
      ((!returnReason || !(creditOrReplace !=null) || !selectedExtraAddressId || !selectedDeliveryMethod) ? true : false)
  }

  const onConfirm = (rowData: any) => {
    console.log(rowData)
    setSelectedReturnData(rowData)
    setConfirmOpen(true)
  }

  const getBlob = (filename:any,blob?:any) => {
    const blobURL = URL.createObjectURL(blob)
    const downloadlink = document.createElement('a')
    downloadlink.href = blobURL
    downloadlink.download = filename
    document.body.appendChild(downloadlink)
    downloadlink.click()
    document.body.removeChild(downloadlink)
  }

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

  const arrayDeduplication = (arr:Array<any>) => {
    const result:Array<any> = []
    const obj:any = {}
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i].product]) {
        result.push(arr[i])
        obj[arr[i].product] = true 
      }
    }
    return result
  }

  const onDownloadPDF = async (rowData: any) => {
    console.log(rowData)

    const carton = rowData.returnDetail.map((res:any) => {
      return {
        product: res.box.product.productCode,
        quantity: res.box.quantity,
        description: res.box.product.productName,
        carton: rowData.returnDetail.filter((res1:any) => res1.box.productId === res.box.productId &&
          res1.box.quantity === res.box.quantity).length
      }
    })

    console.log(carton)

    const sorted = groupBy(carton, function(item:any) {
      return [item.product, item.quantity]
    })

    const finalCarton = sorted.map((res:any) => {
      const sum = res.reduce((accumulator:any, currentValue:any) => accumulator + currentValue.quantity, 0)
      return arrayDeduplication(res).map((res:any) => {
        res.sum = sum
        return res
      })
    })

    console.log(finalCarton)

    ApiRequest({
      url: 'ExtraAddress/GetAllExtraAddress?customerId=' + rowData.dispatch.order?.customerId,
      method: 'get'
    }).then((res: any) => {
      const data = res.data.data
      const address = data.filter((item: any) => item.addressId === rowData.returnAddressId)[0]?.address

      const obj = {
        tableContent: finalCarton.flat(Infinity).sort((a, b) => a.product.localeCompare(b.product)),
        customerName: rowData.customer,
        packingSlip: rowData.packingSlip,
        creditNote: rowData.invoiceNote,
        collectionAddress: address,
        collectionMethod: deliveryMethod.filter((item: any) => item.deliveryMethodId === rowData.deliveryMethodId)[0]?.deliveryMethodName,
        issueDate: rowData.createdAt,
        reason: rowData.reason,
        originalPo: rowData.dispatch.order.custOrderNo,
        claimNo: rowData?.returnNo
      }

      const filename = rowData.returnNo + '_' + rowData.customer
      ReturnSlipPdfGenerate(obj, 'getBlob', getBlob, filename)
    })
  }

  const handleConfirmReturnDialog = <ConfirmReturnDialog onDialogClose={() => {setConfirmOpen(false);getReturnData()}} selectedReturnData={selectedReturnData}/>


  const renderPackingSlip: JSX.Element = (
    <div >
      {
        // dispatching?.status === 2 &&
        invoiceData?.length>0 &&
        <div style={{ display: 'flex' }}>
          <Row>
            <Col span={4}><b>*Reason for return/credit: </b></Col>
            <Col span={4} >
              <Input  style={{ width: 240 }} value={returnReason}  onChange={(e: any) => setReturnReason(e.target?.value)} />
            </Col>
            <Col span={4}><b>*Credit or replacement: </b></Col>
            <Col span={4} >
              {/* <span>*Credit or replacement: </span> */}
              <Select style={{ width: 240 }} value={creditOrReplace} onChange={(e: any) => setCreditOrReplace(e)}>
                <Option value={1}>Credit</Option>
                <Option value={0}>Replacement</Option>
              </Select>
            </Col>
            <Col span={4}><b>*Customer address: </b></Col>

            <Col span={4} style={{ padding: '6px' }}>
              {/* <span>*Customer address: </span> */}
              <Select style={{ width: 240 }} value={selectedExtraAddressId} onChange={(e: any) => setSelectedExtraAddressId(e)}>
                {extraAddress &&
                  extraAddress.map((item: any) => <Option key={item.addressId} value={item.addressId}>{item.address}</Option>)
                }
              </Select>
            </Col>

            <Col span={4}><b>*Delivery method: : </b></Col>
            <Col span={4} style={{ padding: '6px' }}>
              {/* <span>*Delivery method: </span> */}
              <Select style={{ width: 240 }} value={selectedDeliveryMethod} onChange={(e: any) => setSelectedDeliveryMethod(e)}>
                {deliveryMethod &&
                  deliveryMethod.map((item: any) => <Option key={item.deliveryMethodId} value={item.deliveryMethodId}>{item.deliveryMethodName}</Option>)
                }
              </Select>
            </Col>
            <Col span={8}><b style={{color:'red'}}>This order has generated Invoice </b></Col>            
          </Row>
        </div>
      }  
      {dispatching && (
        <div style={{ fontSize:'17px',borderStyle:'groove'}}>
          <Row>
              <Col span={6}>
              <span style={{ fontWeight:'bold'}}>Customer: </span>
              {dispatching.order.customer.company}-{dispatching.order.customer.customerCode}
              </Col><Col span={4}>
              <span style={{ fontWeight:'bold'}}>PackingSlip No: </span>
              {dispatching.packingSlipNo}
              </Col><Col span={4}>
              <span style={{ fontWeight:'bold'}}>Courier: </span>{dispatching.courier?.courierName ? dispatching.courier?.courierName : ''}
              </Col><Col span={4}>
              <span style={{ fontWeight:'bold'}}>Delivered At: </span>
              {dispatching.deliveredAt?moment.utc( dispatching.deliveredAt).local().format('DD/MM/YYYY'):""}
              </Col><Col span={4}>
              <span style={{ fontWeight:'bold'}}>Status: </span>
              {dispatching.order.orderStatus.orderStatusName}
              </Col>
           </Row>
           <div style={{ marginTop:'10px'}}>
           <Row>
              {dispatching.dispatchingGroup.map((row: any,index: number) => (
                <Col key={index} span={4}><span style={{ fontWeight:'bold'}}>{row.productCode}</span>:{row.quantity}</Col>
              ))}
            </Row>
           </div>
 

        </div>
      )}
    </div>
  )

  return (
    <div>
      <Row>
        <Col span={8}>
          <h3>Returns Management</h3>
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={showReturnData}>
            { buttonTitle}
          </Button>
        </Col>
      </Row>
      {!flag &&
        <div>
          <Form form={form} onFinish={formFinishHandler}>
            <Row>
              <Col span={8}>
                <Form.Item name="CodeNumber" label="BarCode OR Packing Slip" rules={[{ required: true, message: 'You need to input' }]}>
                  <Input style={{ width: 260 }} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Tooltip title="search">
                  <Button type="primary" shape="circle" htmlType="submit" icon={<SearchOutlined />} />
                </Tooltip>
              </Col>
              {selectedRows?.length > 0 && <Col span={6}>
                {commonFormSelect(urlKey.Plate, palletOptions, ['plateCode'], false, onChangePlate, null, 'Select a Pallet', selectedPallet)}
              </Col>}
              {selectedRows?.length > 0 && <Col span={4}>
                <Button type="primary" onClick={handleSubmit} disabled={!selectedPallet || submitValid()}>
                  Submit
                </Button>
              </Col>}
            </Row>
          </Form>
          {renderPackingSlip}
          <CommonTable title={'Packing Slip Details'} column={ReturnManagementColumnModel} initData={data}
            isEnableSelect={true} onSelectionChange={onSelectionChange} />
        </div>
      }
      {flag &&
        <CommonTable title={'Returns List'} column={ReturnColumnModel(onConfirm, onDownloadPDF)} initData={returnList}
        />
      }
      <CommonDialog width={'37%'} title={'Confirm Return Slip'} open={confirmOpen} onDialogClose={() => setConfirmOpen(false)} dialogContent={handleConfirmReturnDialog} />
    </div>
  )
}

export default ReturnManagementPage
