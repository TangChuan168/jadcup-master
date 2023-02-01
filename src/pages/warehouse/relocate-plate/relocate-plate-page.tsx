import React, { useEffect, useState } from 'react'
import RelocatePlateColumnModel from './relocate-plate-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey, urlType } from '../../../services/api/api-urls'
import { ApiRequest } from '../../../services/api/api'
import { commonFormSelect } from '../../../components/common/common-form/common-form-select'
import { MoveToCellModal } from '../temporary-Zone/move-to-cell-modal'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { getRandomKey } from '../../../services/lib/utils/helpers'

export const MoveToTempZone = async (selectedPlate: any, zoneTypeOptions: any, resetPage?: any) => {
  if (!selectedPlate) {
    SweetAlertService.errorMessage('No pallet information.')
    return
  }
  const result: any = await SweetAlertService.inputConfirm({
    type: 'select',
    title: 'Select a zone type',
    placeholder: ' ',
    inputOptions: zoneTypeOptions
  })
  if (result !== undefined) {
    ApiRequest({
      url: 'TempZone/MovePlateToTempZone?plateId=' + selectedPlate + '&zoneTypeId=' + result,
      method: 'put'
    }).then(_ => {
      resetPage()
    })
  }
}

const RelocatePlatePage = () => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [plateOptions, setPlateOptions] = useState<any>([])
  const [zoneTypeOptions, setZoneTypeOptions] = useState<any>()
  const [selectedPlate, setSelectedPlate] = useState<any>()
  const [selectedRowData, setSelectedRowData] = useState<any>()
  const [selectedCell, setSelectedCell] = useState<any>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)

  useEffect(() => {
    document.title = "Relocate Pallet Management";
    ApiRequest({
      url: 'Plate/GetInUsingPallet',
      method: 'get',
      isShowSpinner: false
    }).then((res: any) => {
      setPlateOptions(res.data.data)
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

  useEffect(() => {
    setSelectedRowData(plateOptions?.filter((row: any) => row.plateId === selectedPlate)[0])
    setTriggerResetData(getRandomKey())
  }, [selectedPlate])

  const resetPage = () => {
    setSelectedPlate(null)
    setSelectedCell(null)
  }

  const onChangePlate = (value: any) => {
    setSelectedPlate(value)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    ApiRequest({
      url: 'ShelfPlate/MovePlateToAnotherCell?plateId=' + selectedPlate + '&newCellId=' + selectedCell,
      method: 'post'
    }).then(_ => {
      setButtonDisabled(true)
      resetPage()
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

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Shelf',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        if (!selectedPlate) {
          SweetAlertService.errorMessage('Please select a pallet firstly.')
          return
        }
        showModal()
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Tempzone',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        MoveToTempZone(selectedPlate, zoneTypeOptions, resetPage)
      }
    }
  ]

  const commonTablePageProps: CommonTablePagePropsInterface = {
    actionButtons: actionButtons,
    triggerResetData: triggerResetData,
    urlInfoKey: urlKey.Machine,
    title: 'Pallet Details',
    column: RelocatePlateColumnModel(),
    isNotAddable: true,
    isNotDeletable: true,
    isNotEditable: true,
    mappingRenderData: (data: any) => (plateOptions?.filter((row: any) => row.plateId === selectedPlate)[0]?.plateBox || [])
      .filter((row: any) => row.active)
  }

  return (
    <div>
      <h2>Relocate Pallet</h2>
      <div style={{width: '40%', marginBottom: '1rem'}}>
        Pallet select: {commonFormSelect(urlKey.Plate, plateOptions, ['plateCodeWithNote'], false, onChangePlate, null, null, selectedPlate)}
        Postion:{selectedRowData?.position}
      </div>
      <CommonTablePage {...commonTablePageProps} />
      <MoveToCellModal buttonDisabled={buttonDisabled} isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk} selectOnChangeHandler={selectOnChangeHandler} />
    </div>
  )
}

export default RelocatePlatePage

