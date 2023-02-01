import React from 'react'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import {Modal , Button, DatePicker, Input, InputNumber, Upload } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../../services/api/api'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import moment from 'moment'
import CommonTable, { CommonTablePropsInterface } from '../../../../components/common/common-table/common-table'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import BoxesEditDialog from '../boxes-edit-dialog/boxes-edit-dialog'
import CommonDialog from '../../../../components/common/others/common-dialog'
import RawMaterialBoxEditDialog from '../raw-material-box-edit/raw-material-box-edit-dialog'
import { getUserId } from '../../../../services/lib/utils/auth.utils'
import { baseUrl } from '../../../../services/api/base-url'
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile,RcFile } from 'antd/es/upload/interface';


interface IFormValues {
  containerNo?: any
  arrivalTime?: any
  unloadingDate?: any
  unloadingPeople?: any
  spendingHours?: any
  conditionOfProduct?: any
  actualQty: any
  conditionOfPackage?: any
  takeAwayDate: any
  notes: any
  poId: any
}

interface IFormValue {
  poId: any
}

interface IPoFormValues {
  poId?: any
  price?: number
  createdEmployeeId?: any
  suplierId?: any
  poNo?: any
  poDetail?: IPoDetail[]
}

interface IPoDetail {
  rawMaterialId?: any
  quantity?: any
  price?: any
  unitPrice?: any
  comments?: string
  suplierProductCode?:string
}

const UnloadingInspectionAddDialog = (props: { unloadingInspectionData: any, onDialogClose: any, isNewUnloadingInspection: boolean ,isComplete:boolean}) => {
  console.log(props.unloadingInspectionData)
 
  const [formRef, setFormRef] = useState<any>()
  const [formRef2, setFormRef2] = useState<any>()
  const [poFormRef, setPoFormRef] = useState<any>()
  const [initPoFormValues, setInitPoFormValues] = useState<IPoFormValues>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()
  const [initFormValue, setInitFormValue] = useState<IFormValue>()
  const [tableValue, setTableValue] = useState([])
  const [poData, setPoData] = useState<any>({})
  const [open3, setOpen3] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [productId, setProductId] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // store selection options from apis request
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [supplierOptions, setSupplierOptions] = useState([])
  const [rawMaterialOptions, setRawMaterialOptions] = useState([])

  // store selection options from apis request
  //preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [poOptions, setPo] = useState([])

  useEffect(() => {
    setInitFormValues({
      ...props.unloadingInspectionData,
      arrivalTime: props.unloadingInspectionData?.arrivalTime2 && moment(props.unloadingInspectionData.arrivalTime2 + '.560Z') || moment(),
      unloadingDate: props.unloadingInspectionData?.unloadingDate2 && moment(props.unloadingInspectionData.unloadingDate2 + '.560Z') || moment(),
      takeAwayDate: props.unloadingInspectionData?.takeAwayDate2 && moment(props.unloadingInspectionData.takeAwayDate2 + '.560Z') || moment(),
    })
    setInitFormValue({
      ...props.unloadingInspectionData
    })
    if (props.unloadingInspectionData?.images){
      let tt= JSON.parse(props.unloadingInspectionData?.images).map((e:any,index:number)=>{
        return {
          uid:index.toString(),
          name: 'image.png',
          status: 'done', 
          url:e.url            
        }
      });
      setFileList(tt);
    }

    getSelectOptions('', 'PurchaseOrder/GetAllPurchaseOrder?withOutUnloding=1')
      .then(res => {
        res.map((e:any) => {
          e.poNo = e.poNo + ': ' + e.suplier.suplierName
        })
        setPo(res.filter((row: any) => row.poStatusId === 2 || row.poStatusId === 10))
      })
    getTableValue()

  }, [props.unloadingInspectionData])

  const getTableValue = async () => {
    if (!props.isNewUnloadingInspection) {
      getValues(props.unloadingInspectionData?.poId)
    }
  }

  const getValues = async (id: any) => {
    const result = await ApiRequest({
      url: 'PurchaseOrder/GetSinglePurchaseOrder?id=' + id,
      method: urlType.Get,
      isShowSpinner: false
    })
    const dataToUse = result.data.data
    setTableValue(dataToUse.poDetail)
    setPoData(dataToUse)
    console.log(dataToUse)
    const dataBeforeRev = {
      ...dataToUse,
      supplierName: dataToUse.suplier?.suplierName,
      createdEmployeeId: dataToUse.createdEmployeeId ? dataToUse.createdEmployeeId : getUserId(),
      deliveryDate: (dataToUse?.deliveryDate && moment(dataToUse.deliveryDate + '.000Z')) || null,
    }
    // !props.isNewUnloadingInspection ? setInitPoFormValues(getValuesWithRev(dataBeforeRev)) : setInitPoFormValues(dataBeforeRev)
    setInitPoFormValues(getValuesWithRev(dataBeforeRev))
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))
    getSelectOptions(urlKey.Supplier).then(res => setSupplierOptions(res.filter((e:any) => e.active)))
    if (dataToUse.suplierId) {
      getRawMaterialOptions(dataToUse.suplierId)
    }
  }

  const getValuesWithRev = (data: any) => {
    if (!props.unloadingInspectionData.unloadingDetail){
      for (let j = 0; j < data.poDetail.length; j++) {
          data.poDetail[j].revQuantity = 0;
        }
      return data      
    }
    for (let i = 0; i < props.unloadingInspectionData.unloadingDetail.length; i++) {
      for (let j = 0; j < data.poDetail.length; j++) {
        if (props.unloadingInspectionData.unloadingDetail[i].rawMaterialId === data.poDetail[j].rawMaterialId) {
          data.poDetail[j].revQuantity = props.unloadingInspectionData.unloadingDetail[i].revQuantity
        }
      }
    }

    return data
  }

  const getRawMaterialOptions = (id: any) => {
    getSelectOptions(urlKey.RawMaterial, 'SupplierRawMaterial/GetRawMaterialDtoBySupplierId?supplierId=' + id)
      .then(res => {
        const setData = res.map((e:any) => {
          return {...e, ...e.rawMaterial}
        })
        setRawMaterialOptions(setData)
      }
    )
  }
  const onChange = ( newFileList :any) => {
    // if (newFileList.file.response) {}
    // if (newFileList.file.status=='done')
      setFileList(newFileList.fileList);
  };

  const handleCancel = () => setPreviewVisible(false);

  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    // setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const continerNo = { name: 'containerNo', label: 'Container Number',span:4, rules: [{ required: true }], inputElement: <Input /> }

  const formItems: ItemElementPropsInterface[] | any = [
    { name: 'arrivalTime', label: 'Arrival Time', rules: [{ required: true }],span:4, inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{ defaultValue: moment(), use12Hours: true, format: 'HH' }} /> },
    // { name: 'unloadingDate', label: 'Unloading Date', rules: [{ required: true }],span:4, inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{ defaultValue: moment(), use12Hours: true, format: 'HH' }} /> },
    { name: 'unloadingPeople', label: 'Receiver', rules: [{ required: true }],span:4, inputElement: <Input /> },
    // { name: 'spendingHours', label: 'Spending Hours', span:4,inputElement: <InputNumber /> },
    // { name: 'takeAwayDate', label: 'Take Away Date', rules: [{ required: true }],span:4, inputElement: <DatePicker format={'YYYY-MM-DD'} showTime={{ defaultValue: moment(), use12Hours: true, format: 'HH' }} /> },
    // { name: 'actualQty', label: 'Actual Quantity', inputElement: <InputNumber /> },
    // { name: 'conditionOfPackage', label: 'Condition of Package', inputElement: <Input /> },
    { name: 'conditionOfProduct', span: 4, label: 'Condition of Product', inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } /> },
    { name: 'notes', span: 8, label: 'Notes', inputElement: <Input.TextArea showCount={true} maxLength={150} autoSize={ true } /> },
 
  ]

  const isFormDisabled = poData.poId && !(poData.poStatusId && poData.poStatusId === 1)

  const poFormItems: ItemElementPropsInterface[] | any = [
    // {name: 'poNo', label: 'PO Number', inputElement: <Input readOnly={isFormDisabled} />},
    {name: 'createdEmployeeId', label: 'Created By',span: 6, inputElement: commonFormSelect(urlKey.Employee, employeeOptions, ['firstName', 'lastName'], true)},
    {name: 'suplierId', label: 'Supplier',span: 6, rules: [{required: true}], inputElement: commonFormSelect(urlKey.Supplier, supplierOptions, [], isFormDisabled)},
    {name: 'deliveryDate', label: 'Delivery Date',span: 6, inputElement: <DatePicker disabled={true}  format={'YYYY-MM-DD'} showTime={{defaultValue: moment(), use12Hours: true, format: 'HH'}} />},
    {name: 'telNo', label: 'Telephone',span: 6, inputElement: <Input disabled={true}  />},
    {name: 'deliveryInstruction', label: 'Delivery Instruction',span: 12, inputElement: <Input disabled={true} />},
    {name: 'deliveryAddr', label: 'Address',span: 12, inputElement: <Input disabled={true} />},
    [
      {name: ['poDetail', 'rawMaterialId'],span: 6, label: 'Description', rules: [{required: true}], inputElement: commonFormSelect(urlKey.RawMaterial, rawMaterialOptions, ['rawMaterialCode','rawMaterialName'], isFormDisabled), isNotEditable: true},
      {name: ['poDetail', 'suplierProductCode'], span: 4,label: 'Product Code', inputElement: <Input disabled={true} readOnly={true} />},
      {name: ['poDetail', 'unit'],  span:2 ,label: 'Unit', inputElement: <Input disabled={true} readOnly={true} />},
      // {name: ['poDetail', 'unitPrice'],span:2 , label: 'Unit Price', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber readOnly={isFormDisabled} />},
      {name: ['poDetail', 'quantity'],span:2 , label: 'PO QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} readOnly={isFormDisabled} />},
      {name: ['poDetail', 'totalRevQty'],span:2 , label: 'Total Rev QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber disabled={true} readOnly={isFormDisabled} />},
      {name: ['poDetail', 'revQuantity'],span:2 , label: 'This Rev QTY', rules: [{required: true, type: 'number', min: 0}], inputElement: <InputNumber defaultValue={0} readOnly={false} />},
      // {name: ['poDetail', 'price'],span:2 , label: 'Price', inputElement: <InputNumber readOnly={true} />},
      {name: ['poDetail', 'comments'], label: 'Note', inputElement: <Input.TextArea style={{color:"grey"}} disabled={true} readOnly={isFormDisabled} showCount={true} maxLength={150} autoSize={ true } />},
      // {name: ['poDetail', 'completed'], label: 'Completed', inputElement: <Switch disabled={!(props.orderData?.poStatusId && props.orderData?.poStatusId === 2)} />, otherProps: {valuePropName: 'checked'}},
    ]
  ]

  const formItem: ItemElementPropsInterface[] | any = [
    { name: 'poId', label: 'Purchase Order', rules: [{ required: true }], inputElement: commonFormSelect(urlKey.PurchaseOrder, poOptions, ['poNo'], !props.isNewUnloadingInspection) },
  ]

  const onPoFormChange = async (changedValues: any, newValues: any, form: any) => {
    // setSubtotal(getSubtotal(form))
    console.log(changedValues)
    console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    if (changedValues.suplierId) {
      form.setFieldsValue({
        ...newValues,
        // deliveryAddr: supplierOptions.filter((row: any) => row.suplierId === changedValues.suplierId)[0]['address']
        deliveryAddr: '4 Pukekiwiriki Place, East Tāmaki, Auckland 2013, New Zealand',
        telNo: '+64 09-282 3988'
      })
      getRawMaterialOptions(changedValues.suplierId)
      return
    }
    if (changedValues.poDetail) {
      const poDetailIndex: any = changedValues.poDetail.length - 1
      const selectedPoDetail = newValues.poDetail[poDetailIndex]
      if (changedValues?.poDetail[poDetailIndex]?.hasOwnProperty('rawMaterialId')) {
        const formNewestValues = form.getFieldsValue()
        form.setFieldsValue({
          ...formNewestValues,
          poDetail: autoUnitPrice(formNewestValues, 'poDetail', poDetailIndex),
        })
      }
      // if (changedValues?.poDetail[poDetailIndex]?.hasOwnProperty("quantity") ||
      //   changedValues?.poDetail[poDetailIndex]?.hasOwnProperty("unitPrice")){
      //   const formNewestValues = form.getFieldsValue()
      //   form.setFieldsValue({
      //     ...formNewestValues,
      //     poDetail: autoPrice(formNewestValues, 'poDetail', poDetailIndex),
      //   })
      // }
      if (!changedValues.poDetail[poDetailIndex] || !selectedPoDetail.poDetailId) {
        return
      }
      if (!selectedPoDetail.completed) {
        // form.setFieldsValue(setPoDetailComplete(newValues, poDetailIndex, true))
        return
      }
      const result = await SweetAlertService.confirmMessage()
      if (result) {
        ApiRequest({
          url: 'PurchaseOrder/CompletePoDetail?poDetailId=' + selectedPoDetail.poDetailId,
          method: 'put',
          isShowSpinner: false
        }).then(_ => null)
      } else {
        form.setFieldsValue(setPoDetailComplete(newValues, poDetailIndex, false))
      }
    }
  }

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormChange2 = async (changedValues: any, newValues: any, form: any) => {
    const poId = changedValues['poId']
    // set poId & poNo for table
    getValues(poId)
  }

  const onPoFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!poFormRef) {
      setPoFormRef(form)
    }
    setSubtotal(getSubtotal(form))
    // console.log(subtotal)
    const formNewestValues = form.getFieldsValue()
    for (let i=0; i <formNewestValues['poDetail']?.length; i++){
      form.setFieldsValue({
        ...formNewestValues,
        poDetail: autoPrice(formNewestValues, 'poDetail', i),
      })
    }
  }

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onFormBlur2 = (form: any) => {
    if (!formRef2) {
      setFormRef2(form)
    }
  }

  const autoUnitPrice= (value:any,col:string,index:number) =>{
    const row = value[col];
    const rawMaterial:any = rawMaterialOptions?.find((e:any)=>e.rawMaterialId == row[index].rawMaterialId);
    row[index].unitPrice = rawMaterial['unitPrice']?rawMaterial['unitPrice']:0;
    row[index].unit = rawMaterial['unit']?rawMaterial['unit']:"";
    row[index].comments = rawMaterial['description']?rawMaterial['description']:'';
    row[index].price = row[index].unitPrice*row[index].quantity;
    row[index].suplierProductCode = rawMaterial.suplierProductCode;
    return row;
  }
  const autoPrice= (value:any,col:string,index:number) =>{
    const row = value[col];
    if (row[index]?.unitPrice && row[index]?.quantity)
      row[index].price = row[index].unitPrice*row[index].quantity;
    return row;
  }  
  const setPoDetailComplete = (formNewValue: any, poDetailIndex: any, completed: boolean) => {
    return {
      ...formNewValue,
      poDetail: formNewValue.poDetail.map((row: any, index: number) => {
        if (index === poDetailIndex) {
          return {...row, completed: completed}
        } else {
          return row
        }
      })
    }
  }
  const getSubtotal = (form: any) => form.getFieldsValue().poDetail?.reduce((a: number, c: IPoDetail) => a + c?.unitPrice * c?.quantity, 0) || 0

  const onConfirm = async () => {
    formRef2.submit()
    formRef.submit()
    if (poFormRef) {
      poFormRef.submit()
    }
    const formValues: IFormValues = await formRef.validateFields()
    const formValue2: IFormValues = await formRef2.validateFields()
    const poFormValues: IPoFormValues = await poFormRef.validateFields()
    if (formValues) {
      const requestValues = {
        ...formValues,
        images:JSON.stringify(fileList.map((e:any,index:number)=>{
          return {
            uid:index,
            url:e.url?e.url:e.response
          }
        })),
        poId: formValue2?.poId || formValues.poId,
        unloadingDetail: poFormValues.poDetail
      }
      console.log(requestValues)
      let result
      if (props.isNewUnloadingInspection) {
        result = await ApiRequest({
          urlInfoKey: urlKey.UnloadingInspection,
          type: urlType.Create,
          data: requestValues
        })
      } else {
        const requestValuesUpdate = {
          ...requestValues,
          inspectionId: props.unloadingInspectionData.inspectionId
        }
        result = await ApiRequest({
          urlInfoKey: urlKey.UnloadingInspection,
          type: urlType.Update,
          data: requestValuesUpdate
        })
      }
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        props.onDialogClose(true)
      }
    }
  }

  const onComplete = () => {
    ApiRequest({
      url: baseUrl + 'UnloadingInspection/Complete?id=' + props.unloadingInspectionData?.inspectionId,
      method: 'put'
    }).then(_ => {
      console.log(_)
      SweetAlertService.successMessage('Complete successfully')
      props.onDialogClose(false)
    })
    props.onDialogClose(false)
  }

  const UnloadingInspectionColumnModel = (props: any) => {
    return [
      {
        title: 'Raw Material',
        field: 'poDetail1',
        filtering: false,
        render: (rowData: any) => rowData.rawMaterial.rawMaterialName + '-' + rowData.rawMaterial.rawMaterialCode
      },
      {
        title: 'Qty',
        field: 'poDetail2',
        filtering: false,
        render: (rowData: any) => rowData.quantity
      },
      // {
      //   title: 'Price',
      //   field: 'poDetail3',
      //   filtering: false,
      //   render: (rowData: any) => rowData.price
      // },
      {
        title: 'Comments',
        field: 'poDetail4',
        filtering: false,
        render: (rowData: any) => rowData.comments
      },
    ]
  }

  const onDialogClose=()=>{
    setOpen3(false)
  }
  const onDialogClose2=()=>{
    setOpen2(false)
  }

  const RawMaterialEditDialog = < RawMaterialBoxEditDialog unloadingInspectionData={props.unloadingInspectionData} 
    rawMaterialBoxData={props.unloadingInspectionData.rawMaterialBoxData} 
    inspectionId={props.unloadingInspectionData.inspectionId} onDialogClose2={onDialogClose2}/>

  const boxesEditDialog = <BoxesEditDialog unloadingInspectionData={props.unloadingInspectionData} inspectionId={props.unloadingInspectionData.inspectionId} productId={productId} />
  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Unloading Details',
      isFreeAction: false,
      onClick:async (event: any, rowData: any) => {
        let result = await ApiRequest({
            url: '/RawMaterial/GetRawMaterialById?id=' + rowData.rawMaterialId,
            method: 'get'
          })
        setProductId(result.data.data.productId);
        if (result.data.data.productId)
          setOpen3(true)
        else
          setOpen2(true)
        // setDialogTitle('Sales Order - ' + rowData.productName)
        // setDialogContent(<SalesOrderManagementPage stockMonitorProductId={rowData.productId} />)
      }
    }];

  const commonTableProps: CommonTablePropsInterface = {
    initData: tableValue,
    title: '',
    column: UnloadingInspectionColumnModel,
    isNotEditable: true,
    isNotAddable: true,
    defaultPageSize: 5,
    actionButtons:actionButtons
  }

  return (
    <div>
      <div style={{ width: '97%', margin: '0 auto 1rem' }}>
        <h2 style={{ fontSize: '18px' }}>{props.isNewUnloadingInspection ? 'Create New Receiving' : 'Edit Receiving'}</h2>
        <CommonForm items={formItem} initFormValues={initFormValue} onFormBlur={onFormBlur2} onFormChange={onFormChange2} />
        <CommonForm items={poFormItems} onFormChange={onPoFormChange} onFormBlur={onPoFormBlur} initFormValues={initPoFormValues} />
        {/* <CommonTable {...commonTableProps} /> */}
        <br /><br />
        <h2 style={{ fontSize: '14px' }}>Inspection Details</h2>
   
        <CommonForm items={[continerNo, ...formItems]} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
        <Upload name="imageFile" listType="picture-card"
           action={baseUrl + 'Common/UploadImage'} 
          fileList={fileList}
          // defaultFileList={[...fileList]}
         onPreview={handlePreview } onChange={onChange}>
        {/* <div>
          <Button icon={<UploadOutlined />}><strong>Add Photes+</strong></Button>
        </div> */}
      {fileList.length < 5 && '+ Upload'}        
      </Upload>   
      <Modal visible={previewVisible} title={"preview"} footer={null}  onCancel={handleCancel} >
        <img alt="example" style={{ width: '100%' }} src={previewImage}/>
      </Modal>        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Button
            onClick={() => {
              props.onDialogClose(false)
            }}
          >Close
          </Button>
          {!props.isComplete &&<Button
            disabled={!formRef}
            onClick={onConfirm}
            type="primary"
            style={{ margin: '0 2rem' }}
          >Confirm</Button>}
          {props.isComplete && (
            <Button
              disabled={!poFormRef}
              onClick={onComplete}
              type="primary"
              style={{ margin: '0 2rem' }}
            >Complete</Button>
          )}
        </div>
      </div>
     
      <CommonDialog title={'Edit Outsource Product Boxes'} open={open3} onDialogClose={onDialogClose} dialogContent={boxesEditDialog} />
      <CommonDialog title={'Edit Raw Material'} open={open2} onDialogClose={onDialogClose2} dialogContent={RawMaterialEditDialog} />
    </div>
  )
}

export default UnloadingInspectionAddDialog
