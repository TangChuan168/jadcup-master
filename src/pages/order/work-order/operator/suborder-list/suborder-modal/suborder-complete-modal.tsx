import React from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import {SuborderCommonModal} from './suborder-common-modal/suborder-common-modal'

export const SuborderCompleteModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any, isPackaging?: boolean, updateValueFn?: any}) => {
  const {visible, onOk, onCancel, data, machine, isPackaging, updateValueFn} = props

  const onFinish = (value: any, isFull: boolean) => {
    ApiRequest({
      url: 'Suborder/' + (isFull ? 'Finish' : 'PartlyComplete') + 'Suborder?id=' + data.suborderId,
      method: 'put',
      data: {
        ...value,
        machineId: machine.machineId
      }
    }).then(_ => {
      onOk()
    })
  }

  const submitHandler = async (value: any) => {
    let newValue = value
    if (updateValueFn) {
      newValue = await updateValueFn(value)
      if (newValue == 'err') {
        return
      }
      console.log(newValue)
    }
    onFinish(newValue, !!(value.submitType === '1' || isPackaging))
  }

  return (
    <SuborderCommonModal
      visible={visible}
      onOk={submitHandler}
      onCancel={onCancel}
      data={data}
      machine={machine}
      isPackaging={isPackaging}
      isComplete={true}
    />
  )
}
