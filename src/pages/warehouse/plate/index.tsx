import React, { useEffect, useState } from 'react'
import {Button, Col, Form, Input, Row, Table,Space,Popconfirm} from 'antd'
import { urlType } from '../../../services/api/api-urls'
import {
  addTempZoneRequest,
  getBoxByBarCodeRequest,
  getBoxByPlateIdRequest, getPlateByBoxIdRequest,
  getPlateByPlateCodeRequest
} from '../../../services/others/plate-services'
import ItipsForProduct from '../../../components/common/i-tips/product'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { commonFormSelect } from '../../../components/common/common-form/common-form-select'
import { urlKey } from '../../../services/api/api-urls'
import { ApiRequest } from '../../../services/api/api'
import moment from 'moment'

const { Search } = Input

interface Table {
    id: number,
    product: string,
    boxNumber: number,
    productDate: string,
    notes: string
}
interface values {
  plate:string,
  barcode:string
}
const Plate = (props:{cancelModal:()=>void, refresh:()=>void}) => {

  const [dataInTable, setDataInTable] = useState<any>([])
  // const [isLoading, setIsLoading] = useState(false)
  const [submitPlate, setSubmitPlate] = useState<any>([])
  const [currentPlateId, setCurrentPlateId] = useState<any>()
  const [submitBtnDisabled, setSubmitBtnDisable] = useState<boolean>(true)
  const [values, setValues] = useState<values>({plate: '', barcode: ''})
  const [currentPlateCode, setCurrentPlateCode] = useState<string>('')
  const [currentBarCode, setCurrentBarCode] = useState<string>('')
  const [plateOptions, setPlateOptions] = useState([])

  useEffect(() => {
    ApiRequest({
      url: 'Plate/GetAvailablePlate',
      method: 'get',
      isShowSpinner: true
    }).then(resPlate => {
      setPlateOptions(resPlate.data.data)
    })
  }, [])

  const FormSubmitHandler = async (values: any) => {
    // console.log('Received values from form: ', values)
    // console.log(currentPlateId)
    // console.log(submitPlate)
    const result = await SweetAlertService.confirmMessage()
    if (result) {
      addTempZoneRequest(currentPlateId, submitPlate)
        .then((res) => console.log(res, 'post success'))
        .then(_ => props.cancelModal())
        .then(_ => props.refresh())
    }
  }

  const backToInitial = () => {
    setSubmitPlate([])
    setCurrentPlateId(null)
    setSubmitBtnDisable(true)
    setDataInTable([])
    setCurrentPlateCode('')
    setCurrentBarCode('')
  }

  const plateGetDataHandler = (value:any) => {
    // setIsLoading(true)
    if (value !== '') {
      getPlateByPlateCodeRequest(value).then(plate => {
        // console.log(res.data.data.plateId)
        setCurrentPlateId(plate.data.data.plateId)
        getBoxByPlateIdRequest(plate.data.data.plateId).then(async boxes => {
          // console.log(res.data.data, 'last') // 返回的是boxes的数据
          setDataInTable(boxes.data.data)
          const submitDetail: any = []
          await boxes.data.data.forEach((box:any) => {
            // console.log(res)
            const obj = {
              boxId: box.boxId,
              quantity: box.quantity
            }
            submitDetail.push(obj)
          })
          setSubmitPlate(submitDetail)
          setSubmitBtnDisable(false)
          setCurrentPlateCode(value)
          // setIsLoading(false)
        })
      })
    }
    if (value === '') {
      backToInitial()
    }
  }

  const barCodeGetDataHandler = (value:any) => {
    // setIsLoading(true)
    if (value !== '') {
      getBoxByBarCodeRequest(value).then(box => {
        // console.log(res.data.data.boxId)
        getPlateByBoxIdRequest(box.data.data.boxId).then(plate => {
          // console.log(res.data.data)
          setCurrentPlateId(plate.data.data.plateId)
          getBoxByPlateIdRequest(plate.data.data.plateId).then(async boxes => {
            const submitDetail: any = []
            // console.log(res.data.data)
            setDataInTable(boxes.data.data)
            await boxes.data.data.forEach((boxInBoxes:any) => {
              // console.log(res)
              const obj = {
                boxId: boxInBoxes.boxId,
                quantity: boxInBoxes.quantity
              }
              submitDetail.push(obj)
            })
            setSubmitPlate(submitDetail)
            setSubmitBtnDisable(false)
            setCurrentBarCode(value)
            // setIsLoading(false)
          })
        })
      })
    }
    if (value === '') {
      backToInitial()
    }
  }

  const columns = [
    {
      title: 'BarCode',
      dataIndex: 'barCode',
      key: 'barCode',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (text:any) => <ItipsForProduct id={text.productId} label={text.productName}/>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Is Semi',
      dataIndex: 'isSemi',
      key: 'isSemi',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: any) => moment.utc(text.createdAt).local().format('DD/MM/YYYY')
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => {
        // console.log(text,record)
        return (
          <Space size="middle">
            {/* <div onClick={() =>quantityChangeHandler(text.boxId)}><a>change Quantity </a></div> */}
            <Popconfirm title="Sure to delete?" onConfirm={() => deleteHandler(text.boxId)}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        )
      },
    },  
  ]
  const deleteHandler = async (boxId:string) =>{
    console.log('delete',boxId )
    // console.log(props.productData)
    const newData = dataInTable.filter((res:any) => res.boxId !== boxId)
    await ApiRequest({
      url: 'Box/DeleteBox?id=' + boxId,
      method: urlType.Delete,
      isShowSpinner: true
    })
    setDataInTable(newData)
    // await deleteObsoleteBox(boxId).then((res:any)=>console.log(res))
    // console.log(newData)
    // props.productDelete(newData)
  }

  return (
    <div>
      <Form onFinish={FormSubmitHandler}>
        <Row>
          <Col span={12}>
            <Form.Item label="Pallet Number" wrapperCol={{span: 12}}>
              {commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false, plateGetDataHandler, 'plateCode')}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="BarCode" wrapperCol={{span: 12}}>
              <Search
                placeholder="input pallet Number"
                allowClear
                id='barcode'
                value={values.barcode}
                onChange={(e) => setValues({...values, [e.target.id]: e.target.value, plate: ''})}
                enterButton="Get Data"
                onSearch={barCodeGetDataHandler}
                onFocus={(event) => console.log(event)}
                // loading={isLoading}
              />
            </Form.Item>
          </Col>
        </Row>
        <strong>Please Confirm Pallet and Boxes are Correct！</strong>
        {currentPlateCode && <span>The Showing data from Pallet Number: <b>{currentPlateCode}</b> </span>}
        {currentBarCode && <span>The Showing data from BarCode: <b>{currentBarCode}</b> </span>}
        <br/>
        <Table dataSource={dataInTable} columns={columns} pagination={false} rowKey="id"/>
        <br/>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={submitBtnDisabled} style={{marginRight: 10}}>
                        Submit
          </Button>
          <Button onClick={() => props.cancelModal()}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Plate
