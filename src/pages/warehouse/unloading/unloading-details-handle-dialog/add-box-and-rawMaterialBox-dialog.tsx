import { Button, Checkbox, Input, Steps } from 'antd'
import React, { useState } from 'react'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import './add-box-and-rawMaterialBox-dialog'
import { MoveToCellModal } from '../../temporary-Zone/move-to-cell-modal'
import { getRandomKey } from '../../../../services/lib/utils/helpers'
import { MoveToTempZone } from '../../relocate-plate/relocate-plate-page'

const AddBoxAndRawMaterialBoxDialog = (props: {
  inspectionId: any;
  unloadingDetailData: any;
  onDialogClose: any;
  isBoxesEdit: boolean;
  qtyPerBox?: number;
  tempzoneOptions: any;
  maxQty:number

}) => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [boxQty, setBoxQty] = useState<any>(0)
  const [rawMaterialBoxQty, setRawMaterialBoxQty] = useState<any>(0)
  const [current, setCurrent] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [generateChecked, setGenerateChecked] = useState(true)
  const [generatePlateId, setGeneratePlateId] = useState<any>()
  const [selectedCell, setSelectedCell] = useState<any>()

  const handleBoxQtyChange = (e: any) => {
    // if (e.target?.value>props.maxQty)
    //   setBoxQty(props.maxQty)
    // else
      setBoxQty(e.target?.value)
  }

  const handleRawMaterialBoxQtyChange = (e: any) => {
    setRawMaterialBoxQty(e.target?.value)
  }

  const next = async () => {
    let qty;
    if (props.isBoxesEdit){
      qty=boxQty;
    }
    else{
      qty=rawMaterialBoxQty;
    }
    if (qty>props.maxQty ){
      SweetAlertService.errorMessage('The quantity of generating is greater than the quantity received this time.')
      return
    }
    await ApiRequest({
      url:
        'RawMaterialBox/GenerateMaterialProductBox?inspectionId=' +
        props.inspectionId +
        '&rawMaterialId=' +
        (props.unloadingDetailData
          && props.unloadingDetailData.rawMaterialId) +
        '&productQuantityPerBox=' +
        (props.isBoxesEdit ? props.qtyPerBox : 1) +
        '&boxCount=' +
        (props.isBoxesEdit ? boxQty : rawMaterialBoxQty),
      method: 'post',
    }).then((res: any) => {
      setCurrent(current + 1)
      console.log(res)

      ApiRequest({
        url: 'Plate/AddTemporaryPlate?plateTypeId=2',
        method: 'post'
      }).then((plate: any) => {
        setGeneratePlateId(plate.data.data)
        props.isBoxesEdit ? ApiRequest({
          url: 'RawMaterialBox/AddListToPlate',
          method: 'post',
          data: res.data.data.boxes?.map((item: any) => ({boxId: item.boxId, plateId: plate.data.data}))
        }).then(_ => {
          ApiRequest({
            url: 'Plate/GetAllPlate',
            method: 'get',
            isShowSpinner: true
          })
        }) : ApiRequest({
          url: 'RawMaterialBox/AddListToPlate',
          method: 'post',
          data: res.data.data.rawMaterialBoxes?.map((item: any) => ({rawMaterialBoxId: item.rawMaterialBoxId, plateId: plate.data.data}))
        }).then(_ => {
          ApiRequest({
            url: 'Plate/GetAllPlate',
            method: 'get',
            isShowSpinner: true
          })
        })
      })
    })
  }

  const onGenerateChecked = (e: any) => {}

  const onSelectShelf = () => {
    if (!generatePlateId) {
      SweetAlertService.errorMessage('Assign pallet firstly')
      return
    } else {
      setIsModalVisible(true)
    }
  }

  const onSelectTempzone = () => {
    const zoneTypeOptions: any = {}
    props.tempzoneOptions.forEach((item: any) => {
      zoneTypeOptions[item.zoneType] = item.zoneTypeName
    })

    if (!generatePlateId) {
      SweetAlertService.errorMessage('Assign pallet firstly')
      return
    }
    generatePlateId &&
      MoveToTempZone(generatePlateId, zoneTypeOptions, () => {
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
        plateId: generatePlateId
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

  const steps = [
    {
      title: 'Add Boxes & Generate Plate',
      content: (props.isBoxesEdit ? (
        <div style={{width: '20%'}}>
          <p>Box Count</p>
          <Input type="number" max={props.maxQty} onChange={(e) => handleBoxQtyChange(e)} />
          <Checkbox style={{marginTop: '1rem'}} checked={generateChecked} onChange={onGenerateChecked}>Generate Pallet</Checkbox>
        </div>
      ) : (
        <div style={{width: '20%'}}>
          <p>Count</p>
          <Input type="number" onChange={(e) => handleRawMaterialBoxQtyChange(e)} />
          <Checkbox style={{marginTop: '1rem'}} checked={generateChecked} onChange={onGenerateChecked}>Generate Pallet</Checkbox>
        </div>
      )),
    },
    {
      title: 'Move to Shelf or Tempzone',
      content: (
        <>
          <MoveToCellModal buttonDisabled={buttonDisabled} isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk} selectOnChangeHandler={selectOnChangeHandler} />
          <div style={{ display: 'flex', marginTop: '2rem' }}>
            <Button type="primary" style={{marginRight: '1rem'}} onClick={onSelectShelf}>Select a Shelf</Button>
            <Button type="primary" onClick={onSelectTempzone}>Select Tempzone</Button>
          </div>
        </>
      ),
    },
  ]

  const { Step } = Steps

  const onConfirm = async () => {
    await ApiRequest({
      url:
        'RawMaterialBox/GenerateMaterialProductBox?inspectionId=' +
        props.inspectionId +
        '&rawMaterialId=' +
        (props.unloadingDetailData
          && props.unloadingDetailData.rawMaterialId) +
        '&productQuantityPerBox=' +
        (props.isBoxesEdit ? props.qtyPerBox : 1) +
        '&boxCount=' +
        (props.isBoxesEdit ? boxQty : rawMaterialBoxQty),
      method: 'post',
    }).then((res: any) => {
      console.log(res)
    })
    // if (result) {
    //   await SweetAlertService.successMessage('Submit successfully')
    //   props.onDialogClose(true)
    // }
  }

  return (
    <div style={{ width: '97%', margin: '0 auto 1rem' }}>
      {/* {props.isBoxesEdit ? (
        <div style={{width: '20%'}}>
          <p>Box Count</p>
          <Input type="number" onChange={(e) => handleBoxQtyChange(e)} />
        </div>
      ) : (
        <div style={{width: '20%'}}>
          <p>Count</p>
          <Input type="number" onChange={(e) => handleRawMaterialBoxQtyChange(e)} />
        </div>
      )} */}
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{marginTop: '1rem'}}>{steps[current].content}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        {current < steps.length - 1 && (
          <Button type="primary" disabled={boxQty === 0 && rawMaterialBoxQty === 0} onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => props.onDialogClose(true)}>
            Done
          </Button>
        )}
        {/* <Button
          onClick={() => {
            props.onDialogClose(false)
          }}
          style={{ marginRight: '2rem' }}
        >
          Cancel
        </Button>
        <Button
          disabled={boxQty === 0 && rawMaterialBoxQty === 0}
          onClick={onConfirm}
          type='primary'
        >
          Confirm
        </Button> */}
      </div>
    </div>
  )
}

export default AddBoxAndRawMaterialBoxDialog
