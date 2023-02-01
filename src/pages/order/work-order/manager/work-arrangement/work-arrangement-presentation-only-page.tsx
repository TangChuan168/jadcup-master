import React from 'react'
import WorkArrangement from './index'
import { useHistory } from 'react-router-dom'
import { Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

export const ButtonsForPageLink = () => {
  const history = useHistory()
  const data = [
    {name: 'Suborder', link: '/suborder'},
    {name: 'Packaging', link: '/packaging'},
    {name: 'Weekly Schedule', link: '/work-arrangement-present'},
  ]
  return (
    <div>
      {
        data.map((row: any, i: any) => <Button icon={<LinkOutlined />} type="dashed" onClick={() => history.push(row.link)} style={{marginRight: '1rem'}} key={i.toString()}>{row.name}</Button>)
      }
    </div>
  )
}

export const WorkArrangementPresentationOnlyPage = () => {
  return (
    <WorkArrangement isPresentOnly={true} />
  )
}

export default WorkArrangementPresentationOnlyPage
