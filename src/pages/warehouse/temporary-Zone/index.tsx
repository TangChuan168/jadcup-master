import React, {PropsWithChildren, useEffect, useState} from 'react'
import {Button, Col, Modal, Row, Select} from 'antd'
import CommonTable from '../../../components/common/common-table/common-table'
import CommonMachineCard from '../../../components/common/others/common-machine-card'
import {
  clearEmptyPlateFromTempZone,
  getAllTempZoneRequest,
  getEmptyCellRequest,
  movePlateToShelfRequest
} from '../../../services/others/temporary-zone-services'
import ItipsForProduct from '../../../components/common/i-tips/product'
import Plate from '../plate'
import { MoveToCellModal } from './move-to-cell-modal'
import { nsStr } from '../../../services/lib/utils/helpers'
import { MoveToTempZone } from '../relocate-plate/relocate-plate-page'
import { ApiRequest } from '../../../services/api/api'
import { AddToStockPrintQrModal } from './add-to-stock-dialog/add-to-stock-print-qr-modal'

const { Option } = Select

const initDetailOfPlate = {plateCode: '', plateId: null }

const TemporaryZone:React.FC = (props:PropsWithChildren<any>) => {
  const [tableData, setTableData] = useState<any>([])
  const [boxesData, setBoxesData] = useState<any>([])
  const [detailOfPlate, setDetailOfPlate] = useState(initDetailOfPlate)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [detailOfEmptyCell, setDetailOfEmptyCell] = useState<any>([])
  const [plateAndCell, setPlateAndCell] = useState<any>()
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [isPlateModalVisible, setIsPlateModalVisible] = useState(false)
  const [isAddToStockModalVisible, setIsAddToStockModalVisible] = useState(false)
  const [zoneTypeOptions, setZoneTypeOptions] = useState<any>()
  const [previewVisible, setPreviewVisible] = useState(false);  

  useEffect(() => {
    getAllTempZone()
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
    // getEmptyCellRequest().then((res) => {
    //   setDetailOfEmptyCell(res.data.data)
    // })
  }, [])

  const getAllTempZone = () => {
    getAllTempZoneRequest().then((res) => {
      console.log(res.data.data)
      const filterData = res.data.data.filter((res:any) => res.active === 1)
      console.log(filterData)
      setTableData(filterData)
      if (filterData.length !== 0) {
        console.log('有托盘')
        // setTableData(filterData)
        setBoxesData(getRenderBoxes(filterData[0].boxes))
        setDetailOfPlate({...detailOfPlate, plateCode: filterData[0].plate.plateCode, plateId: filterData[0].plateId})
      } else {
        setBoxesData([])
        setDetailOfPlate({...detailOfPlate, ...initDetailOfPlate})
      }
    })
  }

  const tableColumns = [
    { title: 'Barcode', field: 'barCode', editable: 'never', filtering: true},
    { title: 'Product', field: 'productName', editable: 'never', filtering: true, render: (text:any) => <ItipsForProduct id={text.product.productId} label={text.product.productName}/>},
    { title: 'Quantity', field: 'quantity', editable: 'never', filtering: true},
    { title: 'Is Semi', field: 'isSemi', editable: 'never', filtering: true},
    { title: 'Is Dispatching', field: 'isDispatching', editable: 'never', filtering: true},
    // { title: 'Create At', field: 'createdAt', editable: 'never', filtering: true},
  ]

  const ImgClickHandler = (data:any) => {
    // console.log(data, 'call api,将id传到api里，获得数据 ')
    setBoxesData(getRenderBoxes(data.boxes))
    // setNameOfPlate(data.plate.plateCode)
    setDetailOfPlate({...detailOfPlate, plateCode: data.plate.plateCode, plateId: data.plateId})
    //将获得的数据放入setTableData里
    setPreviewVisible(true);
  }

  const getRenderBoxes = (data: any) => {
    console.log(data)
    // return data.filter((row: any) => row.status === 1).map((row: any) => ({
    //   ...row,
    //   productName: row.product?.productName + nsStr(row.product?.productName),
    //   isDispatching: row.status === 2 ? 'Yes' : 'No'
    // }))
    return data?.map((row: any) => ({
      ...row,
      productName: row.product?.productName + nsStr(row.product?.productName),
      isDispatching: row.status === 2 ? 'Yes' : 'No'
    }))
  }

  const button: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Shelf',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setPreviewVisible(false);
        showModal()
        console.log(rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Move to Tempzone',
      isFreeAction: true,
      onClick: (event: any, rowData: any) => {
        setPreviewVisible(false);
        MoveToTempZone(detailOfPlate.plateId, zoneTypeOptions, getAllTempZone)
      }
    }
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleTempzoneCancel = () => setPreviewVisible(false);

  const handleOk = () => {
    setIsModalVisible(false)
    movePlateToShelfRequest(plateAndCell.plateId, plateAndCell.newCellId)
      .then(res => {
        console.log(res, 'success')
        setButtonDisabled(true)
        getAllTempZone()
      })
      .then(_ => setButtonDisabled(true))
      .then(_ => getAllTempZone())
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setButtonDisabled(true)
  }

  const selectOnChangeHandler = (value:any) => {
    console.log(value)
    const obj = {
      plateId: detailOfPlate.plateId,
      newCellId: value
    }
    setPlateAndCell(obj)
    setButtonDisabled(false)
    console.log(obj, 'connect to MovePlateToAnotherCellRequest')
  }

  return (
    <div>
      <div>
        <Button type={'primary'} onClick={() => setIsAddToStockModalVisible(true)} style={{marginTop: '1rem', marginRight: '10px'}}>Add to stock</Button>
        <Button type={'primary'} onClick={() => setIsPlateModalVisible(true)} style={{marginTop: '1rem', marginRight: '10px'}}>Store To Pallet</Button>
        <Button onClick={() => clearEmptyPlateFromTempZone().then(_ => getAllTempZone())}>Clear Empty Pallet</Button>
        <div style={{margin: '1rem 0'}}>
          <Row gutter={[16, 16]}>
            {
              tableData.map((data:any, index:number) => {
                // console.log(data)
                // if(data.active !== 0){
                return (
                  <Col key={index} className="gutter-row" span={3} >
                    <div onClick={() => ImgClickHandler(data)}>
                      <CommonMachineCard img={'https://storage.googleapis.com/neptune_media/7767c281-6989-4601-a9d0-d47596a9a8f9'} machine={data.plate.plateCode + '(Qty: ' + data.boxes?.length + ')'} />
                    </div>
                  </Col>
                )
                // }
              })
            }
          </Row>
        </div>
      </div>
      {/* <Modal visible={previewVisible} title={"preview"} footer={null}  onCancel={handleCancel} >
        <img alt="example" style={{ width: '100%' }} src={previewImage}/>
      </Modal>  */}
      <Modal width={1280} visible={previewVisible} title={`Pallet - ${detailOfPlate.plateCode} `} footer={null}  onCancel={handleTempzoneCancel} >
        <CommonTable actionButtons={button} column={tableColumns} initData={boxesData} defaultPageSize={10} title={`Temporary Zone - ${detailOfPlate.plateCode} `}/>
      </Modal>

      <MoveToCellModal buttonDisabled={buttonDisabled} isModalVisible={isModalVisible} handleCancel={handleCancel} handleOk={handleOk} selectOnChangeHandler={selectOnChangeHandler} placeholder={props.placeholder} changes={boxesData}/>
      <Modal destroyOnClose={true} visible={isPlateModalVisible} onOk={() => setIsPlateModalVisible(true)} onCancel={() => setIsPlateModalVisible(false)} width={1200} footer={null}>
        <Plate cancelModal={() => setIsPlateModalVisible(false)} refresh={getAllTempZone}/>
      </Modal>
      <AddToStockPrintQrModal {...{
        visible: isAddToStockModalVisible,
        onOk: () => {
          getAllTempZone()
          setIsAddToStockModalVisible(false)
        },
        onCancel: () => setIsAddToStockModalVisible(false),
      }} />

    </div>
  )
}

export default TemporaryZone
