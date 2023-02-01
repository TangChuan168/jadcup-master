import React from 'react'
import {Card} from 'antd'
import {UserOutlined} from '@ant-design/icons'

const { Meta } = Card

interface IProps{
    user?:any,
    img:string,
    machine:string,
    operator?: string
}

const CommonMachineCard:React.FC<IProps> = (props) => {
  return (
    <Card
      hoverable
      bordered={false}
      style={{position: 'relative', textAlign: 'center', width: '10rem'}}
      bodyStyle={{padding: '0.3rem 0'}}
      cover={
        props.user ?
          <>
            <img alt="example" src={props.img} />
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '0.5rem', color: '#1678da', fontSize: '1.2rem', fontWeight: 600}}>
              <UserOutlined style={{marginRight: '0.3rem'}}/>
              {props.user}
            </div>
          </> :
          <img alt="example" src={props.img || 'https://img.xiaopiu.com/userImages/img186617687cd4b38.jpg'} />
      }
    >
      <Meta
        style={{textAlign: 'center'}}
        description={
          <div style={{fontSize: '1rem', fontWeight: 600, color: 'black'}}>
            <div>{props.machine}</div>
            <div>{props.operator ? ('(' + props.operator + ')') : ''}</div>
          </div>
        }
      />
    </Card>
  )
}

export default CommonMachineCard
