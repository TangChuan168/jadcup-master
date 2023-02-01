import React from 'react'
import {Col, Form, Input, Modal, Row} from 'antd'

const NewTicketModal = (props:{visible:boolean, modalCancel: () => void}) => {

  return (
    <Modal title="Add New Ticket" visible={props.visible} onOk={props.modalCancel} onCancel={props.modalCancel} width={1000}>
      <Form>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              // name={`field-`}
              label={'Order Id '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Ticket Type '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Customer '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Employee '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Content '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Contact Person '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Contact Number '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              // name={`field-`}
              label={'Result '}
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
            >
              <Input placeholder="placeholder" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default NewTicketModal
