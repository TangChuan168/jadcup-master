import React, {useState, useContext, useEffect} from 'react'
import {Col, Row, Table} from 'antd'
import { ColumnsType } from 'antd/es/table'
import {getAllOrderRequest} from '../../../../services/others/sales-order-dashboard-services'
import { ApiRequest } from '../../../../services/api/api'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import {baseUrl} from '../../../../services/api/base-url'

interface User{
  order: string,
  status: string
}
const dataSend = React.createContext({})

// getallorder orderStatus

const tableForEmployee: ColumnsType<User> = [
  {
    key: 'customer',
    title: 'Customer',
    dataIndex: 'customer',
    width: 250
  }, {
    key: 'product',
    title: 'Product',
    dataIndex: 'product',
    render: (text, row, index) => {
      // console.log(text,row,index)
      return (
        <>
          {text.map((res:any, index:number) => {
            return (
              <div key={index}>
                <strong>Name</strong>:{res.name},
                <strong>Quantity</strong>:{res.quantity},
                <strong>Price</strong>:{res.price}
              </div>
            )
          })}
        </>
      )
    },
    width: 400
  }, {
    key: 'product',
    title: 'Options',
    dataIndex: 'option',
    render: (text, row, index) => {
      // console.log(text,row,index)
      return (
        <>
          {text.map((res:any, index:number) => {
            return (
              <div key={index}>
                <strong>Name</strong>:{res.optionName},
                <strong>Price</strong>:{res.price}
              </div>
            )
          })}
        </>
      )
    },
    width: 300
  }, {
    key: 'totalPrice',
    title: 'Total Price',
    dataIndex: 'totalPrice'
  }, {
    key: 'createdAt',
    title: 'Created At',
    dataIndex: 'createdAt'
  }, {
    key: 'requiredDate',
    title: 'Required Date',
    dataIndex: 'requiredDate'
  }
]

const Home:React.FC = () => {

  const [dataInBox, setDataInBox] = useState([])
  const [typeOfTable, setTypeOfTable] = useState<number>(0)
  const [dataOfOrder, setDataOfOrder] = useState<any>([])
  const [notifyMessages, setNotifyMessages] = useState<any>([])

  useEffect(() => {
    getAllOrderRequest().then((res:any) => {
      // console.log(res.data.data)
      const Normal = dataTransfer('New', res.data.data, 1)
      const Online = dataTransfer('Online', res.data.data, 2)
      const Approved = dataTransfer('Approved', res.data.data, 2)
      const InProduction = dataTransfer('Production', res.data.data, 10)
      const Warehouse = dataTransfer('Warehouse', res.data.data, 11)
      const Dispatched = dataTransfer('Dispatched', res.data.data, 15)
      const PaymentReceived = dataTransfer('Paid', res.data.data, 16)
      // console.log(Normal)
      setDataOfOrder((prevState: any) => [...prevState, Normal, Online, Approved, InProduction, Warehouse, Dispatched, PaymentReceived])
    })
    ApiRequest({
      url: baseUrl + 'Notification/GetByRole?roleId=10',
      method: 'get'
    }).then((res: any) => {
      setNotifyMessages(res.data.data.filter((row: any) => row.isActive))
    })
  }, [])

  const dataTransfer = (label:string, data:any, statusId:number) => {
    const obj = {
      label: label,
      test: data.filter((res:any) => res.orderStatus?.orderStatusId === statusId),
      box: [
        {
          status: 'have time',
          data: data.filter((res:any) => res.orderStatus?.orderStatusId === statusId).filter((res:any) => res.dueStatus === 0)
        },
        {
          status: 'in Waiting',
          data: data.filter((res:any) => res.orderStatus?.orderStatusId === statusId).filter((res:any) => res.dueStatus === 1)
        },
        {
          status: 'finished',
          data: data.filter((res:any) => res.orderStatus?.orderStatusId === statusId).filter((res:any) => res.dueStatus === 3)
        },
        {
          status: 'urgent',
          data: data.filter((res:any) => res.orderStatus?.orderStatusId === statusId).filter((res:any) => res.dueStatus === 2)
        },
      ]
    }
    return obj
  }

  const tableChangeHandler = (data:any) => {
    const newData = data.map((res:any) => {
      // console.log(res)
      const obj = {
        customer: res.customer.company,
        product: res.orderProduct.map((product:any) => {
          const productObj = {
            name: product.product.productName,
            quantity: product.quantity,
            price: product.price
          }
          return productObj
        }),
        option: res.orderOption.map((option:any) => {
          const optionObj = {
            optionName: option.option.optionName,
            price: option.price
          }
          return optionObj
        }),
        totalPrice: res.totalPrice,
        createdAt: res.createdAt.slice(0, 10),
        requiredDate: res.requiredDate.slice(0, 10)
      }
      return obj
    })

    setDataInBox(newData)
    // console.log(newData,'new')
  }

  return (
    <div>
      <dataSend.Provider value={{dataOfTable: dataInBox, changeHandler: tableChangeHandler}}>
        <div>
          <Row style={{height: '400px'}}>
            <Col span={18}>
              <Task data={dataOfOrder}/>
            </Col>
            <Col span={6}>
              <div style={{marginLeft: '5px', height: '400px'}}>
                <div style={{lineHeight: '40px', backgroundColor: 'rgba(226, 220, 220, 1)', textAlign: 'center'}}>
                  Notice Board
                </div>
                <div style={{height: '360px', backgroundColor: 'rgba(252, 247, 247, 1)', padding: '10px 20px'}}>
                  {notifyMessages.map((row: any, i: any) => <p key={i.toString()}>{row.notificationContext}</p>)}
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{marginTop: '10px'}}>
            <Col span={24}>
              <DashboardTable tableChoice={typeOfTable}/>
            </Col>
          </Row>
        </div>
      </dataSend.Provider>
      {/*</div>*/}
    </div>
  )
}

const DashboardTable = (props:{tableChoice:number}) => {
  const DataSend = useContext<any>(dataSend)

  //  const TableHeader1 = ['Order number', 'Customer', 'Product','Price', 'Order date', 'Recive Date']

  // console.log(DataSend.dataOfTable)

  //  const data = DataSend.dataOfTable.map((data:any, i:number) => {
  //    console.log(data, 'from table 1')
  //    return(
  //      <div>
  //         <div>this is type {DataSend.type} Table</div>
  //         <div>{data.order}</div>
  //         <div>{data.status}</div>
  //      </div>
  //    )
  //  })

  return (
    <div>
      <Table columns={tableForEmployee} dataSource={DataSend.dataOfTable} pagination={{ pageSize: 10 }}/>
    </div>
  )
}
const Task = (props:{data:any}) => {
  const taskTable = props.data.map((data:any, index:number) => {
    // console.log(data,'inTable')
    return (
      <Col className="gutter-row" span={3} key={index}>
        <div style={{ padding: '8px 0', textAlign: 'center' }}>
          <label>{data.label}</label>
          <div style={{marginTop: '10px', backgroundColor: 'rgba(153, 153, 153, 1)', borderRadius: '10px', height: '345px', textAlign: 'center', display: 'flex', flexDirection: 'column-reverse', padding: '0px 5px'}}>
            {
              data.box.map((boxData:any, index:number) => {
                // console.log(boxData,boxData.dueStatus)
                return (
                  <Box key={index} data={boxData} />
                )
              })
            }
          </div>
        </div>
      </Col>
    )
  })
  return (
    <div>
      <Row gutter={16}>
        {taskTable}
      </Row>
    </div>
  )
}

const Box = (props:any) => {
  const boxStyle = {backgroundColor: 'red', lineHeight: '40px', marginBottom: '5px', borderRadius: '10px', color: 'white', cursor: 'pointer'}
  const {status, data} = props.data

  boxStyle.lineHeight = `${40 + 10 * data.length}px`

  if (data.length > 4) {
    boxStyle.lineHeight = '80px'
  }

  if (status === 'have time') {
    boxStyle.backgroundColor = 'rgba(21, 96, 2, 1)'
  }
  if (status === 'urgent') {
    boxStyle.backgroundColor = 'rgba(129, 7, 7, 1)'
  }
  if (status === 'in Waiting') {
    boxStyle.backgroundColor = 'rgba(117, 121, 4, 1)'
  }
  if (status === 'finished') {
    boxStyle.backgroundColor = 'rgba(133, 70, 6, 1)'
  }

  return (
    <dataSend.Consumer>
      {(value:any) => <div style={boxStyle} onClick={() => value.changeHandler(data)}>{data.length}</div>}
    </dataSend.Consumer>
  )
}

export default Home
