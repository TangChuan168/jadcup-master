import React from 'react'
import {Col, Row, Table} from 'antd'

export const SuborderCommonPresentation = (props: {data: any}) => {
  const {data} = props

  return (
    <Row>
      <Col span={6} push={18}>
        <img src={data?.product?.images && JSON.parse(data?.product?.images.split('---')[0]).url} style={{width: '100%', padding: '1rem'}}/>
      </Col>
      <Col span={18} pull={6}>
        <p>您将进行这单/You are going to do this order</p>
        <Table
          columns={[
            {title: '产品/Product', dataIndex: 'product', key: 'product' },
            {title: '描述/Description', dataIndex: 'description', key: 'description' },
            {title: '接受数量/Received Quantity', dataIndex: 'quantity', key: 'quantity' },
            {title: '备注/Comment', dataIndex: 'comment', key: 'comment' },
          ]}
          dataSource={[
            {key: '1', product: data?.product?.productName, description: data?.product?.description, quantity: data?.receivedQuantity, comment: data?.comments}
          ]}
          pagination={false}
        />
      </Col>
    </Row>
  )
}
