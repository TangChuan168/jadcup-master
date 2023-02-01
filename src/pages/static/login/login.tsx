import React, { useState } from 'react'
import { Row, Col, Radio } from 'antd'
import { Form, Input, Button, Modal } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login, loginCustomer } from '../../../services/lib/utils/auth.utils'
import { LoginRequest } from '../../../services/others/login-services'
import './login.css'
import { useHistory } from 'react-router-dom'
import { ApiRequest } from '../../../services/api/api'

function Login(props: any) {
  const history = useHistory()

  const [errorMsg, setErrorMsg] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<'1' | '2'>(JSON.parse(localStorage.getItem('USER_TYPE')!) ? JSON.parse(localStorage.getItem('USER_TYPE')!) : '1')

  const onFinish = (values: any) => {
    // add user type to user value, then send to api
    values.type = userType
    console.log('Received values of form: ', values)
    if (values.type === '1') {
      setIsLoading(true)
      setTimeout(() => {
        LoginRequest(values)
          .then(res => {
            setIsLoading(false)
            console.log(res)
            login(res.data.data, () => {
              history.push('/home')
            })
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
            if (err?.data?.message?.message) {
              setErrorMsg(err?.data?.message?.message)
            }
          })
      }, 1500)
    }
    if (values.type === '2') {
      setIsLoading(true)
      setTimeout(() => {
        ApiRequest({
          url: 'OnlineUser/OnlineUserLogin',
          method: 'post',
          data: values
        })
          .then(res => {
            setIsLoading(false)
            console.log(res)
            loginCustomer(res.data.data, () => {
              history.push('/sales-order-management-for-customer')
            })
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
            if (err?.data?.message?.message) {
              setErrorMsg(err?.data?.message?.message)
            }
          })
      }, 1500)
    }
  }

  const info = () => {
    Modal.info({
      title: 'Forgot Password',
      content: (
        <div>
          <br />
          <p>Please contact Jadcup customer service</p>
        </div>
      ),
      onOk() { },
    })
  }

  // switch user type
  const switchUserType = () => {
    console.log('user type is changed')
    if (userType === '1') {
      setUserType('2')
    } else {
      setUserType('1')
    }
    console.log('user type: ' + userType)
  }

  return (
    <div style={{ height: '100%' }}>
      <Row style={{ height: '100vh' }}>
        <Col span={16} className="loginImage" >
        </Col>
        <Col span={8}>
          <div style={{ margin: '80px 40px 20px', textAlign: 'center' }}>
            <img src="https://storage.googleapis.com/neptune_media/a9140096-6268-4d69-90be-67a8947d6f6c" style={{ height: '40px', marginBottom: '30px' }} />
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              {userType === '1' ? (<h4>Staff Login</h4>) : (<h4>Customer Login</h4>)}
              {/* <Form.Item
                name="type"
                rules={[{ required: true, message: 'Please pick a type!' }]}
              >
                <Radio.Group>
                  <Radio value="1">Staff</Radio>
                  <Radio value="2">Customer</Radio>
                </Radio.Group>
              </Form.Item> */}
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                {...errorMsg && { help: errorMsg, validateStatus: 'error' }}
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              {/*<Form.Item>*/}
              {/*  <a className="login-form-forgot" style={{ float: 'right' }} onClick={info}>*/}
              {/*    Forgot password*/}
              {/*  </a>*/} 
              {/*</Form.Item>*/}
              <Form.Item>
                {userType === '1' ? (
                  <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} >
                    Staff Log in
                  </Button>
                ) : (
                  <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%', background: '#faad14', borderColor: '#faad14' }} >
                    Customer Log in
                  </Button>
                )}
              </Form.Item>
            </Form>
          </div>
          {userType === '1' ? (
            <div style={{ margin: '20px 40px', textAlign: 'end' }}>
              Not a Staff?<a style={{ marginLeft: '10px' }} onClick={switchUserType}>Customer Login</a>
            </div>
          ) : (
            <div style={{ margin: '20px 40px', textAlign: 'end' }}>
              Not a Customer?<a style={{ marginLeft: '10px' }} onClick={switchUserType}>Staff Login</a>
            </div>
          )}
        </Col>
      </Row>
    </div>
  )
}
export default Login
