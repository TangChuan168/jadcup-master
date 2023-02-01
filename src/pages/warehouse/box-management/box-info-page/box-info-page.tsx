import React, { useState,useEffect } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import { toLocalDateTime } from '../../../../services/lib/utils/helpers'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { BoxInfoColumnModel } from './box-info-column-model'
import { Button, DatePicker } from 'antd'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import moment from 'moment'
import form from 'antd/lib/form'

interface IFormValues {
  customerId?: any
  productId?: any
  startDate?: any
  endDate?: any  
}
const BoxManagementPage = (): any => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<IFormValues>()  
  const [customerOptions, setCustomerOptions] = useState([])
  const [employeeOptions, setEmployeeOptions] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [url, setUrl] = useState('Box/GetAllInfo?customerId=1')
  const formRefCurrent: any = React.useRef()
  

  useEffect(() => {
    formRefCurrent.current = formRef
  }, [formRef])
  useEffect(() => {
    document.title = "Boxes Info";
    getSelectOptions('', 'Customer/GetAllSimpleCustomer').then(res => setCustomerOptions(res))    
    getSelectOptions(urlKey.Employee).then(res => setEmployeeOptions(res))   
    getSelectOptions('', 'Product/GetAllProduct?withOutStock=true').then(res => setProductsOptions(res))    
    const initValue = {
      startDate: moment().add(-6,"month"),
      endDate: moment(),
    }
    setInitFormValues(initValue)
    // formRefCurrent.setFieldsValue(updatedValues)        
   }, [])

   const formItems: ItemElementPropsInterface[] | any = [
    {name: 'productId', label: 'Product', span: 6, inputElement: commonFormSelect(urlKey.Product, productsOptions)},
    {name: 'customerId', label: 'Customer', span: 6, inputElement: commonFormSelect(urlKey.Customer, customerOptions,['company', 'customerCode'])},    
    {name: 'startDate', label: 'Start Date',  inputElement: <DatePicker format={'DD/MM/YYYY'}/>},
    {name: 'endDate', label: 'End Date', inputElement: <DatePicker format={'DD/MM/YYYY'} />},
  ]
  const onFormChange = (changedValues: any, newValues: any, form: any) => {
    // console.log(changedValues)
    // console.log(newValues)
    const changedValuesKey = Object.keys(changedValues)[0]
    switch (changedValuesKey) {
      case 'customerId':
        if (changedValues['customerId']) {
          // setCustomerInfosToForm(changedValues['customerId'], newValues, form)
          return
        }
        break
      case 'productId':
        if (changedValues['productId']) {
          // setProductInfosToForm(changedValues['productId'], newValues, form)
          return
        }
        break
    }
    // onConfirm()
  }  
  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  } 
  const onConfirm = async () => {
    formRef.submit()
    const formValues: IFormValues = await formRef.validateFields()
    if (formValues) {
      // console.log(formValues)
      let thisUrl = "Box/GetAllInfo?";
      thisUrl = thisUrl+ (formValues.customerId ? ('customerId=' + formValues.customerId + '&') : '')
      thisUrl = thisUrl+(formValues.productId ? ('productId=' + formValues.productId) + '&' : '')
      thisUrl = thisUrl+(formValues.startDate ? ('startDate=' + formValues.startDate.format('YYYY/MM/DD')) + '&' : '')
      thisUrl = thisUrl+(formValues.endDate ? ('endDate=' + formValues.endDate.format('YYYY/MM/DD')) : '');
      setUrl(thisUrl)
    }
  }  
  const getLocaltion = (row:any) =>{
    if (row.status==2)
      return 2  //In Dispatching
    else if (row.status==1)
      return 1  //Warehouse
    else if ( row.status==0 && row.location == 1 )
      return 3   // Deliveried
    else if ( row.status==0 && row.location == 0 )
      return 4   //deleted
    else
      return 5   //unkonw    
  }
  const getRenderData = async (data: any) => {
    console.log(data)
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        // createdAt1: row.createdAt,
        // createdAt: moment.utc( row.createdAt).local().format('DD/MM/YYYY'),
        // createdAt: row.createdAt,
        // printedAt1: row.printedAt,
        // printedAt: row.printedAt?moment.utc( row.printedAt).local().format('DD/MM/YYYY'):null,  
        // packagedAt1: row.packagedAt,
        // packagedAt:row.packagedAt?moment.utc(row.packagedAt).local().format('DD/MM/YYYY'):null,   
        // productionAt1: row.productionAt,
        // productionAt: row.productionAt?moment.utc(row.productionAt).local().format('DD/MM/YYYY'):null, 
        // dispatchedAt1: row.dispatchedAt,
        // dispatchedAt: row.dispatchedAt?moment.utc(row.dispatchedAt).local().format('DD/MM/YYYY'):null,  
        location2:getLocaltion(row)
      })
    })
    return renderData
  }

  return (
    <div >
      <div style={{display:"flex"}}>
        <div style={{width:'75%'}}>
          <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
        </div>
        <div style={{width:'25%'}}>
          <Button disabled={!formRef} onClick={onConfirm} type="primary">Search</Button> 
        </div>
      </div>
      <CommonTablePage
        urlInfoKey={urlKey.Box}
        getAllUrl={url}
        title="Boxes Info"
        isNotAddable={true}
        isNotEditable={true}
        isNotDeletable={true}
        mappingRenderData={(data: any) => getRenderData(data)}
        column={BoxInfoColumnModel()}
        triggerResetData={triggerResetData}
      />
    </div>
  )
}

export default BoxManagementPage
