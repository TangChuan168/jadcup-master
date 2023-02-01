import React, {useEffect, useState} from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import { Button, Form, Input, InputNumber, Modal, Switch } from 'antd'
import {commonFormSelect, getSelectOptions} from '../../../../../../components/common/common-form/common-form-select'
import CommonForm, {ItemElementPropsInterface} from '../../../../../../components/common/common-form/common-form'
import {urlKey} from '../../../../../../services/api/api-urls'
import { checkMachineUserName } from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-modal'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'

export const PackagingCompleteModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any, updateValueFn: any, isNotRequiredPassword?: boolean}) => {
  let isDataAvailable = false
  let defaultQty: any = null
  const [initFormValues, setInitFormValues] = useState<any>()
  const [formRef, setFormRef] = useState<any>()
  const [comment, setComment] = useState<any>('')
  const [boxOptions, setBoxOptions] = useState([])
  const [plateOptions, setPlateOptions] = useState([])
  const [postRequestBoxIdArrs, setPostRequestBoxIdArrs] = useState<any>([])
  const {visible, onOk, onCancel, data, machine} = props
  const [isVisible, setIsVisible] = useState(false)
  const [receivedQty, setReceivedQty] = useState<any>()

  useEffect(() => {
    if (!visible) {
      setIsVisible(false)
      return
    }
    if (props.isNotRequiredPassword && visible) {
      setIsVisible(true)
      return
    }
    if (!props.isNotRequiredPassword) {
      checkMachineUserName(visible, machine, setIsVisible, onCancel)
    }
  }, [props.visible])

  useEffect(() => {
    console.log(data)
    if (data?.suborderId && !isDataAvailable) {
      ApiRequest({
        url: 'PlateBox/GetAllPlateBox?suborderId=' + data.suborderId,
        method: 'get',
        isShowSpinner: true
      }).then(resPlateBox => {
        const plateBoxData = resPlateBox.data.data || []
        console.log(plateBoxData)
        getSelectOptions('', 'Box/GetAllBox?suborderId=' + data.suborderId).then(res => {
          res.sort((a: any, b: any) => a.sequence - b.sequence)
          const formValues: any = []
          const postBoxIds: any = []
          res.map((row: any) => {
            const filteredValue = plateBoxData.filter((plateBoxItem: any) => plateBoxItem.boxId === row.boxId)[0]
            console.log(defaultQty)
            formValues.push({
              boxId: row.boxId,
              barCode: row.barCode,
              quantity: filteredValue?.plateId ? filteredValue?.box?.quantity : defaultQty,
              plateId: filteredValue?.plateId || null
            })
            if (filteredValue && !filteredValue.plateId) {
              postBoxIds.push(row.boxId)
            }
          })
          console.log(postBoxIds)
          console.log(formValues)
          setPostRequestBoxIdArrs(postBoxIds)
          setInitFormValues({
            plateBox: formValues
          })
          setBoxOptions(res)
        })
      })
      isDataAvailable = true
      ApiRequest({
        url: 'PackagingType/GetPackagingTypeById?id=' + data.workOrder?.product?.baseProduct?.packagingTypeId,
        method: 'get',
        isShowSpinner: true
      }).then(resType => {
        defaultQty = resType.data.data.quantity
        console.log(defaultQty)
      })
      ApiRequest({
        url: 'Plate/GetAvailablePlate?package=1',
        method: 'get',
        isShowSpinner: true
      }).then(resPlate => {
        setPlateOptions(resPlate.data.data.filter((row: any) => row.plateTypeId === data?.product?.plateTypeId))
      })
      console.log(data)
    }
  }, [data])

  const onSubmit = async () => {
    if (!formRef) {
      onCancel()
      return
    }
    let postRequestData: any = []
    let putRequestData: any = []
    const deleteRequestDataIds: any = []
    formRef.submit()
    const formValues = await formRef.validateFields()
    if (formValues) {
      const plateBox = formValues.plateBox || []
      // if (plateBox.filter((row: any) => !row.plateId && !row.isDelete).length) {
      //   SweetAlertService.errorMessage('Please assign all pallet or delete empty box.')
      //   return
      // }
      plateBox.map((row: any) => {
        if (row.isDelete) {
          deleteRequestDataIds.push(row.boxId)
        } else {
          if (postRequestBoxIdArrs.includes(row.boxId)) {
            postRequestData.push(row)
          } else {
            putRequestData.push(row)
          }
        }
      })
      postRequestData = postRequestData.filter((row: any) => row.plateId)
      putRequestData = putRequestData.filter((row: any) => row.plateId)
      console.log(postRequestData)
      console.log(putRequestData)
      console.log(deleteRequestDataIds)
      if (!postRequestData.length && !putRequestData.length && !deleteRequestDataIds.length) {
        SweetAlertService.errorMessage('请先添加箱子/Please add boxes firstly.')
        return
      }
      ApiRequest({
        url: 'PlateBox/AddAndUpdatePlateBoxAndBoxQuantity',
        method: 'put',
        data: {
          addList: postRequestData,
          updateList: putRequestData,
          deleteBoxIdList: deleteRequestDataIds
        }
      }).then(_ => {
        setReceivedQty(null)
        props.updateValueFn({
          comment: comment
        }).then((res: any) => {
          if (res !== 'err') {
            ApiRequest({
              url: 'PlateBox/AddAndUpdateListAndComplete',
              method: 'put',
              data: {
                addAndUpdatePlateBox: {
                  addList: postRequestData,
                  updateList: putRequestData,
                  deleteBoxIdList: deleteRequestDataIds
                },
                suborderId: data.suborderId,
                suborderLog: {
                  ...res,
                  machineId: machine.machineId
                }
              }
            }).then(_ => {
              onOk()
            })
          }
        })
      })
    }
  }

  const formItems: ItemElementPropsInterface[] | any = [
    [
      {name: ['plateBox', 'boxId'], isNotEditable: true, label: '箱子条形码/Box Barcode', inputElement: commonFormSelect(urlKey.Box, boxOptions, ['barCode'], false)},
      {name: ['plateBox', 'quantity'], label: '数量/Quantity', rules: [{type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['plateBox', 'plateId'], isNotEditable: true, label: '托盘/Pallet', inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], true)},
      {name: ['poDetail', 'isDelete'], label: '删除/Delete', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    ]
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    setFormRef(form)
  }

  const onReceivedQtyConfirm = () => {
    if (!receivedQty) {
      SweetAlertService.errorMessage('Received Qty Required.')
      return
    }
    const fieldsValue = formRef.getFieldsValue().plateBox
    const defaQty = fieldsValue[0].quantity
    console.log(fieldsValue)
    console.log(receivedQty)
    let remainQty: any = receivedQty
    const newFieldsValue = fieldsValue.map((row: any) => {
      if (remainQty < defaQty) {
        if (remainQty > 0) {
          const returnData = {
            ...row,
            quantity: remainQty
          }
          remainQty -= defaQty
          return returnData
        }
        return {
          ...row,
          quantity: 0
        }
      } else {
        remainQty -= defaQty
        return row
      }
    })
    console.log(newFieldsValue)
    formRef.setFieldsValue({
      plateBox: newFieldsValue
    })
  }

  const commentsForm = (
    <Form>
      <Form.Item name='comment' label={'备注/Comments'}>
        <Input
          value={comment}
          onChange={(e: any) => setComment(e.target.value)}
          placeholder="请输入/please enter"
        />
      </Form.Item>
    </Form>
  )

  return (
    <Modal destroyOnClose={true} title="打包完成/Packaging Complete" visible={isVisible} onCancel={onCancel} width={1000}
      footer={false}
    >
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button
          onClick={onSubmit}
          type="primary"
        >提交/Submit</Button>
      </div>
      <div style={{margin: '1rem 0'}}>
        {commentsForm}
      </div>
      <div style={{margin: '1rem 0'}}>
        实际收到数量/Actual Qty: <InputNumber value={receivedQty} onChange={(value) => setReceivedQty(value)} />
        <Button
          type="primary"
          ghost
          onClick={onReceivedQtyConfirm}
          style={{marginLeft: '2rem'}}
        >确认/Confirm</Button>
      </div>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <div style={{margin: '1rem 0'}}>
        {commentsForm}
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button
          onClick={onSubmit}
          type="primary"
        >提交/Submit</Button>
      </div>
    </Modal>
  )
}
