import React, {useEffect, useState} from 'react'
import {Button, Col, Row, Select, Table, Transfer} from 'antd'
// import {data1Mock, data2Mock, data3Mock, selectMock} from '../../../mock/relocateBoxesMock'
import {
  getInUsingPlateRequest,
  getAllZoneRequest,
  getBoxByPlateIdRequest,
  getRawMaterialBoxByPlateIdRequest,
  moveBoxRequest
} from "../../../services/others/relocate-boxex-services";
import ItipsForProduct from "../../../components/common/i-tips/product";
import Iselect from "../../../components/common/i-select";

interface dataType {
    id:number,
    product: string,
    boxNumber:number,
    productDate:string,
    notes:string,
}

interface sendDataType {
  boxId: string,
  targetPlateId: number|undefined
}

const RelocateBoxes = () => {
  //=====================================select=============================
  const [selectOptions, setSelectOptions] = useState<any>([])
  const [sourceData, setSourceData] = useState<any>([])
  const [targetData, setTargetData] = useState<any>([])
  const [dataSource, setDataSource] = useState<any>([])
  const [isDisabled, setIsDisabled] = useState<any>(true)
  const [lengthOfSource, setLengthOfSource] = useState<number>(0)
  const [sourcePlateId, setSourcePlateId] = useState<number>()
  const [targetPlateId, setTargetPlateId] = useState<number>()

  

  useEffect(() => {
    
  document.title = "Relocate Boxes Management";
    //call api for Source select and Target Select======
    // getAllZoneRequest().then(res => {
    //   // console.log(res.data.data, 'getallzone')
    //   const selects:any = []
    //   res.data.data.forEach((zone:any)=> {
    //     // console.log(zone)
    //     zone.shelf.forEach((shelf:any) => {
    //       // console.log(shelf)
    //       shelf.cell.forEach((cell:any) => {
    //             // console.log(cell.plate)
    //         selects.push({
    //           value: cell.plate?.plateId,
    //           label: cell.plate?.plateCode
    //         })
    //         }
    //       )
    //     })
    //   })
    //   setSelectOptions(selects)
    // })
    getInUsingPlateRequest().then(async (res:any)=> {
      // console.log(res.data.data, 'allPlate')
      const selects:any = []
      await res.data.data.forEach((plate:any)=>{
        // console.log(plate)
        selects.push({
          value: plate.plateId,
          label: plate.plateCodeWithNote
        })
      })
      // console.log(selects,'sss')
      setSelectOptions(selects)
    })
  }, [])

  // const idDelete = (value:any) =>{
  //     value.forEach( (element:any) => {
  //         delete element.id
  //         // delete element.key
  //     })
  //     return value
  // }

  const totalData:any = [] //所有数据同意在一个array里
  // idDelete(sourceData).concat(idDelete(targetData)).map( (element:any,index:number) => {
  //     element.id = index
  //     totalData.push(element)
  // }) //删除获取数据的id推到totalData

  sourceData.concat(targetData).map((element:any) => {
    //console.log(element,'element')
    totalData.push(element)
  })

  // console.log(sourceData,'sourceData')
  // console.log(targetData,'targetData')
  const originTargetKeys = totalData
    // .filter((item:any,index:number) => +item.boxId >= sourceData.length)
      .filter((item:any,index:number) => index >= lengthOfSource)
      .map((item:any) => (item.boxId))

  // const buttonClick = () => {
  //   setTargetData(data3Mock())
  //   if (sourceData.length !== 0) {
  //     console.log('targetSelectHandler set disabled false')
  //     setIsDisabled(false)
  //   }
  // }
  const sourceSelectHandler = async (value:any) => {
    // console.log(selectOptions,'selectoptions')
    console.log(value)
    setSourcePlateId(value)
    let length:number;
    const data:any=[];
    //use value to call api=====
    // setLengthOfSource(res.data.data.length)
    // setSourceData(res.data.data)
    await getBoxByPlateIdRequest(value).then((res:any) => {
      // console.log(res.data.data,'source')
      length = res.data.data.length;
      setLengthOfSource(length);
      res.data.data.map((e:any)=>{
        e.isProd = "Y";
        data.push(e);
      })
    })
    await getRawMaterialBoxByPlateIdRequest(value).then((res:any)=>{
      length = length + res.data.data.length;
      setLengthOfSource(length);
      res.data.data.map((e:any)=>{
        rmBoxToBox(e)
        data.push(e);
      })
      setSourceData(data)
    })


    // await setSourceData(data1Mock())
    if (targetData.length !== 0) {
      // console.log('sourceSelectHandler set disabled false')
      setIsDisabled(false)
    }
  }
  const rmBoxToBox = (box:any)=>{
        box.isProd = "N";
        box.boxId = box.rawMaterialBoxId
        box.barCode =box.boxCode
        box.product = {
          productId:box.rawMaterial.rawMaterialId,
          productName:box.rawMaterial.rawMaterialName
        }
  return box;
  }
  const targetSelectHandler = async (value:any) => {
    console.log(value)
    setTargetPlateId(value)
    const data:any=[];
    //use value to call api=====
    await getBoxByPlateIdRequest(value).then((res:any) => {
      // console.log(res.data.data,'target')

      res.data.data.map((e:any)=>{
        e.isProd = "Y";
        data.push(e);
      })
    })
    await getRawMaterialBoxByPlateIdRequest(value).then((res:any)=>{
      res.data.data.map((e:any)=>{
        rmBoxToBox(e)
        data.push(e);
      })
    })
    setTargetData(data)
    // await setTargetData(data2Mock())
    // await total(sourceData,targetData)
    if (sourceData.length !== 0) {
      // console.log('targetSelectHandler set disabled false')
      setIsDisabled(false)
    }
  }

  const confirmHandler = () => {
    setDataSource(totalData)
    setTargetKeys(originTargetKeys)
    setIsDisabled(true)
  }
  // console.log(originTargetKeys, 'ori')
  // console.log(dataSource, 'datasource')
  //=====================================transfer=============================

  const [targetKeys, setTargetKeys] = useState<string[]>([])

  // const keyToData = (moveKeys:number[], target:any) => {
  //   const newArray = []
  //   for (let i = 0; i < moveKeys.length; i++) {
  //     for (let j = 0; j < target.length; j++) {
  //       if (moveKeys[i] === target[j].id) {
  //         newArray.push(target[j])
  //       }
  //     }
  //   }
  //   return newArray
  // }

  const onChange = (nextTargetKeys:string[], direction:string, moveKeys:any[]) => {
    console.log('targetKeys:', nextTargetKeys)
    console.log('direction:', direction)
    console.log('moveKeys:', moveKeys)
    const theMoveArray:sendDataType[] = []
    // const putData:dataType[] = keyToData(moveKeys, totalData)
    if(direction === 'left'){
        // console.log('往左移')
        moveKeys.map((res:string) => theMoveArray.push({boxId:res, targetPlateId:sourcePlateId}))
        // console.log(putData, '用于从Target delete')
        // console.log(putData, '用于Source 增加')
        // console.log(targetArray, 'sendData')

    }
    if(direction === 'right'){
        // console.log('往右移')
        moveKeys.map((res:string) => theMoveArray.push({boxId:res, targetPlateId:targetPlateId}))
        // console.log(putData, '用于从Source delete')
        // console.log(putData, '用于target 增加')
        // console.log(sourceArray)
    }

    moveBoxRequest(theMoveArray).then(res=> console.log(res))
    setTargetKeys(nextTargetKeys)
  }

  return (
    <div>
      <Row style={{margin: '10px 0px'}}>
        <Col span={12}>
          <span>Source:&nbsp;&nbsp;</span>
          <Iselect data={selectOptions} onChange={sourceSelectHandler} width={300}/>
        </Col>
        <Col span={12}>
          <span>Target:&nbsp;&nbsp;</span>
          <Iselect data={selectOptions} onChange={targetSelectHandler} width={300}/>
          <Button style={{float: 'right'}} type='primary' disabled={isDisabled} onClick={confirmHandler}>Get Data</Button>
        </Col>
      </Row>
      <TableTransfer
        dataSource={dataSource}
        titles={['Source', 'Target']}
        targetKeys={targetKeys}
        onChange={onChange}
        showSelectAll={false}
        rowKey={(record:any) => record.boxId}
        // render={(record:any) => record.boxId}
      />
    </div>
  )
}

const TableTransfer = ({...restProps}:any) => {
  return (
    <Transfer {...restProps} style={{height: '700px'}}>
      {
        ({direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedKeys}) => {
          const rowSelection = {
            selectedRowKeys: listSelectedKeys,
            onSelect: ({key} :any, selected:boolean) => onItemSelect(key, selected),
            onSelectAll: (selected:boolean, selectedRows:any) => {
              const selectedId = selectedRows.map(({key}:any) => key)
              onItemSelectAll(selectedId, selected)
            }
          }
          return <Table rowSelection={rowSelection} columns={columns} dataSource={filteredItems} rowKey='boxId'></Table>
        }
      }
    </Transfer>
  )
}

const columns = [
  {
    title: 'BarCode',
    dataIndex: 'barCode',
    key: 'barCode',
  },
  {
    title: 'Prod&RM Name',
    dataIndex: 'product',
    key: 'product',
    render: (text:any) => <ItipsForProduct id={text.productId} label={text.productName}/>
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  // {
  //   title: 'Is Semi',
  //   dataIndex: 'isSemi',
  //   key: 'isSemi',
  // },
  {
    title: 'Prod & RM',
    dataIndex: 'isProd',
    key: 'isProd',
  },
  // {
  //   title: 'Created At',
  //   dataIndex: 'createdAt',
  //   key: 'createdAt',
  // },
]

export default RelocateBoxes
