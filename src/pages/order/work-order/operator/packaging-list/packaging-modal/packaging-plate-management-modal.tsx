import React, { useEffect, useState } from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import { Button, Modal } from 'antd'
import {urlKey} from '../../../../../../services/api/api-urls'
import CommonTablePage from '../../../../../../components/common/common-table/common-table-page'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import { commonFormSelect, getSelectOptions } from '../../../../../../components/common/common-form/common-form-select'
import palletSticker from '../../../../../static/pdf/pallet-stickers/pallet-sticker'

export const PackagingPlateManagementModal = (props: {visible: any, onOk: any, onCancel: any}) => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [plateTypeOptions, setPlateTypeOptions] = useState<any>([])
  const [selectedPlateType, setSelectedPlateType] = useState<any>()
  const {visible, onCancel} = props

  useEffect(() => {
    getSelectOptions(urlKey.PlateType).then(res => {
      let e = res
      if (res != null) {
        e = res.filter((ele:any) => ele.plateTypeId !== 1)
      }
      setPlateTypeOptions(e)
      setSelectedPlateType(3);
    })
  }, [])

  const onNewTemporaryPlate = () => {
    // if (!selectedPlateType) {
    //   SweetAlertService.errorMessage('Please select a pallet type firstly.')
    //   return
    // }
    setSelectedPlateType(3);
    ApiRequest({
      url: 'Plate/AddTemporaryPlate?plateTypeId=' + selectedPlateType,
      method: 'post',
      isShowSpinner: true
    }).then(_ => {
      ApiRequest({
        url: 'Plate/GetAllPlate',
        method: 'get',
        isShowSpinner: true
      }).then(res => {
        setTriggerResetData(!triggerResetData)
      })
    })
  }

  return (
    <Modal destroyOnClose={true} title="托盘管理/Pallet Management" visible={visible} onCancel={onCancel} width={1000} footer={false}>
      <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem'}}>
        <Button
          type="primary"
          onClick={onNewTemporaryPlate}
          style={{marginRight: '2rem'}}
        > 新建蓝色托盘/New Blue Pallet</Button>
        {commonFormSelect(urlKey.PlateType, plateTypeOptions, [], true, (value: any) => setSelectedPlateType(value), null, 'Select a pallet type')}
      </div>
      <CommonTablePage
        title={''}
        urlInfoKey={urlKey.AvailablePlate}
        triggerResetData={triggerResetData}
        actionButtons={[
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: '更改/Change',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              ApiRequest({
                url: 'Plate/UpdatePlatePackageState?plateId=' + rowData.plateId + '&package=' + (rowData.package ? 0 : 1),
                method: 'put'
              }).then(_ => {
                setTriggerResetData(!triggerResetData)
              })
            }
          },
          {
            icon: 'ghost', //Button attr of Ant design (danger, ghost)
            tooltip: '打印/Pr',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              console.log(rowData)
              if (rowData.plateTypeId != 100) {
                SweetAlertService.successMessage(rowData.plateCode)
                palletSticker(rowData.plateCode, 'print')
              } else {
                SweetAlertService.errorMessage('Only temporary plate can be printed.')
              }
            }
          }
        ]}
        mappingRenderData={(data: any) => data.map((row: any) => ({...row, package: row.package ? 1 : 0, plateTypeName: row.plateType.plateTypeName}))}
        column={[
          {title: '托盘码/Pallet Code', field: 'plateCode', defaultSort: 'asc'},
          {title: '托盘类型/Pallet Type', field: 'plateTypeName'},
          {title: '是否可供打包选择/For Package', field: 'package', lookup: {0: '否/No', 1: '是/Yes'}, defaultSort: 'desc'},
        ]}
        isNotEditable={true}
        isNotAddable={true}
        isNotDeletable={true}
        defaultPageSize={10}
      />
    </Modal>
  )
}
