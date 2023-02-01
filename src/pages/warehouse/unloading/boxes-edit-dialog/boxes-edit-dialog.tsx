import React, { useEffect, useState } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import BoxesEditDialogColumnModel from './boxes-edit-dialog-column-model'
import { urlKey, urlType } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import { chunkArr, getRandomKey } from '../../../../services/lib/utils/helpers'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import CommonDialog from '../../../../components/common/others/common-dialog'
import RawMaterialEditDialog from '../raw-material-box-edit/raw-material-edit/raw-material-edit-dialog'
import { CommonCheckboxTree } from '../../../../components/common/others/common-checkbox-tree'
import { commonFormSelect } from '../../../../components/common/common-form/common-form-select'
import { Button, Form, InputNumber ,Checkbox,Row,Col} from 'antd'
import { movePlateToShelfRequest } from '../../../../services/others/temporary-zone-services'
import { MoveToCellModal } from '../../temporary-Zone/move-to-cell-modal'
import { getLocationCode } from '../../dispatch/dispatch-list/dispatch-order-details-table/dispatch-location-table/dispatch-location-table'
import { MoveToTempZone } from '../../relocate-plate/relocate-plate-page'
import ShowBoxBarCodeModal from './show-box-bar-code-modal'
import SelectPalletModal from './select-pallet-modal'
import { isString } from 'lodash'
import { data } from 'jquery'

const BoxesEditDialog = (props: {inspectionId: any, unloadingInspectionData: any,productId?:any}): any => {
  const groupNumberKey = 'GROUP_NUMBER_KEY'

  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState<string>()
  const [isChecked, setIsChecked] = useState<boolean>(false)  
  const [boxesData, setBoxesData] = useState<any>([])
  const [groupsData, setGroupsData] = useState<any>([])
  const [groupArray, setGroupArray] = useState<any>([])
  const [groupNumber, setGroupNumber] = useState<number>(localStorage.getItem(groupNumberKey) ? JSON.parse(localStorage.getItem(groupNumberKey)!) : 10)
  const [boxesCheckbox, setBoxesCheckbox] = useState<any>()
  const [plateOptions, setPlateOptions] = useState<any>([])
  const [selectedPlate, setSelectedPlate] = useState<any>()
  const [selectedRowData, setSelectedRowData] = useState<any>()
  const [selectedCell, setSelectedCell] = useState<any>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [zoneTypeOptions, setZoneTypeOptions] = useState<any>()
  const [showBoxBarCode, setShowBoxBarCode] = useState<boolean>(false)
  const [showSelectPallet, setShowSelectPallet] = useState<boolean>(false)
  const [statusNumber, setStatusNumber] = useState<{unpalletizedNumber: number, palletizedNumber: number, shellNumber: number, tempzoneNumber: number}>()

  useEffect(() => {
    ApiRequest({
      url: 'Plate/GetAvailablePlate?package=0',
      method: 'get',
      isShowSpinner: true
    }).then(resPlate => {
      setPlateOptions(resPlate.data.data)
    })
    ApiRequest({
      url: 'TempZone/GetZoneType',
      method: 'get',
      isShowSpinner: false
    }).then((res: any) => {
      const obj: any = {}
      res.data.data.forEach((row: any) => {
        obj[row.zoneType] = row.zoneTypeName
      })
      setZoneTypeOptions(obj)
    })
  }, [])

  const onDialogClose = (isModified: boolean) => {
    setOpen(false)
    if (isModified) {
      setTriggerResetData(!triggerResetData)
    }
  }

  const RawMaterialManagementDialog = <RawMaterialEditDialog unloadingInspectionData={props.unloadingInspectionData} inspectionId={props.inspectionId} onDialogClose={onDialogClose} isBoxesEdit={true} />

  const actionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add New Boxes',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('')
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Shelf',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (!rowData.plateId) {
          SweetAlertService.errorMessage('Assign pallet firstly')
          return
        }
        if (rowData.cell) {
          SweetAlertService.errorMessage('Already moved to cell')
        } else {
          setSelectedRowData(rowData)
          showModal()
        }
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Tempzone',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        MoveToTempZone(rowData.plateId, zoneTypeOptions, () => {
          setTriggerResetData(getRandomKey())
        })
      }
    }
  ]

  const groupActionButtons: any = [
    {
      icon: '', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add New',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setDialogTitle('')
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'BarCode',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setGroupArray(rowData.children)
        setShowBoxBarCode(!showBoxBarCode)
        // console.log(boxesCheckbox)
        // console.log(selectedPlate)
        // console.log(boxesData)
        // console.log(boxesData.filter((row: any) => !row.plateId).map((row: any) => row.barCode))
        // console.log(boxesData.filter((item: any) => boxesCheckbox.includes(item.barCode)).map((item: any) => ({boxId: item.boxId, plateId: selectedPlate})))
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Pallet',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (rowData.children[0].title.plateId) {
          SweetAlertService.errorMessage('Already have pallet')
          return
        } else {
          setShowSelectPallet(true)
          setGroupArray(rowData.children)
        }
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Shelf',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        if (!rowData.children[0].title.plateId) {
          SweetAlertService.errorMessage('Assign pallet firstly')
          return
        }
        if (rowData.children[0].title.cell) {
          SweetAlertService.errorMessage('Already moved to cell')
        } else {
          setSelectedRowData(rowData.children[0].title)
          showModal()
        }
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Zone',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        MoveToTempZone(rowData.children[0].title.plateId, zoneTypeOptions, () => {
          setTriggerResetData(getRandomKey())
        })
      }
    }
  ]

  const closeShowBoxBarCodeModal = () => {
    setShowBoxBarCode(false)
  }

  const closeShowSelectPalletModal = () => {
    setShowSelectPallet(false)
  }

  const submitShowSelectPalletModal = () => {
    ApiRequest({
      url: 'RawMaterialBox/AddListToPlate',
      method: 'post',
      data: groupArray.map((item: any) => ({boxId: item.title.boxId, plateId: selectedPlate}))
    }).then(_ => {
      setTriggerResetData(getRandomKey())
    })
    setShowSelectPallet(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    ApiRequest({
      url: 'ShelfPlate/AddShelfPlate',
      method: 'post',
      data: {
        cellId: selectedCell,
        plateId: selectedRowData.plateId
      }
    }).then(_ => {
      setButtonDisabled(true)
      setTriggerResetData(getRandomKey())
    })
  }

  const selectOnChangeHandler = (value:any) => {
    console.log(value)
    setSelectedCell(value)
    setButtonDisabled(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setButtonDisabled(true)
  }

  const handleSelectNumber = () => {
    const number = parseInt((document.getElementById('inputGroupNumber') as HTMLInputElement).value)
    setGroupNumber(number)
    localStorage.setItem(groupNumberKey, JSON.stringify(number))
    setTriggerResetData(getRandomKey())
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
    console.log(newTreeData)
    return newTreeData
  }

  const groupBoxesData = (data: any, groupNum: number) => {
    return setTree(data, groupNum).map((group: any) => ({
      ...group,
      groupNumber: group.children[0].title.plateId ? 'Palletized' : `Unpalletized ${group.title}`,
      groupDetail: `${group.children.length} cartons`,
      plate: group.children[0].title.plate,
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

  const getStatusNumber = (data: any[]) => {
    let unpalletizedNumber = 0
    let palletizedNumber = 0
    let shellNumber = 0
    let tempzoneNumber = 0
    data.forEach((group: any) => {
      if (!group.children[0].title.plateId) {
        unpalletizedNumber += group.children.length
      }
      if (group.children[0].title.plateId && !group.children[0].title.cell && !group.children[0].title.tempzone) {
        palletizedNumber += group.children.length
      }
      if (group.children[0].title.cell) {
        shellNumber += group.children.length
      }
      if (group.children[0].title.tempzone) {
        tempzoneNumber += group.children.length
      }
    })
    return {unpalletizedNumber, palletizedNumber, shellNumber, tempzoneNumber}
  }

  const getPalletizedNumber = (data: any[]) => {
    let number = 0
    data.forEach((group: any) => {
      if (group.children[0].title.plateId && !group.children[0].title.cell && !group.children[0].title.tempzone) {
        number += group.children.length
      }
    })
    return number
  }

  const onChangeHandler = (e:any) => {
    // console.log(e.target.checked)
    setIsChecked(!isChecked)
  }
  
  return (
    <div>
      {/* <CommonCheckboxTree
        data={boxesData.filter((row: any) => !row.plateId).map((row: any) => row.barCode)}
        isShowTree={false}
        onChange={(list: any) => {
          setBoxesCheckbox(list)
        }}
        isNotShowChinese={true}
      /> */}
      {groupsData.length !== 0 && (
        <h5>
          Groups Status: 
          {statusNumber?.unpalletizedNumber} boxes Unpalletized. {statusNumber !== null && statusNumber?.palletizedNumber !== 0 ? `${statusNumber?.unpalletizedNumber} boxes palletized, ` : ''}
          {statusNumber !== null && statusNumber?.shellNumber !== 0 ? `${statusNumber?.shellNumber} boxes in Shell, ` : ''}
          {statusNumber !== null && statusNumber?.tempzoneNumber !== 0 ? `${statusNumber?.tempzoneNumber} boxes in Tempzone` : ''}.
        </h5>
      )}
      <div style={{margin: '1rem 0'}}>
        <Row>
        <Col span={12}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <span>Quantity Per Pallet:</span>
            <InputNumber id="inputGroupNumber" style={{ marginLeft: '1rem' }} defaultValue={groupNumber} />
            <Button style={{ marginLeft: '1rem' }} type="primary" onClick={handleSelectNumber}>Confirm</Button>
          </div>
          </Col>
          <Col span={4}>
          <Checkbox style={{ marginLeft: '0.5rem' }} onChange={onChangeHandler} checked={isChecked} />See Details
          </Col>
        </Row>
        {/* <Form>
          <Form.Item style={{width: '50%'}} name="plate" label="Batch change pallet">
            {commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false, (value: any) => {
              setSelectedPlate(value)
            })}
          </Form.Item>
        </Form>
        <Button
          type="primary"
          danger
          disabled={!boxesCheckbox?.length || !selectedPlate}
          onClick={async () => {
            const result = await SweetAlertService.confirmMessage()
            if (result) {
              console.log(boxesCheckbox)
              console.log(selectedPlate)
              console.log(boxesData)
              ApiRequest({
                url: 'RawMaterialBox/AddListToPlate',
                method: 'post',
                data: boxesData.filter((item: any) => boxesCheckbox.includes(item.barCode)).map((item: any) => ({boxId: item.boxId, plateId: selectedPlate}))
              }).then(_ => {
                setTriggerResetData(getRandomKey())
              })
            }
          }}
        >
          Confirm change
        </Button> */}
      </div>
      <CommonTablePage
        column={BoxesEditDialogColumnModel.groupColumn}
        getAllUrl={'RawMaterialBox/GetRawMaterialBoxAndBoxByInspectionId?inspectionId=' + props.inspectionId}
        isNotAddable={true}
        isNotEditable={true}
        mappingRenderData={(data: any) => {
          // get boxes with plate id
          data.boxes = data.boxes.sort((e1:any, e2:any) => {
            if (e1.barCode>e2.barCode) return 1;
            if (e1.barCode<e2.barCode) return -1;
            return 0;
          })
          const platedBoxesData = data.boxes
            .filter((box:any) => box.productId==props.productId)
            .filter((box: any) => box.plateId !== null)
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
          const unPlateBoxesData = data.boxes.filter((box:any) => box.productId==props.productId).filter((box: any) => box.plateId === null)
          const unPlatedGroupData = groupBoxesData(unPlateBoxesData, groupNumber)
          const newGroupsData: any[] = []
          if (platedBoxesData !== null || platedBoxesData.length !== 0) {
            platedGroupData.forEach((item: any) => {
              newGroupsData.push(item)
            })
          }
          unPlatedGroupData.forEach((item: any) => {
            newGroupsData.push(item)
          })
          console.log(newGroupsData)
          setStatusNumber(getStatusNumber(newGroupsData))
          setGroupsData(newGroupsData)
          return newGroupsData
        }}
        title="Groups Table"
        actionButtons={groupActionButtons}
        triggerResetData={triggerResetData}/>
      {
        isChecked && 
        <CommonTablePage
        urlInfoKey={urlKey.Box}
        getAllUrl={'RawMaterialBox/GetRawMaterialBoxAndBoxByInspectionId?inspectionId=' + props.inspectionId}
        title="Boxes Table"
        isNotAddable={true}
        isNotEditable={true}
        actionButtons={actionButtons}
        mappingRenderData={(data: any) => {
          data.boxes = data.boxes.sort((e1:any, e2:any) => {
            if (e1.barCode>e2.barCode) return 1;
            if (e1.barCode<e2.barCode) return -1;
            return 0;
          })
          data.boxes =  data.boxes.filter((box:any) => box.productId==props.productId);
          const newData = data.boxes?.map((row: any) => ({...row, productName: row.product?.productName, isCell: row.cell ? 1 : (row.tempzone ? 1 : 0), locationCode: getLocationCode(row)}))
          setBoxesData(newData)
          return newData
        }}
        mappingUpdateData={async (dataDetail: any, type: any) => {
          console.log(dataDetail)
          if (type === urlType.Delete && !dataDetail.plateId) {
            await ApiRequest({
              url: 'RawMaterialBox/DeleteRawMaterialBox?barCode=' + dataDetail.barCode,
              method: 'delete',
            }).then(_ => {
              setTriggerResetData(getRandomKey())
            })
            return 'resolve'
          }
          return dataDetail
        }}
        triggerResetData={triggerResetData}
        column={BoxesEditDialogColumnModel.Column}
      />
      }
      <CommonDialog title={dialogTitle} open={open} onDialogClose={onDialogClose} dialogContent={RawMaterialManagementDialog} />
      <MoveToCellModal buttonDisabled={buttonDisabled} isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk} selectOnChangeHandler={selectOnChangeHandler} />
      <ShowBoxBarCodeModal boxBarCodeModalVisible={showBoxBarCode} closeModal={closeShowBoxBarCodeModal} groupArray={groupArray}/>
      <SelectPalletModal selectPalletModalVisible={showSelectPallet} submitModal={submitShowSelectPalletModal} closeModal={closeShowSelectPalletModal} plateOptions={plateOptions} selectedPlate={selectedPlate} setSelectedPlate={setSelectedPlate}/>
    </div>
  )
}

export default BoxesEditDialog
