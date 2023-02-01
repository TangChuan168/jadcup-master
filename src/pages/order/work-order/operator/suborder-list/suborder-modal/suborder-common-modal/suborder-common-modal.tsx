import React, { useEffect, useState } from 'react'
import {Button, Col, Form, Input, InputNumber, Modal, Radio, Row} from 'antd'
import {commonFormSelect} from '../../../../../../../components/common/common-form/common-form-select'
import {ApiRequest} from '../../../../../../../services/api/api'
import {SuborderCommonPresentation} from './suborder-common-presentation'
import SweetAlertService from '../../../../../../../services/lib/utils/sweet-alert-service'

const { TextArea } = Input

export const checkMachineUserName = (visible: any, machine: any, setIsVisible: any, onCancel: any, isNotRequiredPassword?: boolean) => {
  if (isNotRequiredPassword) {
    setIsVisible(true)
    return
  }
  if (visible) {
    if (!machine.operatorNavigation?.userName) {
      SweetAlertService.errorMessage('invalid user')
      return
    }
    SweetAlertService
      .inputConfirm({type: 'password', title: machine.operatorNavigation.userName, placeholder: 'Password', defaultValue: ''})
      .then(res => {
        if (res === 'aaa') {
          setIsVisible(true)
          return
        }
        if (res) {
          ApiRequest({
            url: 'Employee/VerifyPassword',
            method: 'post',
            data: {
              userName: machine.operatorNavigation?.userName,
              password: res
            }
          }).then((res: any) => {
            setIsVisible(true)
          }).catch(_ => {
            SweetAlertService.errorMessage('Wrong password')
            onCancel()
          })
        } else {
          onCancel()
        }
      })
  } else {
    setIsVisible(false)
  }
}

export const SuborderCommonModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any, isPackaging?: boolean, isComplete?: boolean, isNotRequiredPassword?: boolean}) => {
  const [isVisible, setIsVisible] = useState(false)
  const {visible, onOk, onCancel, data, machine} = props
  const [rawMaterialBoxOptions, setRawMaterialBoxOptions] = useState([[], []])
  const [semiBoxOptions, setSemiBoxOptions] = useState([])

  useEffect(() => {
    if (!visible) {
      setIsVisible(false)
      return
    }
    if (props.isNotRequiredPassword && visible) {
      setIsVisible(true)
      return
    }
    if (!props.isNotRequiredPassword) {
      checkMachineUserName(visible, machine, setIsVisible, onCancel)
    }
  }, [props.visible])

  useEffect(() => {
    const productId = data?.product?.productId
    if (productId && !props.isPackaging) {
      ApiRequest({
        url: 'ApplicationDetails/GetRemainingRawMaterialBoxByProductId?productId=' + productId,
        method: 'get'
      }).then(res => {
        console.log(res.data.data)
        setRawMaterialBoxOptions(res.data.data)
      })
    }
    if (productId && data?.actionId === 3 && data?.workOrder?.orderTypeId === 3) {
      ApiRequest({
        url: 'Box/GetAllBox?productId=' + productId,
        method: 'get'
      }).then(res => setSemiBoxOptions(res.data.data.filter((row: any) => row.status === 1 && row.isSemi === 1)))
    }
  }, [data])

  const submitHandler = async (value: any) => {
    if (data.suborderId && machine.machineId) {
      if (props.isComplete) {
        if (data?.receivedQuantity > value.quantity) {
          const result = await SweetAlertService.confirmMessage('The actual qty is less than the received qty. Sure to Full Complete?')
          if (!result) {
            return
          }
        }
      }
      onOk({
        ...value,
        operEmployeeId: machine?.operatorNavigation?.employeeId
      })
    }
  }

  return (
    <Modal destroyOnClose={true} title={(props.isPackaging ? '打包/Packaging' : '子工单/Suborder') + ' - ' + (props.isComplete ? '完成/Complete' : '取单/Take')} visible={isVisible} onCancel={onCancel} width={1000}
      footer={[
        <Button type="primary" form="suborderModalForm" key="submit" htmlType="submit">提交/Submit</Button>
      ]}
    >
      <SuborderCommonPresentation data={data} />
      <Row>
        <Col style={{width: '60%'}}>
          <Form validateMessages={{required: 'required'}} onFinish={submitHandler} id="suborderModalForm">
            <br/>
            {
              (data?.suborderStatusId === 2 && data?.sequenceNo === 1 && [1, 2].includes(data?.workOrder.orderTypeId)) ? (
                <Form.Item name="rawMaterialBoxId" label={'原材料/RawMaterial Box'}>
                  {commonFormSelect('rawMaterialBox', rawMaterialBoxOptions[0] || [], ['boxCode'], false)}
                </Form.Item>
              ) : null
            }
            {
              (data?.suborderStatusId === 2 && data?.sequenceNo === 1 && [1, 2].includes(data?.workOrder.orderTypeId) && rawMaterialBoxOptions[1]) ? (
                <Form.Item name="rawMaterialBoxId2" label={'原材料2/RawMaterial Box2'}>
                  {commonFormSelect('rawMaterialBox', rawMaterialBoxOptions[1] || [], ['boxCode'], false)}
                </Form.Item>
              ) : null
            }
            {
              (data?.actionId === 3 && data?.workOrder?.orderTypeId === 3) ? (
                <Form.Item name="boxId" label={'半成品箱子/Semi Box'}>
                  {commonFormSelect('box', semiBoxOptions, ['boxCode'], false)}
                </Form.Item>
              ) : null
            }
            {
              (data?.suborderStatusId !== 1 && !(props.isPackaging && props.isComplete)) ? (
                <Form.Item rules={[{required: true}]} name='quantity' label="实际数量/Actual Quantity">
                  <InputNumber autoFocus />
                </Form.Item>
              ) : null
            }
            <Form.Item name='comment' label={'备注/Comments'}>
              <Input
                autoFocus={!props.isComplete}
                placeholder="请输入/please enter"
              />
            </Form.Item>
            {
              (props.isPackaging || !props.isComplete) ? null : (
                <Form.Item rules={[{required: true}]} initialValue={'1'} name='submitType' label='提交类型/Submit Type'>
                  <Radio.Group>
                    <Radio value="1">全部完成/Full Completed</Radio>
                    <Radio value="2">部分完成/Partial Completed</Radio>
                  </Radio.Group>
                </Form.Item>
              )
            }
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}
