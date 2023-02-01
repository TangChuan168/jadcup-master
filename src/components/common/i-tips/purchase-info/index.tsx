import React, { useState } from 'react'
import { Image, Popover } from 'antd'
import { ApiRequest } from '../../../../services/api/api'
import getImage from '../../common-form/common-image'
import { nbsStr } from '../../../../services/lib/utils/helpers'
import { Card } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Meta } = Card;

interface Iprops{
    poNo:string,
    label:string,
}

const ItipsForPo: React.FC<Iprops> = (props) => {
  const [visible, setVisible] = useState(false)
  const [getData, setGetData] = useState<any>(null)


  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible)
    props.poNo && ApiRequest({
      url: 'PurchaseOrder/GetSinglePurchaseOrder?PoNo=' + props.poNo,
      method: 'get',
      isShowSpinner: false
    }).then(res => {
      setGetData(res.data.data)
      console.log(res)
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
        {getData?
        <span style={{wordBreak: 'break-all'}}>&nbsp;&nbsp;{rowData}</span>
        :<LoadingOutlined />}
      </div>
    </div>
  )

  const content = (
    <Card title={"Purchase Number: "+props.poNo} bordered={true} style={{ width: 550 }}>
      <div style={{minWidth: '530px'}}>
        {getRowRender('Purchase At',moment.utc( getData?.createdAt  ).local().format('DD/MM/YYYY'))}
        
        {getData && getRowRender('Supplier', getData?.suplier?.suplierName)}
        {getData && getRowRender('Unloading At', moment.utc( getData?.unloadingInspection[0]?.arrivalTime )?.local()?.format('DD/MM/YYYY'))}
        {getData && getRowRender('Container No', getData?.unloadingInspection[0]?.containerNo)}
        {getData && getRowRender('Unloading By', getData?.unloadingInspection[0]?.unloadingPeople)}
      </div>
    </Card>
  )

  return (
    <Popover
      content={getData?content:""}
      placement="right"
      // title={<h4 style={{textAlign: 'center'}}>{getData?.productCode || 'Product'}</h4>}
      trigger="hover"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <p>{props.label}</p>
    </Popover>
  )
}

export default ItipsForPo
