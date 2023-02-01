import React from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import {SuborderCommonModal} from './suborder-common-modal/suborder-common-modal'

export const SuborderTakeModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any, isPackaging?: boolean, isNotRequiredPassword?: boolean}) => {
  const {visible, onOk, onCancel, data, machine, isPackaging} = props

  const onSave = (value: any) => {
    ApiRequest({
      url: 'Suborder/TakeSuborder?id=' + data.suborderId,
      method: 'put',
      data: {
        ...value,
        machineId: machine.machineId
      }
    }).then(_ => {
      onOk()
    })
  }

  return (
    <SuborderCommonModal
      visible={visible}
      onOk={onSave}
      onCancel={onCancel}
      data={data}
      machine={machine}
      isPackaging={isPackaging}
      isComplete={false}
      isNotRequiredPassword={props.isNotRequiredPassword}
    />
  )
}
