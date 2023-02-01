import React, {useEffect, useState} from 'react'
import {Popover} from 'antd'
import {ItipsForOrdersRequest} from '../../../../services/others/i-tips-services'

interface Iprops{
    id:number,
    label:string,
}

const ItipsForOrders:React.FC<Iprops> = (props) => {
  const [visible, setVisible] = useState(false)
  const [getData, setGetData] = useState<any>({})
  const hide = () => {
    setVisible(false)
  }

  const handleVisibleChange = (visible:boolean) => {
    setVisible(visible)
    ItipsForOrdersRequest(props.id).then((res:any) => {
      // console.log(res.data, '123')
      setGetData(res.data)
    })
  }
  const UserContent = (
    <div style={{width: '250px'}}>
      <div style={{wordWrap: 'break-word', display: 'flex'}}>
        <div style={{minWidth: '50px'}}>
          <strong>Name:</strong>
        </div>
        <div>
          <span style={{wordBreak: 'break-all'}}>{getData.title}</span>
        </div>
      </div>
      <div style={{wordWrap: 'break-word', display: 'flex'}}>
        <strong>Gender:</strong>
        <div>
          <span style={{wordBreak: 'break-all'}}>{getData.body}</span>
        </div>
      </div>
      <div style={{wordWrap: 'break-word', display: 'flex'}}>
        <strong>Birth:</strong>
        <div>
          <span style={{wordBreak: 'break-all'}}></span>
        </div>
      </div>
      <div style={{wordWrap: 'break-word', display: 'flex'}}>
        <strong>Phone:</strong>
        <div>
          <span style={{wordBreak: 'break-all'}}></span>
        </div>
      </div>
      <div style={{wordWrap: 'break-word', display: 'flex'}}>
        <strong>Address:</strong>
        <div>
          <span style={{wordBreak: 'break-all'}}></span>
        </div>
      </div>
    </div>
  )
  const content = UserContent
  return (
    <Popover
      content={content}
      title="Order"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <a>{props.label}</a>
    </Popover>
  )
}

export default ItipsForOrders
