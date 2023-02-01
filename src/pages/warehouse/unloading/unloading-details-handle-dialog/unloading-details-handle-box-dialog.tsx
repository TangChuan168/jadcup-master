import { BarcodeOutlined, DeleteOutlined, FileAddOutlined, PrinterOutlined } from '@ant-design/icons'
import { Button, DatePicker, Input, InputNumber } from 'antd'
import moment from 'moment'
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
import SelectPalletModal from '../boxes-edit-dialog/select-pallet-modal'
import ShowBoxBarCodeModal from '../boxes-edit-dialog/show-box-bar-code-modal'
import RawMaterialEditDialog from '../raw-material-box-edit/raw-material-edit/raw-material-edit-dialog'
import ShelfOrTempzoneDialog from '../shelf-or-tempzone-dialog/shelf-or-tempzone-dialog'
import AddBoxAndRawMaterialBoxDialog from './add-box-and-rawMaterialBox-dialog'

const UnloadingDetailsHandleBoxDialog = (props: {unloadingDetailData: any, onDialogClose: any, inspectionId: any, productId: any}) => {
  const groupNumberKey = 'GROUP_NUMBER_KEY'

  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [formRef, setFormRef] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<any>()
  // const [rawMaterialBoxAndBoxData, setRawMaterialBoxAndBoxData] = useState<any>()
  // const [groupNumber, setGroupNumber] = useState<number>(localStorage.getItem(groupNumberKey) ? JSON.parse(localStorage.getItem(groupNumberKey)!) : 10000)
  const [groupNumber, setGroupNumber] = useState<number>(10000)
  const [groupArray, setGroupArray] = useState<any>([])
  const [tempzoneOptions, setTempzoneOptions] = useState<any>([])
  const [selectedRowData, setSelectedRowData] = useState<any>()
  const [selectPlateOpen, setSelectPlateOpen] = useState(false)
  const [addBoxOpen, setAddBoxOpen] = useState(false)
  const [selectShelfOrTempzoneOpen, setSelectShelfOrTempzoneOpen] = useState(false)
  const [qtyPerBox, setQtyPerBox] = useState<number>()
  const [plateTitle, setPlateTitle] = useState<string>()
  const [isAddPlate, setIsAddPlate] = useState(false)
  const [isUpdatePlate, setIsUpdatePlate] = useState(false)
  const [plateOptions, setPlateOptions] = useState<any>([])
  const [selectedPlate, setSelectedPlate] = useState<any>()
  const [selectedBoxCode, setSelectedBoxCode] = useState<any>()
  const [showSelectPallet, setShowSelectPallet] = useState<boolean>(false)
  const [showBoxBarCode, setShowBoxBarCode] = useState<boolean>(false)
  const [canGenerate, setCanGenerate] = useState<boolean>(false)

  useEffect(() => {
    console.log(props.unloadingDetailData)
    console.log(props.inspectionId)
    ApiRequest({
      url: 'Plate/GetAvailablePlate?package=0',
      method: 'get',
      isShowSpinner: true
    }).then(resPlate => {
      setPlateOptions(resPlate.data.data)
    })
    getSelectOptions('', 'TempZone/GetZoneType').then((res) => {
      setTempzoneOptions(res)
    })
    getRawMaterialData()
  }, [triggerResetData])

  const getRawMaterialData = async () => {
    const result = await ApiRequest({
      url: 'RawMaterialBox/GetRawMaterialBoxAndBoxByInspectionId?inspectionId=' + props.inspectionId,
      method: urlType.Get,
      isShowSpinner: true,
    })
    const data = result.data.data
    console.log(data)
    const resultProduct = await ApiRequest({
      url: 'Product/GetProductById?Id=' + props.productId,
      method: urlType.Get,
      isShowSpinner: true,
    })
    if (!resultProduct.data.data?.baseProduct?.packagingType?.quantity) {
      SweetAlertService.errorMessage('Product package confirgure error')
      return
    }
    setQtyPerBox(resultProduct.data.data?.baseProduct?.packagingType?.quantity)
    data.boxes.forEach((item: any) => {
      item.productName = item.product.productName
      item.plateCode = item.plate?.plateCode
    })

    // get boxes with plate id
    data.boxes = data.boxes.sort((e1:any, e2:any) => {
      if (e1.barCode > e2.barCode) {
        return 1
      }
      if (e1.barCode < e2.barCode) {
        return -1
      }
      return 0
    })

    const exWarehouseBoxes = data.boxes
      .filter((box: any) => box.productId === props.productId)
      .filter((box: any) => box.exWarehouse)

    const platedBoxesData = data.boxes
      .filter((box:any) => box.productId === props.productId)
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
    const unPlateBoxesData = data.boxes.filter((box:any) => box.productId === props.productId)
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

    const getDefaultDate=()=>{
      let updatedAt = props.unloadingDetailData.updatedAt?.split('T')[0];
      let currentdate = new Date(); 
      let s_date =currentdate.getFullYear() + "-" + currentdate.getDate() + "-"
                  + (currentdate.getMonth()+1)  + "-" 
                  + currentdate.getFullYear() ;    
      updatedAt = updatedAt?updatedAt:s_date;
      return updatedAt;
    }
    const getDefaultStaff=()=>{
      let name = props.unloadingDetailData.createdByNavigation?.firstName;
      // + ' ' + props.unloadingDetailData.createdByNavigation?.lastName
      if (name == null)
        name = getCookie("userName")
      return name
    }

    setInitFormValues({
      ...props.unloadingDetailData,
      unhandledQty: props.unloadingDetailData.revQuantity - data.boxes.filter((item: any) => item.productId === props.productId).length,
      exWarehouseQty: exWarehouseBoxes?.length,
      boxes: data.boxes.filter((item: any) => item.productId === props.productId),
      groupNumber: groupNumber,
      groupBoxes: newGroupsData,
      updatedAt: getDefaultDate(),
      createdName: getDefaultStaff()
    })
  }

  const formListElement = document.getElementsByClassName('jadcup-form-list')

  // const groupData = () => {}

  const getRowData = (target: any) => {
    // get index of current element, use index to get the correct row data
    const child = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    const index = formListElement && Array.prototype.findIndex.call(formListElement[0]?.children, (c) => c === child)
    return initFormValues.groupBoxes && initFormValues.groupBoxes[index - 1]
  }

  // const handleSelectNumber = () => {
  //   const number = parseInt((document.getElementById('inputGroupNumber') as HTMLInputElement).value)
  //   setGroupNumber(number)
  //   localStorage.setItem(groupNumberKey, JSON.stringify(number))
  //   setTriggerResetData(getRandomKey())
  // }

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
      groupDetail: `${group.children.length} cartons`,
      plate: group.children[0].title.plate,
      plateCode: group.children[0].title.plate?.plateCode,
      plateId: group.children[0].title.plate?.plateId,
      productName: group.children[0].title?.productName,
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
    // console.log(initFormValues)
    setGroupArray(rowToUse?.children)
    setShowBoxBarCode(true)
  }

  const onSelectPlate = (row: any) => {
    const rowToUse = getRowData(row.target)

    setGroupArray(rowToUse?.children)
    setTimeout(() => {
      setShowSelectPallet(true)
    }, 300)
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
    const ids = rowToUse?.children.map((row: any) => row.title?.boxId)
    ApiRequest({
      url: 'Box/ObsoleteBoxs',
      method: 'put',
      data: ids
    }).then(_ => {
      setTriggerResetData(!triggerResetData)
    })
  }

  const onNoteChange = (e: any) => {
    setInitFormValues({...initFormValues, note: e.target.value})
  }

  const formItems: ItemElementPropsInterface[] | any = [
    {name: 'rawMaterialName', label: 'Product Name', span: 4, inputElement: <Input readOnly={true} />},
    {name: 'revQuantity', label: 'Rev Qty', span: 2, inputElement: <InputNumber readOnly={true} />},
    {name: 'unhandledQty', label: 'Unhandled', span: 2, inputElement: <InputNumber readOnly={true} />},
    // {name: 'exWarehouseQty', label: 'Exwarehouse', span: 2, inputElement: <InputNumber readOnly={true} />},
    {name: '', label: '', span: 4, inputElement: <Button ghost type="primary" style={{marginTop: '1.9rem'}} onClick={onAddRecord}><div><FileAddOutlined />Add</div></Button>},
    // {name: 'groupNumber', label: 'Qty per Pallet', span: 2, inputElement: <InputNumber id="inputGroupNumber" readOnly={false} />},
    // {name: '', label: '', span: 2, inputElement: <Button type="primary" style={{marginTop: '1.9rem'}} onClick={handleSelectNumber}>Confirm</Button>},
    [
      // {name: ['groupBoxes', 'productName'], label: 'Raw Material', span: 4, isNotEditable: true, inputElement: <Input readOnly={true} />},
      // {name: ['groupBoxes', 'unit'], label: 'Unit', span: 1, isNotEditable: true, inputElement: <Input readOnly={true} />},
      {name: ['groupBoxes', 'groupDetail'], label: 'Selected Qty', span: 2, inputElement: <Input readOnly={true}/>},
      {name: ['groupBoxes', ''], label: '', span: 2, inputElement: <Button ghost type="primary" onClick={(row: any) => barcodeDetails(row)}><div><BarcodeOutlined />Details</div></Button>},
      {name: ['groupBoxes', 'plateCode'], label: 'Pallet', span: 3, inputElement: <Input readOnly={true} />},
      // {name: ['rawMaterialBoxes', ''], label: '', span: 4, inputElement: <div style={{display: 'flex'}}><Button type="primary" onClick={(row: any) => onNewTemporaryPlate(row)}>Generate</Button>{commonFormSelect(urlKey.PlateType, plateTypeOptions, [], false, (value: any) => setSelectedPlateType(value), null, 'Select a pallet type')}</div>},
      {name: ['groupBoxes', ''], label: '', span: 2, inputElement: <Button ghost type="primary" onClick={(row: any) => onSelectPlate(row)}>Select Pallet</Button>},
      {name: ['groupBoxes', ''], label: '', span: 2, inputElement: <Button ghost type="primary" onClick={(row: any) => printBarcode(row)}><div><PrinterOutlined />Barcode</div></Button>},
      {name: ['groupBoxes', ''], label: '', span: 3, inputElement: <Button ghost type="primary" onClick={(row: any) => onSelectShelfOrTempzone(row)}>Shelf or Zone</Button>},
      {name: ['groupBoxes', 'locationCode'], label: 'Shelf or Tempzone', span: 3, inputElement: <Input readOnly={true}/>},
      {name: ['groupBoxes', ''], label: '', span: 2, inputElement: <Button danger type="primary" onClick={(row: any) => onDeleteRow(row)}><div>Delete</div></Button>},
    ],
    // {name: 'note', label: 'Note', span: 24, inputElement: <Input onChange={onNoteChange} />},
    {name: 'updatedAt', label: 'Create Time',span: 2, inputElement: <Input readOnly={true}/>},
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
    // if (isModified) {
      setTriggerResetData(!triggerResetData)
    // }
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
  const onSelectPalletModalClose = (isModified: boolean) => {
    setShowSelectPallet(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const submitShowSelectPalletModal = () => {
    console.log('groupArray', groupArray)
    groupArray?.length && groupArray[0] && groupArray[0]?.title?.plateId ?
      ApiRequest({
        url: 'RawMaterialBox/updateListToPlate',
        method: 'put',
        data: groupArray?.map((item: any) => ({boxId: item.title.boxId, plateId: selectedPlate}))
      }).then(_ => {
        setTriggerResetData(getRandomKey())
      }) :
      ApiRequest({
        url: 'RawMaterialBox/AddListToPlate',
        method: 'post',
        data: groupArray?.map((item: any) => ({boxId: item.title.boxId, plateId: selectedPlate}))
      }).then(_ => {
        setTriggerResetData(getRandomKey())
      })
    setShowSelectPallet(false)
    setSelectedPlate(null)
  }

  const onNewTemporaryPlate = () => {
    console.log('groupArray', groupArray)
    ApiRequest({
      url: 'Plate/AddTemporaryPlate?plateTypeId=2',
      method: 'post',
      isShowSpinner: true
    }).then(_ => {
      groupArray && groupArray[0] && groupArray[0]?.title?.plateId ?
        ApiRequest({
          url: 'RawMaterialBox/updateListToPlate',
          method: 'put',
          data: groupArray?.map((item: any) => ({boxId: item.title.boxId, plateId: _.data.data}))
        }).then(_ => {
          ApiRequest({
            url: 'Plate/GetAllPlate',
            method: 'get',
            isShowSpinner: true
          }).then(res => {
            setTriggerResetData(getRandomKey())
            setShowSelectPallet(false)
          })
        }) :
        ApiRequest({
          url: 'RawMaterialBox/AddListToPlate',
          method: 'post',
          data: groupArray?.map((item: any) => ({boxId: item.title.boxId, plateId: _.data.data}))
        }).then(_ => {
          ApiRequest({
            url: 'Plate/GetAllPlate',
            method: 'get',
            isShowSpinner: true
          }).then(res => {
            setTriggerResetData(getRandomKey())
            setShowSelectPallet(false)
          })
        })
    })
  }

  const RawMaterialManagementDialog = <RawMaterialEditDialog unloadingInspectionData={null} inspectionId={props.inspectionId} onDialogClose={() => onSelectPlateClose(true)} isAddPlate={isAddPlate} isUpdatePlate={isUpdatePlate} boxCode={selectedBoxCode} canGenerate={canGenerate} isBoxesEdit={true} unloadingDetailData={props.unloadingDetailData}/>
  const selectShelfOrTempzoneDialog = <ShelfOrTempzoneDialog onDialogClose={() => onSelectShelfOrTempzoneClose(true)} isModalVisible={selectShelfOrTempzoneOpen} selectedRowData={selectedRowData} tempzoneOptions={tempzoneOptions}/>
  const AddBoxDialog = <AddBoxAndRawMaterialBoxDialog inspectionId={props.inspectionId} unloadingDetailData={props.unloadingDetailData} onDialogClose={() => onAddBoxClose(true)} isBoxesEdit={true} qtyPerBox={qtyPerBox} tempzoneOptions={tempzoneOptions} maxQty={initFormValues?.unhandledQty?initFormValues?.unhandledQty:0}/>

  return (
    <div>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <CommonDialog width={'47%'} title={plateTitle} open={selectPlateOpen} onDialogClose={onSelectPlateClose} dialogContent={RawMaterialManagementDialog} />
      <CommonDialog width={'47%'} title={'Select Shelf or Tempzone'} open={selectShelfOrTempzoneOpen} onDialogClose={onSelectShelfOrTempzoneClose} dialogContent={selectShelfOrTempzoneDialog} />
      <CommonDialog width={'47%'} title={'Add Box'} open={addBoxOpen} onDialogClose={onAddBoxClose} dialogContent={AddBoxDialog} />
      <SelectPalletModal selectPalletModalVisible={showSelectPallet} submitModal={submitShowSelectPalletModal} closeModal={() => onSelectPalletModalClose(false)} plateOptions={plateOptions} selectedPlate={selectedPlate} setSelectedPlate={setSelectedPlate} canGenerate={true} onNewTemporaryPlate={onNewTemporaryPlate}/>
      <ShowBoxBarCodeModal boxBarCodeModalVisible={showBoxBarCode} closeModal={() => setShowBoxBarCode(false)} groupArray={groupArray}/>
      <p>Note</p>
      <Input defaultValue={props.unloadingDetailData?.note} onChange={onNoteChange} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '2rem'}}>
        <Button onClick={() => props.onDialogClose(false)}>
          Cancel
        </Button>
        <Button disabled={!formRef} onClick={onConfirm} type='primary' style={{ margin: '0 2rem' }}>
          Confirm
        </Button>
      </div>
    </div>
  )
}

export default UnloadingDetailsHandleBoxDialog

