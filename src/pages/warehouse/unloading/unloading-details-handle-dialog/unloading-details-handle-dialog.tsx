import { Button, Input, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
import { getCookie } from 'react-use-cookie'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import CommonDialog from '../../../../components/common/others/common-dialog'
import { ApiRequest } from '../../../../services/api/api'
import { urlType } from '../../../../services/api/api-urls'
import { chunkArr, getRandomKey } from '../../../../services/lib/utils/helpers'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import palletSticker from '../../../static/pdf/pallet-stickers/pallet-sticker'
import { getLocationCode } from '../../dispatch/dispatch-list/dispatch-order-details-table/dispatch-location-table/dispatch-location-table'
import ShowBoxBarCodeModal from '../boxes-edit-dialog/show-box-bar-code-modal'
import RawMaterialEditDialog from '../raw-material-box-edit/raw-material-edit/raw-material-edit-dialog'
import ShelfOrTempzoneDialog from '../shelf-or-tempzone-dialog/shelf-or-tempzone-dialog'
import AddBoxAndRawMaterialBoxDialog from './add-box-and-rawMaterialBox-dialog'

const UnloadingDetailsHandleDialog = (props: {unloadingDetailData: any, onDialogClose: any, inspectionId: any}) => {
  const groupNumberKey = 'GROUP_NUMBER_KEY'

  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<any>()
  // const [rawMaterialBoxAndBoxData, setRawMaterialBoxAndBoxData] = useState<any>()
  // const [plateOptions, setPlateOptions] = useState<any>([])
  const [groupNumber, setGroupNumber] = useState<number>(localStorage.getItem(groupNumberKey) ? JSON.parse(localStorage.getItem(groupNumberKey)!) : 10000)
  const [tempzoneOptions, setTempzoneOptions] = useState<any>([])
  const [selectedRowData, setSelectedRowData] = useState<any>()
  const [selectPlateOpen, setSelectPlateOpen] = useState(false)
  const [addBoxOpen, setAddBoxOpen] = useState(false)
  const [selectShelfOrTempzoneOpen, setSelectShelfOrTempzoneOpen] = useState(false)
  const [plateTitle, setPlateTitle] = useState<string>()
  const [isAddPlate, setIsAddPlate] = useState(false)
  const [isUpdatePlate, setIsUpdatePlate] = useState(false)
  const [selectedBoxCode, setSelectedBoxCode] = useState<any>()
  const [showBoxBarCode, setShowBoxBarCode] = useState<boolean>(false)
  const [canGenerate, setCanGenerate] = useState<boolean>(false)

  useEffect(() => {
    console.log(props.unloadingDetailData)
    // getSelectOptions('', 'Plate/GetEmptyAvailable?package=0')
    //   .then(res => {
    //     setPlateOptions(res)
    //   })
    getSelectOptions('', 'TempZone/GetZoneType')
      .then(res => {
        setTempzoneOptions(res)
      })
    // getSelectOptions(urlKey.PlateType).then(res => {
    //   let e = res
    //   if (res !== null) {
    //     e = res.filter((ele:any) => ele.plateTypeId !== 1)
    //   }
    //   setPlateTypeOptions(e)
    // })
    getRawMaterialData()
  }, [triggerResetData])

  const getRawMaterialData = async () => {
    const result = await ApiRequest({
      url: 'RawMaterialBox/GetRawMaterialBoxAndBoxByInspectionId?inspectionId=' + props.inspectionId,
      method: urlType.Get,
      isShowSpinner: true
    })
    const data = result.data.data
    console.log(data)
    data.rawMaterialBoxes.forEach((item: any) => {
      item.plateCode = item.plate?.plateCode
      item.rawMaterialName = item.rawMaterial?.rawMaterialName
      item.locationCode = getLocationCode(item)
    })
    data.rawMaterialBoxes = data.rawMaterialBoxes.sort((a: any, b: any) => a.boxCode - b.boxCode)

    const exWarehouseBoxes = data.rawMaterialBoxes
      .filter((box: any) => box.rawMaterialId === props.unloadingDetailData.rawMaterialId)
      .filter((box: any) => box.exWarehouse)

    const platedBoxesData = data.rawMaterialBoxes
      .filter((box: any) => box.rawMaterialId === props.unloadingDetailData.rawMaterialId)
      .filter((box: any) => box.exWarehouse === 0 && box.plateId !== null)
    const platedGroupData: any[] = []
    if (platedBoxesData !== null || platedBoxesData.length !== 0) {
      // get all id in a array
      const originPlateIdArray = platedBoxesData.map((box: any) => box.plateId)
      const plateIdArray = Array.from(new Set(originPlateIdArray))
      // separate boxes into group with same plate id, then add to platedGroupData array
      plateIdArray.forEach((id: any) => {
        const dataToGroup = platedBoxesData.filter((box: any) => box.plateId === id)
        platedGroupData.push(groupBoxesData(dataToGroup, dataToGroup.length)[0])
      })
    }
    const unPlateBoxesData = data.rawMaterialBoxes
      .filter((box:any) => box.rawMaterialId === props.unloadingDetailData.rawMaterialId)
      .filter((box: any) => box.exWarehouse === 0 && box.plateId === null)
    const unPlatedGroupData = groupBoxesData(unPlateBoxesData, groupNumber)
    const newGroupsData: any[] = []
    if (platedBoxesData !== null || platedBoxesData.length !== 0) {
      platedGroupData.forEach((item: any) => {
        newGroupsData.push(item)
      })
    }
    if (unPlatedGroupData !== null || unPlatedGroupData.length !== 0) {
      unPlatedGroupData.forEach((item: any) => {
        newGroupsData.push(item)
      })
    }
    console.log(newGroupsData)

    setInitFormValues({
      ...props.unloadingDetailData,
      unhandledQty: props.unloadingDetailData.revQuantity - data.rawMaterialBoxes.filter((item: any) => item.rawMaterialId === props.unloadingDetailData.rawMaterialId).length,
      exWarehouseQty: exWarehouseBoxes?.length,
      rawMaterialBoxes: newGroupsData,
      updatedAt: props.unloadingDetailData.updatedAt?.split('T')[0],
      createdName: props.unloadingDetailData.createdByNavigation && props.unloadingDetailData.createdByNavigation?.firstName + ' ' + props.unloadingDetailData.createdByNavigation?.lastName
    })
  }

  const formListElement = document.getElementsByClassName('jadcup-form-list')

  const getRowData = (target: any) => {
    // get index of current element, use index to get the correct row data
    const child = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    const index = formListElement && Array.prototype.findIndex.call(formListElement[0]?.children, (c) => c === child)
    return initFormValues.rawMaterialBoxes && initFormValues.rawMaterialBoxes[index - 1]
  }

  const setTree = (data: any, groupNum: number) => {
    const chunkedArr = chunkArr(data, groupNum)
    const newTreeData = chunkedArr.map((item: any, index: number) => ({
      title: item.title || (index + 1).toString(),
      key: item.title || getRandomKey(),
      children: (item.children || item).map((child: any) => ({
        title: child.title || child,
        key: child.key || child
      }))
    }))
    // console.log(newTreeData)
    return newTreeData
  }

  const groupBoxesData = (data: any, groupNum: number) => {
    return setTree(data, groupNum).map((group: any) => ({
      ...group,
      groupNumber: group.children[0].title.plateId ? 'Palletized' : `Unpalletized ${group.title}`,
      groupDetail: group.children.length,
      plate: group.children[0].title.plate,
      plateCode: group.children[0].title.plate?.plateCode,
      plateId: group.children[0].title.plate?.plateId,
      rawMaterialName: group.children[0].title?.rawMaterialName,
      isCell: group.children[0].title.cell ? 1 : (group.children[0].title.tempzone ? 1 : 0),
      locationCode: getLocationCode(group.children[0].title),
      groupNum: groupNumber,
      groupStatus: getGroupStatus(groupNum, !!group.children[0].title.plateId, !!group.children[0].title.cell, !!group.children[0].title.tempzone)}))
  }

  const getGroupStatus = (groupSize: number, isPlated: boolean, isShelled: boolean, isTempzone: boolean) => {
    if (!isPlated) {
      return `${groupSize} boxes Unpalletized`
    } else {
      if (!isShelled && !isTempzone) {
        return `${groupSize} boxes Palletized`
      } else if (isShelled) {
        return `${groupSize} boxes in Shell`
      } else if (isTempzone) {
        return `${groupSize} boxes in Tempzone`
      } else {
        return 'Status Wrong'
      }
    }
  }

  const onAddRecord = () => {
    setAddBoxOpen(true)
    setPlateTitle('')
    setIsAddPlate(false)
    setIsUpdatePlate(false)
    setCanGenerate(false)
  }

  const barcodeDetails = (row: any) => {
    const rowToUse = getRowData(row.target)
    console.log(initFormValues)
    setSelectedBoxCode(rowToUse?.children)
    setShowBoxBarCode(true)
  }

  const onSelectPlate = (row: any) => {
    const rowToUse = getRowData(row.target)

    setSelectPlateOpen(true)
    setPlateTitle('')
    setCanGenerate(true)
    if (!rowToUse?.plate) {
      setIsAddPlate(true)
      setIsUpdatePlate(false)
    } else {
      setIsAddPlate(false)
      setIsUpdatePlate(true)
    }
    setSelectedBoxCode(rowToUse?.children)
  }

  const printBarcode = (row: any) => {
    const rowToUse = getRowData(row.target)

    if (rowToUse?.plate && rowToUse.plate?.plateTypeId !== 100) {
      SweetAlertService.successMessage(rowToUse.plateCode)
      palletSticker(rowToUse.plateCode, 'print')
    } else {
      SweetAlertService.errorMessage('Only temporary plate can be printed.')
    }
  }

  const onSelectShelfOrTempzone = (row: any) => {
    const rowToUse = getRowData(row.target)
    console.log(rowToUse)
    setSelectedRowData(rowToUse)
    setSelectShelfOrTempzoneOpen(true)
  }

  const onDeleteRow = (row: any) => {
    const rowToUse = getRowData(row.target)
    const ids = rowToUse?.children.map((row: any) => row.title?.rawMaterialBoxId)
    ApiRequest({
      url: 'RawMaterialBox/ObsoleteRawMaterialBoxes',
      method: 'delete',
      data: ids
    }).then(_ => {
      setTriggerResetData(getRandomKey())
    })
  }

  const onNoteChange = (e: any) => {
    setInitFormValues({...initFormValues, note: e.target.value})
  }

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'rawMaterialName', label: 'Raw Material Name', span: 4, inputElement: <Input readOnly={true} />},
    {name: 'revQuantity', label: 'Rev Qty', span: 2, inputElement: <InputNumber readOnly={true} />},
    {name: 'unhandledQty', label: 'Unhandled', span: 2, inputElement: <InputNumber readOnly={true} />},
    // {name: 'exWarehouseQty', label: 'Exwarehouse', span: 2, inputElement: <InputNumber readOnly={true} />},
    {name: '', label: '', span: 2, inputElement: <Button type="primary" style={{marginTop: '1.9rem'}} onClick={onAddRecord}>Add Record</Button>},
    [
      // {name: ['rawMaterialBoxes', 'rawMaterialName'], label: 'Raw Material', span: 4, isNotEditable: true, inputElement: <Input readOnly={true} />},
      // {name: ['rawMaterialBoxes', 'unit'], label: 'Unit', span: 1, isNotEditable: true, inputElement: <Input readOnly={true} />},
      {name: ['rawMaterialBoxes', 'groupDetail'], label: 'Selected Qty', span: 2, inputElement: <Input readOnly={true}/>},
      {name: ['rawMaterialBoxes', ''], label: '', span: 2, inputElement: <Button type="primary" onClick={(row: any) => barcodeDetails(row)}>Barcode Details</Button>},
      {name: ['rawMaterialBoxes', 'plateCode'], label: 'Pallet', span: 2, inputElement: <Input readOnly={true} />},
      // {name: ['rawMaterialBoxes', ''], label: '', span: 4, inputElement: <div style={{display: 'flex'}}><Button type="primary" onClick={(row: any) => onNewTemporaryPlate(row)}>Generate</Button>{commonFormSelect(urlKey.PlateType, plateTypeOptions, [], false, (value: any) => setSelectedPlateType(value), null, 'Select a pallet type')}</div>},
      {name: ['rawMaterialBoxes', ''], label: '', span: 2, inputElement: <Button type="primary" onClick={(row: any) => onSelectPlate(row)}>Select Pallet</Button>},
      {name: ['rawMaterialBoxes', ''], label: '', span: 2, inputElement: <Button type="primary" onClick={(row: any) => printBarcode(row)}>Print Barcode</Button>},
      {name: ['rawMaterialBoxes', ''], label: '', span: 3, inputElement: <Button type="primary" onClick={(row: any) => onSelectShelfOrTempzone(row)}>Select Shelf or Tempzone</Button>},
      {name: ['rawMaterialBoxes', 'locationCode'], label: 'Shelf or Tempzone', span: 3, inputElement: <Input readOnly={true}/>},
      {name: ['rawMaterialBoxes', ''], label: '', span: 2, inputElement: <Button type="primary" onClick={(row: any) => onDeleteRow(row)}>Delete</Button>},
    ],
    // {name: 'note', label: 'Note', span: 24, inputElement: <Input onChange={(e) => onNoteChange(e)} />},
    {name: 'updatedAt', label: 'Create Time', span: 2, inputElement: <Input readOnly={true}/>},
    {name: 'createdName', label: 'Create by', span: 3, inputElement: <Input />},
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = () => {
    const data: any = {}
    data.detailId = initFormValues.detailId
    data.note = initFormValues.note
    data.createdBy = parseInt(getCookie('id'))
    ApiRequest({
      url: '/UnloadingInspection/UpdateDetail',
      method: 'put',
      data: data
    }).then(_ => {
      props.onDialogClose(true)
    })
  }

  const onAddBoxClose = (isModified: boolean) => {
    setAddBoxOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const onSelectPlateClose = (isModified: boolean) => {
    setSelectPlateOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const onSelectShelfOrTempzoneClose = (isModified: boolean) => {
    setSelectShelfOrTempzoneOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const RawMaterialManagementDialog = <RawMaterialEditDialog unloadingInspectionData={null} inspectionId={props.inspectionId} onDialogClose={() => onSelectPlateClose(true)} isAddPlate={isAddPlate} isUpdatePlate={isUpdatePlate} boxCode={selectedBoxCode} canGenerate={canGenerate} unloadingDetailData={props.unloadingDetailData}/>
  const selectShelfOrTempzoneDialog = <ShelfOrTempzoneDialog onDialogClose={() => onSelectShelfOrTempzoneClose(true)} isModalVisible={selectShelfOrTempzoneOpen} selectedRowData={selectedRowData} tempzoneOptions={tempzoneOptions}/>
  const AddBoxDialog = <AddBoxAndRawMaterialBoxDialog inspectionId={props.inspectionId} unloadingDetailData={props.unloadingDetailData} onDialogClose={() => onAddBoxClose(true)} isBoxesEdit={false} tempzoneOptions={tempzoneOptions} maxQty={initFormValues?.unhandledQty?initFormValues?.unhandledQty:0}/>

  return (
    <div>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <CommonDialog width={'47%'} title={plateTitle} open={selectPlateOpen} onDialogClose={onSelectPlateClose} dialogContent={RawMaterialManagementDialog} />
      <CommonDialog width={'47%'} title={'Select Shelf or Tempzone'} open={selectShelfOrTempzoneOpen} onDialogClose={onSelectShelfOrTempzoneClose} dialogContent={selectShelfOrTempzoneDialog} />
      <CommonDialog width={'47%'} title={'Add Box'} open={addBoxOpen} onDialogClose={onAddBoxClose} dialogContent={AddBoxDialog}  />
      <ShowBoxBarCodeModal boxBarCodeModalVisible={showBoxBarCode} closeModal={() => setShowBoxBarCode(false)} groupArray={selectedBoxCode}/>
      <p>Note</p>
      <Input defaultValue={props.unloadingDetailData?.note} onChange={onNoteChange} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
        >Cancel</Button>
        <Button
          disabled={!formRef}
          onClick={onConfirm}
          type="primary"
          style={{ margin: '0 2rem' }}
        >Confirm</Button>
      </div>
    </div>
  )
}

export default UnloadingDetailsHandleDialog