import { Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { getEmptyCellRequest } from '../../../services/others/temporary-zone-services'
import ShelfSelector from '../../../components/common/shelf-selector'
import {getAllZoneRequest} from '../../../services/others/relocate-boxex-services'

const { Option } = Select

export const MoveToCellModal = (props: {placeholder?: any, isModalVisible: any, handleOk: any, handleCancel: any, buttonDisabled: any, selectOnChangeHandler: any, changes?:any}) => {
  const [detailOfEmptyCell, setDetailOfEmptyCell] = useState<any>([])
  const [zoneData, setZoneData] = useState<any>([])
  const [filterEmptyCell, setFilterEmptyCell] = useState<any>([])

  useEffect(() => {
    getAllZoneRequest()
      .then(res => {
        setZoneData(res.data.data)
        console.log('zone')
      })
    getEmptyCellRequest().then((res) => {
      setDetailOfEmptyCell(res.data.data)
      // console.log(res.data.data,'getEmptyCellRequest')
      console.log('select')
    })
  }, [props.isModalVisible])

  const filterString = (string:string) => {
    console.log(string)
    const filterCell = detailOfEmptyCell.filter((res:any) => res.shelf.shelfCode === string)
    console.log(filterCell)
    setFilterEmptyCell(filterCell)
  }

  return (
    <Modal width={1000} destroyOnClose={true} visible={props.isModalVisible} onOk={props.handleOk} onCancel={props.handleCancel} okButtonProps={{disabled: props.buttonDisabled}}>
      <ShelfSelector data={zoneData} filterString={filterString}/>
      <div>
				Cell:&nbsp;
        <Select
          showSearch
          allowClear={true}
          style={{ width: 300 }}
          placeholder={props.placeholder ? props.placeholder : 'select one'}
          optionFilterProp="children"
          onChange={props.selectOnChangeHandler}
        >
          {
          // filterEmptyCell.length !== 0 ?
            filterEmptyCell.map((res:any, index:any) => {
              return (
                <Option key={index} value={res.cellId}>{res.shelf.shelfCode}-{res.rowNo}-{res.colNo}</Option>
              )
            })
            // :
            // detailOfEmptyCell.map((res:any, index:any) => {
            //   return (
            //     <Option key={index} value={res.cellId}>{res.shelf.shelfCode}-{res.rowNo}-{res.colNo}</Option>
            //   )
            // }
            // )
          }
        </Select>
      </div>
    </Modal>
  )
}
