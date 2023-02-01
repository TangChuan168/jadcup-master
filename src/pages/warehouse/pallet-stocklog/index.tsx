import React, {useState, useEffect, useRef} from 'react'
import { allUrls, urlKey } from '../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../components/common/common-form/common-form'
import {getSelectOptions, commonFormSelect} from '../../../components/common/common-form/common-form-select'
import { ApiRequest } from '../../../services/api/api'
import { DatePicker,  Table, Button , Select , Input, Space, Card } from 'antd'
import type { Dayjs } from 'dayjs';
import PalletlogDialog from '../../../components/common/others/common-palletlog'



const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;
type RangeValue = [Dayjs | null, Dayjs | null] | null;


const Palletstocklog = () => {

  const [customerOptions, setCustomerOptions] = useState([])
  //const [selectedCustomer, SetselectedCustomer] = useState('')
  //const [plateTypes, SetplateTypes] = useState([])
  //
  const [pallteStock, SetpallteStock] = useState<any>({})
  const [CustomerFull, SetCustomerFull] = useState<any[]>([])
  const [Customers, SetCustomers] = useState<any[]>()

  const [TranSactionType, SetTran] = useState([])

  const [open, setOpen] = useState(false)// palletstock log dialog open
  const [record,setRecord] = useState({})
  const [showCard,setShowCard] = useState(false)
  const [conditions, setConditions] = useState({
    tranType:null,
    times:[],
    defaultTime: true,
    
  })



  useEffect(() => {
    getSelectOptions('', 'Customer/GetAllSimpleCustomer')
      .then(res => {
        setCustomerOptions(res)
        console.log('testing pallet log page useeffect 688', res)
      });
    
    getSelectOptions('', 'PalletTransactionType/GetAllTranType')
    .then(res => {
      SetTran(res)
      console.log('SetTran useeffect #555', res)
    });
  }, [])


  const parm ={
    selectedCustomer:0,
    TranTypeId:null,
    Date:null
  }

  const handleClose = () =>{
    setOpen(false)
  }

  const handleFormChange = (ChangedValues:string, value: any) => {
    console.log('Idvalue', value)
    //SetselectedCustomer(value['customerId'])
    parm.selectedCustomer = value['customerId']
    //fetch all logs of selected customer
    ApiRequest({
      url: 'PalletLog/GetLogById',
      method: 'post',
      data: parm
    }) // 请求参数
      .then(
        res => {
          SetCustomerFull(res.data.data)//full data
          console.log('customer detials',res.data.data)
          SetCustomers(DataFilter(res.data.data))         
        }         
    )
    //fetch stock log
    ApiRequest({
      url: 'PalletStock/GetcustomerStockById?customerId='+ value['customerId'],
      method: 'post',
      //data: parm
    }) // 请求参数
      .then(
        res => {
          SetpallteStock(res.data.data)
          console.log('customer Stock details #222',res.data.data)
        }
    )
  }

  const handleTypechange = (ChangedValues:string, value: any) =>{
    console.log('Idvalue', value) //value['customerId']
    SetCustomers(DataFilter(CustomerFull,value['transactionTypeId']))
  }

  const handleRangePicker = (value:any, dateString:[string, string])=>{
    console.log('picked time value', value)
    console.log('datestring',dateString)
    //setStart(dateString[0])
    //setEnd(dateString[1])
    SetCustomers(DataFilter(CustomerFull,0,[dateString[0],dateString[1]]))
    
  }

  const handleBtn = (record:any) =>{
    console.log('action btn works 123',record)
    setOpen(true)
    setRecord(record)
  }



  const DataFilter = (dataSet:any[],type?:number, timeRange?:[s:string,e:string]) =>{
    //debugger;
    if(type && timeRange){
      let res1 = dataSet.filter(x =>x.tranTypeId == type)
      const data1= res1?.filter(y=>y.createdAt >= timeRange[0] && y.createdAt <= timeRange[1])
      return data1
    }
    if(type && type!=0){

      const data3= dataSet.filter(x =>x.tranTypeId == type)
      return data3
    }
    if(timeRange){
     const data4 = dataSet.filter(y=>y.createdAt >= timeRange[0] && y.createdAt <= timeRange[1])
     return data4
    }
    var lastYear = new Date().getFullYear() -1
    const data2 = dataSet.filter(x =>x.createdAt >= lastYear.toString())
    return data2
  }



  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'customerId', span: 6, label: 'Customer', rules: [{required: true}], inputElement: commonFormSelect(urlKey.Customer, customerOptions, ['company', 'customerCode'])},
  ]

  const formItemsTranTypes:ItemElementPropsInterface[] | any = [
    {name: 'tranTypeId', span: 6, label: 'TranType Options', inputElement: commonFormSelect(urlKey.TransactionType, TranSactionType)},
  ]

  const handleText = (text:any) =>{
    if(text =='1'){return 'Normal'}
    if(text =='2'){return 'Temporary'}
    if(text =='3'){return 'Blue'}
    if(text =='5'){return 'Special'}
  }

  function dataTable(dataSet: any){
    return(<Table
      dataSource={dataSet}
      
    >
      <Column title="Plate Type" dataIndex="plateTypeId" key="logId" render={(text:any)=>handleText(text)} />
      <Column title="Balance" dataIndex="balance" key="balance" />
      <Column title="Qty" dataIndex="quantity" key="quantity" />
      <Column title="Notes" dataIndex="notes" key="notes"  />
      <Column title="Date" dataIndex="createdAt" key="createdAt" render={(text:any)=>new Date(text).toLocaleDateString()} />
      <Column title="PackingSlip No" dataIndex="packingSlip" key="packingSlip" />
      <Column
      title="Action"
      key="action"
      render={(_: any, record: any) => (
        <Space size="middle">
          <Button type='primary' onClick={()=>handleBtn(record)}>New Log</Button>
        </Space>
      )}
      />
    </Table>)
  }


  const page = <div style={ {width: '97%', margin: '0 auto 1rem'} }>
  <Card title='' bordered={false} style={{ width: 300 }}>
  <h3>Balance : {pallteStock?.balance}</h3>
  </Card>
  <CommonForm items={formItems} onFormChange = {handleFormChange} />
  <CommonForm items={formItemsTranTypes} onFormChange = {handleTypechange} />
  <label >Date Filter</label><br />
  <RangePicker     
    style={{width: '425px'}}
    onChange={(value,dateString:any) => handleRangePicker(value,dateString)}
  /> <br />
  {Customers? dataTable(Customers):''}
  <PalletlogDialog title={'PalletStockLog'} open={open} onDialogClose={handleClose} tranType={TranSactionType} record={record}/>     
</div>

if(customerOptions.length >0 && TranSactionType.length > 0 ){
  return page
}else return 'Loading Page...'

}

export default Palletstocklog