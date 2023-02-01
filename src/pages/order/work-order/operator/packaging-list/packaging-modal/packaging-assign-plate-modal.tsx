import React, {useEffect, useState} from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import { Button, InputNumber, Modal, Switch } from 'antd'
import {commonFormSelect, getSelectOptions} from '../../../../../../components/common/common-form/common-form-select'
import CommonForm, {ItemElementPropsInterface} from '../../../../../../components/common/common-form/common-form'
import {urlKey} from '../../../../../../services/api/api-urls'
import { checkMachineUserName } from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-modal'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import {PackagingPlateManagementModal} from '../packaging-modal/packaging-plate-management-modal'

export const PackagingAssignPlateModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any, isNotRequiredPassword: boolean}) => {
  let isDataAvailable = false
  let defaultQty: any = null
  const [initFormValues, setInitFormValues] = useState<any>()
  const [formRef, setFormRef] = useState<any>()
  const [formRef2, setFormRef2] = useState<any>()
  const [boxOptions, setBoxOptions] = useState([])
  const [plateOptions, setPlateOptions] = useState([])
  const [plateBoxData, setPlateBoxData] = useState([])
  const [plateTypeOptions, setPlateTypeOptions] = useState<any>([])
  const [currentPalletStacking, setCurrentPalletStacking] = useState<any>()
  const [postRequestBoxIdArrs, setPostRequestBoxIdArrs] = useState<any>([])
  const {visible, onOk, onCancel, data, machine} = props
  const [isVisible, setIsVisible] = useState(false)
  const [confirmEnable, setConfirmEnable] = useState(false)
  const [receivedQty, setReceivedQty] = useState<any>()
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    setConfirmEnable(false)
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
        setPlateBoxData(plateBoxData)
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
      getSelectOptions(urlKey.PlateType).then(res => setPlateTypeOptions(res))
      getSelectOptions(urlKey.PalletStacking).then(res => {
        const currStack = res.filter((row: any) => row.palletStackingId === data?.product?.palletStackingId)[0]
        setCurrentPalletStacking({
          ...currStack,
          url: currStack?.layoutImage?.split('---')[0] && JSON.parse(currStack?.layoutImage.split('---')[0]).url
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
      getAvailablePlate();
      console.log(data)
    }
  }, [data])

  const getAvailablePlate = async () => {
    ApiRequest({
      url: 'Plate/GetAvailablePlate?package=1',
      method: 'get',
      isShowSpinner: true
    }).then(resPlate => {
      // setPlateOptions(resPlate.data.data.filter((row: any) => row.plateTypeId === data?.product?.plateTypeId))
      const palletOptions = resPlate.data.data.filter((row: any) => row.plateTypeId === data?.product?.plateTypeId)
      ApiRequest({
        url: 'Plate/GetPalletBySuborder?suborderid=' + data.suborderId,
        method: 'get',
        isShowSpinner: true
      }).then(resPlate => {
        const palletOptions2 = resPlate.data.data
        palletOptions2.map((e:any) => {
          e.plateCode = e.plateCode + ' in Warehouse已经在入仓库'
          palletOptions.push(e)
        })
        setPlateOptions(palletOptions)
      })
    })
  }
  const onSubmit = async () => {
    setConfirmEnable(true)
    if (!formRef) {
      onCancel()
      setConfirmEnable(false)
      return
    }
    let postRequestData: any = []
    let putRequestData: any = []
    const deleteRequestDataIds: any = []
    formRef.submit()
    const formValues = await formRef.validateFields()
    if (formValues) {
      const plateBox = formValues.plateBox || []
      let isOpenNextModal = true
      if (plateBox.filter((row: any) => !row.plateId && !row.isDelete).length) {
        isOpenNextModal = false
      }
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
        setConfirmEnable(false)
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
        setConfirmEnable(false)
        setReceivedQty(null)
        onOk(isOpenNextModal)
      }).catch(_=>{
        setConfirmEnable(false)
      })
    }
  }

  const formItems: ItemElementPropsInterface[] | any = [
    [
      {name: ['plateBox', 'boxId'], isNotEditable: true, label: '箱子条形码/Box Barcode', inputElement: commonFormSelect(urlKey.Box, boxOptions, ['barCode'], false)},
      {name: ['plateBox', 'plateId'], isNotEditable: true, label: '托盘/Pallet', span: 12,inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false)},
      {name: ['poDetail', 'isDelete'], label: '删除/Delete', inputElement: <Switch />, otherProps: {valuePropName: 'checked'}},
    ]
  ]

  const formItems2: any = [
    [
      {name: ['configurePlateBox', 'quantity'], span: 8, addButtonText: '添加托盘/Add field', label: '(已分配: ' + plateBoxData.length + ')箱子数量/Qty', rules: [{type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['configurePlateBox', 'plateId'], label: '托盘号码/Pallet', inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'])},
    ]
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormChange2 = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    setFormRef(form)
  }

  const onFormBlur2 = (form: any) => {
    setFormRef2(form)
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

  return (
    <Modal destroyOnClose={true} title="打包分配托盘/Packaging Assign Pallet" visible={isVisible} onCancel={onCancel} width={1000}
      footer={false}
    >
       <PackagingPlateManagementModal visible= {isModalVisible} onOk={()=>{ getAvailablePlate(); setIsModalVisible(false)}} onCancel={()=>{ getAvailablePlate(); setIsModalVisible(false)}} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
      <Button
          onClick={()=>setIsModalVisible(true)} 
          style={{marginRight: '2rem'}}
        >托盘管理/Pallet</Button>        
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button  disabled={confirmEnable}
          onClick={onSubmit}
          type="primary"
        >提交/Submit</Button>
      </div>
      <div>{'The Pallet type is: ' + plateTypeOptions.filter((row: any) => row.plateTypeId === data?.product?.plateTypeId)[0]?.plateTypeName}</div>
      <div>
        <img src={currentPalletStacking?.url} style={{width: '13rem', padding: '1rem'}}/>
      </div>
      <div>
        托盘堆放箱数/Pallet Stacking Quantity: <b>{currentPalletStacking?.quantity}</b>
      </div>
      <div>
        箱子总数量/Box Qty: <b>{initFormValues?.plateBox.length}</b>
      </div>
      <CommonForm items={formItems2} onFormChange={onFormChange2} onFormBlur={onFormBlur2} />
      <div style={{margin: '1rem 0'}}>
        <Button
          type="primary"
          onClick={() => {
            if (!formRef || !formRef2) {
              SweetAlertService.errorMessage('No form.')
              return
            }
            const plateBox = formRef.getFieldsValue()?.plateBox || []
            const configurePlateBox = formRef2.getFieldsValue()?.configurePlateBox || []
            const newConfigurePlateBox: any = []
            let index = plateBoxData.length
            for (const configurePlateBoxItem of configurePlateBox) {
              for (let i = 0; i < configurePlateBoxItem.quantity; i++) {
                newConfigurePlateBox.push({
                  i: index,
                  plateId: configurePlateBoxItem.plateId
                })
                index++
              }
            }
            const newPlateBox = plateBox.map((row: any, i: any) => {
              const check = newConfigurePlateBox.find((item: any) => item.i === i)
              if (check) {
                return {
                  ...row,
                  plateId: check.plateId
                }
              }
              return row
            })
            formRef.setFieldsValue({
              plateBox: newPlateBox
            })
          }}
        >自动添加/Confirm Pallet Configure</Button>
      </div>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button disabled={confirmEnable}
          onClick={onSubmit}
          type="primary"
        >提交/Submit</Button>
      </div>
    </Modal>
  )
}
