import React, { useState } from 'react'
import { Image, Popover } from 'antd'
import { ApiRequest } from '../../../../services/api/api'
import getImage from '../../common-form/common-image'
import { nbsStr } from '../../../../services/lib/utils/helpers'
import { Card } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'

const { Meta } = Card;

interface Iprops{
    id:number,
    label:string,
    isNotCutting?: boolean,
}

const ItipsForProduct: React.FC<Iprops> = (props) => {
  const [visible, setVisible] = useState(false)
  const [getData, setGetData] = useState<any>({})
  const [stockData, setStockData] = useState<any>(null)

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible)
    props.id && ApiRequest({
      url: 'Product/GetProductById?id=' + props.id,
      method: 'get',
      isShowSpinner: false
    }).then(res => {
      setGetData(res.data.data)
      console.log(getData)
    }).catch(reason => {
      setGetData({productName: 'Inactive product'})
    })
    props.id && ApiRequest({
      url: 'StockMonitor/GetStockInfoByProductId?productId=' + props.id,
      method: 'get',
      isShowSpinner: false
    }).then(res => {
      setStockData(res.data.data)
      console.log(stockData)
    }).catch(reason => {
      // setStockData({productName: 'Inactive product'})
    })    
  }

  const getRowRender = (name: any, rowData: any) => (
    <div style={{wordWrap: 'break-word', display: 'flex'}}>
      <div style={{minWidth: '50px'}}>
        {name&&<strong>{name}:</strong>}
      </div>
      <div>
        {stockData?
        <span style={{wordBreak: 'break-all'}}>&nbsp;&nbsp;{rowData}</span>
        :<LoadingOutlined />}
      </div>
    </div>
  )

  const content = (
    <Card title={getData?.productCode || 'Product'} bordered={true} style={{ width: 550 }}
    >
      
    <div style={{minWidth: '530px'}}>
      {getImage(getData?.images)}
      {getRowRender('FullName', getData?.productName)}
      {getRowRender('Customer', getData?.customer && getData.customer.company)}
      {getRowRender('In Stock', stockData?.productInventoryInfo?.productInStock )}
      {getRowRender('Approved Work Order', stockData?.productInventoryInfo?.pendingWorkOrderQuantity )}
      {getRowRender('In Packaging', stockData?.productInventoryInfo?.pendingWarehouseQuantity )}
      {getRowRender('Pending Order', stockData?.productInventoryInfo?.pendingOrderQuantity )}
      {/* {getRowRender('Description', getData?.description)} */}
      {/* {getRowRender('MinOrderQty', getData?.minOrderQuantity)}
      {getRowRender('MarginOfError', getData?.marginOfError)}
      {getRowRender('SemiMsl', getData?.semiMsl)} */}
      {getRowRender('Msl', getData?.productMsl)}      
      
    </div>
    </Card>
  )

  return (
    <Popover
      content={content}
      placement="right"
      // title={<h4 style={{textAlign: 'center'}}>{getData?.productCode || 'Product'}</h4>}
      trigger="hover"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <b>{nbsStr(props.label, props.isNotCutting)}</b>
    </Popover>
  )
}

export default ItipsForProduct
