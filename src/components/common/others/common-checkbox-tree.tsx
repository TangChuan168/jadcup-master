import React, { useEffect, useState } from 'react'
import { Form, InputNumber, Tree } from 'antd'
import { chunkArr, getRandomKey } from '../../../services/lib/utils/helpers'

interface ITreeData {
	title: string
	key: string
	children?: ITreeData[]
}

export const CommonCheckboxTree = (props: {data: any, onChange: any, checkedItems?: any, isNotShowChinese?: boolean, isShowTree?: boolean, groupNum?: any, label?: any}) => {
  const [checkedKeys, setCheckedKeys] = useState([])
  const [groupNum, setGroupNum] = useState<number>(props.groupNum || 10)
  const [treeData, setTreeData] = useState<ITreeData[] | any>([])

  useEffect(() => {
    if (props.data?.length) {
      console.log(props.data)
      setTree()
    }
  }, [props.data])

  useEffect(() => {
    if (props.groupNum) {
      setGroupNum(props.groupNum)
    }
  }, [props.groupNum])

  useEffect(() => {
    if (groupNum) {
      setTree()
    }
  }, [groupNum])

  useEffect(() => {
    if (props.checkedItems?.length) {
      setCheckedKeys(props.checkedItems)
    }
  }, [props.checkedItems])

  const setTree = () => {
    const chunkedArr = props.data[0]?.title ? props.data : chunkArr(props.data, groupNum)
    const newTreeData = chunkedArr.map((item: any, index: number) => ({
      title: item.title || (index + 1).toString(),
      key: item.title || getRandomKey(),
      children: (item.children || item).map((child: any) => ({
        title: child.title || child,
        key: child.key || child,
        children: child.children || child
      }))
    }))
    console.log(newTreeData)
    setTreeData(newTreeData)
  }

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue)
    const onChangeData = props.data[0]?.title ? checkedKeysValue : props.data.filter((item: any) => checkedKeysValue.includes(item))
    console.log(onChangeData)
    props.onChange(onChangeData)
  }

  const onChangeGroupNum = (value: any) => {
    setGroupNum(value)
  }

  return (
    <div>
      {
        !props.data[0]?.title ? (
          <div>
            <Form.Item label={props.label || ((!props.isNotShowChinese ? '分配组数量/' : '') + 'Group Numbers')}>
              <InputNumber value={groupNum} onChange={onChangeGroupNum} />
            </Form.Item>
          </div>
        ) : null
      }
      {props.isShowTree ? 
        (<Tree
          checkable
          onCheck={onCheck}
          checkedKeys={props.data?.length ? checkedKeys : []}
          treeData={treeData}
        />) : null}
    </div>
  )
}
