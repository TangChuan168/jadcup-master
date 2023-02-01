import { Button } from 'antd'
import React, { useState } from 'react'
import { ApiRequest } from '../../../../services/api/api'
import { getRandomKey } from '../../../../services/lib/utils/helpers'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { MoveToTempZone } from '../../relocate-plate/relocate-plate-page'
import { MoveToCellModal } from '../../temporary-Zone/move-to-cell-modal'

const ShelfOrTempzoneDialog = (props: {onDialogClose: any, isModalVisible: any, selectedRowData: any, tempzoneOptions: any}) => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedCell, setSelectedCell] = useState<any>()

  const onSelectShelf = () => {
    if (!props.selectedRowData?.plateId) {
      SweetAlertService.errorMessage('Assign pallet firstly')
      return
    }
    if (props.selectedRowData?.cell) {
      SweetAlertService.errorMessage('Already moved to cell')
    } else {
      setIsModalVisible(true)
    }
  }

  const onSelectTempzone = () => {
    const zoneTypeOptions: any = {}
    props.tempzoneOptions.forEach((item: any) => {
      zoneTypeOptions[item.zoneType] = item.zoneTypeName
    })

    if (!props.selectedRowData?.plateId) {
      SweetAlertService.errorMessage('Assign pallet firstly')
      return
    }
    props.selectedRowData?.plateId &&
      MoveToTempZone(props.selectedRowData?.plateId, zoneTypeOptions, () => {
        setTriggerResetData(getRandomKey())
      })
  }

  const handleOk = () => {
    setIsModalVisible(false)
    ApiRequest({
      url: 'ShelfPlate/AddShelfPlate',
      method: 'post',
      data: {
        cellId: selectedCell,
        plateId: props.selectedRowData.plateId
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

  return (
    <div style={{ width: '97%', margin: '0 auto 1rem' }}>
      <MoveToCellModal buttonDisabled={buttonDisabled} isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk} selectOnChangeHandler={selectOnChangeHandler} />
      <div style={{ display: 'flex', marginTop: '2rem' }}>
        <Button type="primary" style={{marginRight: '1rem'}} onClick={onSelectShelf}>Select a Shelf</Button>
        <Button type="primary" onClick={onSelectTempzone}>Select Tempzone</Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '2rem'}}>
        <Button
          onClick={() => props.onDialogClose()}>
          Close
        </Button>
      </div>
    </div>
  )
}

export default ShelfOrTempzoneDialog
