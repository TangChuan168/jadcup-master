import React, {useEffect, useState} from 'react'
import {
  addDailyReportRequest,
  getAllMachineDateRequest,
  getDailyReportByMachineIdRequest, updateDailyReportRequest
} from '../../../services/others/daily-report-service'
import CommonMachineCard from '../../../components/common/others/common-machine-card'
import {Col, Form, Input, InputNumber, Modal, Row} from 'antd'
import {checkMachineUserName} from '../../order/work-order/operator/suborder-list/suborder-modal/suborder-common-modal/suborder-common-modal'

type initialState = {
    title:string,
    isVisible:boolean
    machineId: number
    employeeId: number
    machineData:any
}
type reportDetail = {
    createdAt: string
    dailyReportId?:string
    employeeId: number
    loss: number
    machineId: number
    reason?: string
    reportDate: string
    reportId: string
}
const initial = {
  title: '',
  isVisible: false,
  machineId: 0,
  employeeId: 0,
  machineData: {}
}

const {TextArea} = Input

const DailyReport:React.FC = () => {

  const [allMachineAtDay, setAllMachineAtDay] = useState([])
  const [modal, setModal] = useState<initialState>(initial)

  useEffect(() => {
    getAllMachineDateRequest()
      .then(res => {
        // console.log(res.data.data)
        setAllMachineAtDay(res.data.data)
      })
  }, [])

  const onClickHandler = (data:any) => {
    console.log(data)
    // setIsVisible(true)
    setModal({...modal, title: data.machine.machineName, isVisible: true, machineId: data.machineId, employeeId: data.operatorNavigation.employeeId, machineData: data})
  }
  console.log(modal)
  return (
    <>
      <Row gutter={[16, 16]}>
        {allMachineAtDay.map((res:any, index:number) => {
          return (
            <Col key={index} className="gutter-row" span={3} >
              <div onClick={() => onClickHandler(res)}>
                <CommonMachineCard img={res.machine.picture} machine={res.machine.machineName} operator={res.operatorNavigation.firstName + ' ' + res.operatorNavigation.lastName}/>
              </div>
            </Col>
          )
        })}
      </Row>
      <ReportModal title={modal.title} visible={modal.isVisible} modalOff={() => setModal({...modal, isVisible: false})} machine={modal.machineData} machineId={modal.machineId} employeeId={modal.employeeId}/>
    </>
  )
}

const ReportModal = (props:{title:string, visible:boolean, modalOff: () => void, machineId: number, employeeId: number, machine:any }) => {
  const [form] = Form.useForm()
  const [reportData, setReportData] = useState<reportDetail>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  useEffect(() => {
    //getByMachineId api
    checkMachineUserName(props.visible, props.machine, setIsDisabled, props.modalOff)
    if (props.machineId != 0 && props.visible === true) {
      console.log('you')
      getDailyReportByMachineIdRequest(props.machineId)
        .then(res => {
          console.log(res.data.data, 'inuseEffect')
          setReportData(res.data.data)
          form.setFieldsValue({
            loss: res.data.data?.loss,
            reason: res.data.data?.reason
          })
        })
    }
  }, [props.visible])

  const onOkHandler = () => {
    form.validateFields().then((value:{loss:number, reason:string}) => {
      console.log(value, value.loss)
      // console.log(reportData)
      if (reportData === null) {
        //connect daily report post api
        console.log('post the new daily Report')
        const newReportData = {
          employeeId: props.employeeId,
          machineId: props.machineId,
          loss: value.loss,
          reason: value.reason
        }
        addDailyReportRequest(newReportData)
          .then(res => console.log(res.data.data, 'Post Success'))
      }
      if (reportData !== null) {
        const updateReportData = Object.assign({}, reportData, value)
        //connect daily report put api
        updateDailyReportRequest(updateReportData)
          .then(res => console.log(res.data.data, 'Update Success'))
      }
    }).then(_ => props.modalOff())
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  return (
    <Modal title={props.title} visible={isDisabled} onOk={onOkHandler} onCancel={props.modalOff} okText="Create"
      cancelText="Cancel"
      destroyOnClose={true}
      width={800}
    >
      <Form form={form}>
        <Form.Item name="loss"label="Loss" rules={[{required: true, message: 'you need to input a number'}]}>
          <InputNumber min={0} style={{width: 200}}/>
        </Form.Item>
        <Form.Item name="reason"label="Reason">
          <TextArea autoSize={{minRows: 3, maxRows: 5}}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DailyReport
