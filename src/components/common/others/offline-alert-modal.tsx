import { Button, Input, Modal, Form } from 'antd'
import React, { useState, useEffect } from 'react'
import { LoginRequest } from '../../../services/others/login-services'
import { getCookie, setCookie } from 'react-use-cookie'

const OfflineAlertModal = (props: {
  modalVisible: boolean;
  closeModal: any;
}) => {
  // const [modalVisible, setModalVisible] = useState(true)

  const onOk = (values: any) => {
    console.log('Received values of form: ', values)
    values.type = '1' //staff
    values.username = getCookie('userName')
    LoginRequest(values)
      .then((res) => {
        console.log(res)
        localStorage.setItem('CHECK_USER_OFFLINE', JSON.stringify(false))
        props.closeModal()
        setCookie('lockedFlag', '0')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <Modal
      width={400}
      destroyOnClose={true}
      visible={props.modalVisible}
      closable={false}
      footer={null}
    >
      <h2>You are locked</h2>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onOk}
      >
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Ok
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default OfflineAlertModal
