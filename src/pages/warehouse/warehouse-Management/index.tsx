import React, {PropsWithChildren, useEffect, useState} from 'react'
import {Button, Col, Descriptions, Modal, Row, Space, Table, Tabs} from 'antd'
import {managementData} from '../../../mock/warehouseManagementMock'
import {
  getAllProductRequest,
  getAllRawMaterialRequest,
  getAllStackingAreaInManagementRequest,
  getAllTemporaryZoneInManagementRequest
} from '../../../services/others/warehouse-management-services'
import Iselect from '../../../components/common/i-select'
import {getAllZoneRequest, getAllZoneRequestForRefresh} from '../../../services/others/relocate-boxex-services'
import ProductTable from './productTable'
import MaterialTableOfShelf from './materialTableOfShelf'
import ShelfSelector from '../../../components/common/shelf-selector'
import CommonMachineCard from '../../../components/common/others/common-machine-card'

interface select {
  value: string,
  label: string
}

const TemporaryZoneAndStackingAreaInitState = {
  temporary: [],
  stacking: []
}

const WarehouseManagement:React.FC = () => {

  const [productValue, setProductValue] = useState<any>()
  const [materialValue, setMaterialValue] = useState<any>()
  const [materialSelect, setMaterialSelect] = useState<select[]>([])
  const [productSelect, setProductSelect] = useState<select[]>([])
  const [zoneData, setZoneData] = useState<any>([])
  const [selectProduct, setSelectProduct] = useState<any>([])
  const [selectMaterial, setSelectMaterial] = useState<any>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [showShelfDetails, setShowShelfDetails] = useState<boolean>(false)
  const [shelfDetailsData, setShelfDetailsData] = useState<any>([])

  const [selectTemporaryZoneProductValue, setSelectTemporaryZoneProductValue] = useState<any>([])
  const [selectStackingAreaProductValue, setSelectStackingAreaProductValue] = useState<any>([])

  const [positionNotification, setPositionNotification] = useState<any>([])
  const [totalStock, setTotalStock] = useState<number>(0)
  const [stackingStock, setStackingStock] = useState<number>(0)
  const [tempStock, setTempStock] = useState<number>(0)

  const [selectTemporaryZoneMaterialValue, setSelectTemporaryZoneMaterialValue] = useState<any>([])
  const [selectStackingAreaMaterialValue, setSelectStackingAreaMaterialValue] = useState<any>([])

  const [TemporaryZoneAndStackingArea, setTemporaryZoneAndStackingArea] = useState<any>(TemporaryZoneAndStackingAreaInitState)
  const TemporaryZoneAndStackingAreaRef: any = React.useRef()

  useEffect(() => {
    TemporaryZoneAndStackingAreaRef.current = TemporaryZoneAndStackingArea
  }, [TemporaryZoneAndStackingArea])

  useEffect(() => {
    document.title = "Warehouse Management";
   }, [])

  useEffect(() => {

    //供material selector 的 options显示
    getAllRawMaterialRequest()
      .then(res => {
        const selectArray:select[] = []
        // console.log(res.data.data, 'raw')
        res.data.data.forEach((material:any) => selectArray.push(
          {
            value: material.rawMaterialId,
            label: `${material.rawMaterialCode}-${material.rawMaterialName} `
          }
        ))
        setMaterialSelect(selectArray)
      })

    getAllProductRequest()
      .then(res => {
        const selectArray:select[] = []
        // console.log(res.data.data, 'product')
        res.data.data.forEach((product:any) => selectArray.push(
          {
            value: product.productId,
            label: product.productCode+'-'+product.productName
          }
        ))
        setProductSelect(selectArray)
      })

    getAllZoneRequest()
      .then(res => {
        setZoneData(res.data.data)
      })

    getAllTemporaryZoneInManagementRequest()
      .then((res) => {
        console.log(res.data.data, 'tempo')
        setTemporaryZoneAndStackingArea({...TemporaryZoneAndStackingAreaRef.current, temporary: res.data.data })
      })

    getAllStackingAreaInManagementRequest()
      .then((res) => {
        console.log(res.data.data, 'stacking')
        setTemporaryZoneAndStackingArea({...TemporaryZoneAndStackingAreaRef.current, stacking: res.data.data })
      })

  }, [])

  const materialSelectOnChangeHandler = (value:number) => {
    // console.log(value,'material')
    setMaterialValue(value)

    const getAllMaterialByValue = getAllMaterial.filter((material:any) => material.rawMaterial.rawMaterialId === value)
    // console.log(getAllMaterialByValue)
    setSelectMaterial(getAllMaterialByValue)

    getTotalStock(getAllMaterialByValue)

    change2array(getAllMaterialByValue)

    setProductValue('')
    setSelectTemporaryZoneProductValue([])
    setSelectStackingAreaProductValue([])

    // console.log(temporaryZone,test.temporary)
    const materialInTempo = TemporaryZoneAndStackingArea.temporary.map((res:any) => {
      return res.rawMaterialBoxes.filter((material:any) => material.rawMaterial.rawMaterialId === value)
    })
    console.log(materialInTempo, 'inMaterial')
    setSelectTemporaryZoneMaterialValue(materialInTempo)
    setTempStock(getAreaStock(materialInTempo));

    const materialInStacking = TemporaryZoneAndStackingArea.stacking.map((res:any) => {
      return res.rawMaterialBoxes.filter((material:any) => material.rawMaterial.rawMaterialId === value)
      // return res.boxes.filter((product:any) => product?.rawMaterial?.rawMaterial === value)
    })
    setSelectStackingAreaMaterialValue(materialInStacking)
    setTempStock(getAreaStock(materialInStacking));
  }

  const getAreaStock = (paraBoxes:any)=>{
    let retStock=0
    
    const boxes = [...paraBoxes.filter((e:any)=>{return e.length>0})]; 
    boxes.filter(e=>{   
      boxes.push(...e)
      return false;
    });
    console.log("productInTempo",boxes)
    retStock = boxes.reduce((acc,cur)=>cur.quantity?acc+cur.quantity:acc+0,0)
    console.log("retStock",retStock);
    return retStock;
  }
  const productSelectOnChangeHandler = (value:number) => {
    // console.log(value, 'product')
    const productInTempo = TemporaryZoneAndStackingArea.temporary.map((res:any) => {
      return res.boxes.filter((product:any) => product?.product?.productId === value)
    })
    setSelectTemporaryZoneProductValue(productInTempo)
    
    setTempStock(getAreaStock(productInTempo));

    const productInStacking = TemporaryZoneAndStackingArea.stacking.map((res:any) => {
      return res.boxes.filter((product:any) => product.product.productId === value)
    })

    setSelectStackingAreaProductValue(productInStacking)
    setStackingStock(getAreaStock(productInStacking));

    setProductValue(value)
    setMaterialValue('')

    const getAllProductByValue = getAllProduct.filter((product:any) => product.product.productId === value)
    // console.log(getAllProductByValue)
    setSelectProduct(getAllProductByValue)

    getTotalStock(getAllProductByValue)

    change2array(getAllProductByValue)
  }

  const getTotalStock = (stock:any) => {
    let total = 0
    stock.map((res:any) => {
      total += res.quantity
    })
    setTotalStock(total)
  }

  //区别不同地方的位置 用于计算不同位置boxes的数量
  const change2array = (selectedProduct:any) => {
    const arrayTwo = Object.values(selectedProduct.reduce((res:any, item:any) => {
      res[item.cellPosition.id] ? res[item.cellPosition.id].push(item) : res[item.cellPosition.id] = [item]
      return res
    }, {}))
    console.log(arrayTwo)
    setPositionNotification(arrayTwo)
  }

  // console.log(selectTemporaryZoneValue.flat(Infinity)[0]?.product.productName)
  // console.log(zoneData,'ss')

  const getAllProduct:any = []
  const getAllMaterial:any = []
  zoneData.map((zone:any) => {
    // console.log(zone)
    zone.shelf.map((shelf:any) => {
      // console.log(shelf,'shelf')
      const shelfObj = shelf.shelfCode
      shelf.cell.map((cell:any) => {
        // console.log(cell.plate?.box,'box')
        // console.log(cell,'cell')
        const cellObj = {
          id: cell.cellId,
          colNo: cell.colNo,
          rowNo: cell.rowNo
        }
        if (cell.plate !== null) {
          cell.plate.box.map((box:any) => {
            // console.log(box.product,box,zone.zoneCode,'box')
            box.shelfNo = shelfObj
            box.cellPosition = cellObj
            box.palletNo = cell.plate.plateCode
            // console.log(box,'box')
            getAllProduct.push(box)
          })
          cell.plate.rawMaterialBox.map((mBox:any) => {
            mBox.shelfNo = shelfObj
            mBox.cellPosition = cellObj
            mBox.palletNo = cell.plate.plateCode
            getAllMaterial.push(mBox)
          })
        }
      })
    })
  })

  const getProductsDetailByShelf = (code:string) => {
    const selectedProduct = selectProduct.filter((product:any) => product.shelfNo === code)
    setModalTitle('Product')
    setSelectedDataFromShelf(combinePosition(selectedProduct))
    setIsModalVisible(true)
  }

  const [modalTitle, setModalTitle] = useState<string>('')
  const [selectedDataFromShelf, setSelectedDataFromShelf] = useState<any>([])

  const getMaterialsDetailByShelf = (id:string) => {
    const selectedMaterial = selectMaterial.filter((product:any) => product.shelfNo === id)
    setModalTitle('Material')
    setSelectedDataFromShelf(combinePosition(selectedMaterial))
    setIsModalVisible(true)
  }

  const getPlatesDetailByShelf = (code: string) => {
    const zoneCode = code.slice(0, 1)
    const array: any = []
    zoneData.filter((zone: any) => zone.zoneCode === zoneCode)[0].shelf
      .filter((shelf: any) => shelf.shelfCode === code)[0].cell
      .forEach((cell: any) => {
        if (cell.plate) {
          const position = `${code}-${cell.rowNo}-${cell.colNo}`
          cell.plate.position = position
          array.push(cell.plate)
        }
      })
    setShelfDetailsData(array)
    setShowShelfDetails(true)
  }

  const combinePosition = (data:any) => {
    data.map((res:any) => {
      res.position = `${res.shelfNo}-${res.cellPosition.rowNo}-${res.cellPosition.colNo}`
    })
    return data
  }

  const productDeleteHandler = (newProduct:any) => {
    // console.log(newProduct,'ssdasdada')
    getAllZoneRequestForRefresh().then(res => {
      // console.log(res.data.data, 'zone')
      setZoneData(res.data.data)
    })
    setProductValue(productValue)
  }
  const onAreaClick = (type:number) => {
    // const ttt = TemporaryZoneAndStackingArea.filter(e=>e.)
    // ProductValue
    const fileredBoxes:any = []
    let area:any = []
    if (type == 1) {
      area = TemporaryZoneAndStackingArea?.stacking
    } else {
      area = TemporaryZoneAndStackingArea?.temporary
    }

    if (productValue != '') {

      area.map((pallet:any) => {
        pallet.boxes.map((box:any) => {
          if (box.productId === productValue) {
            box.palletNo = pallet.plate.plateCode
            box.position = pallet.zoneType == 1 ? 'Temporary Area' : 'Stacking Area ' + (pallet.zoneType - 1)
            fileredBoxes.push(box)
          }

        })
      })
      setModalTitle('Product')
    }
    if (materialValue != '') {

      area.map((pallet:any) => {
        pallet.rawMaterialBoxes.map((box:any) => {
          if (box.RawMaterialId === materialValue) {
            box.palletNo = pallet.plate.plateCode
            box.position = pallet.zoneType == 1 ? 'Temp Area' : 'Stacking Area ' + (pallet.zoneType - 1)
            fileredBoxes.push(box)
          }
        })
      })
      setModalTitle('RawMaterial')
    }
    setSelectedDataFromShelf(fileredBoxes)
    setIsModalVisible(true)
  }
  const backgroundStyleChang = (count:number) => {
    const styleOfShelf = {height: 30, width: 50, border: '1px solid black', marginBottom: 10, backgroundColor: 'white'}
    if (count === 0) {
      styleOfShelf.backgroundColor = '#FF9999'
    }
    if (count <= 2) {
      styleOfShelf.backgroundColor = '#FFCC99'
    }

    if (count > 2 && count <= 4) {
      styleOfShelf.backgroundColor = '#FFFF99'
    }

    if (count > 4) {
      styleOfShelf.backgroundColor = '#CCFF99'
    }

    return styleOfShelf

  }

  //console.log(selectTemporaryZoneProductValue, TemporaryZoneAndStackingArea, TemporaryZoneAndStackingArea.temporary)
  return (
    <div>
      <div style={{margin: '20px 0px'}}>
        <Space size={10}>
          <div>
                        Product: &nbsp;
            <Iselect onChange={productSelectOnChangeHandler} data={productSelect} width={600} value={productValue}/>
          </div>
          <div>
                        Raw Material:&nbsp;
            <Iselect onChange={materialSelectOnChangeHandler} data={materialSelect} width={600} value={materialValue}/>
          </div>
          <div>
            <span>Total Stock: </span><span style={{color:"blue"}}>{totalStock+stackingStock+tempStock}</span>
          </div>
        </Space>
      </div>
      <div style={{marginBottom: 10}}>
        Position: 
        {
          positionNotification.map((firstLayer:any) => {
            let productPosition
            let ProductCount = 0
            // console.log(firstLayer, 'position')
            firstLayer.map((secondLayer:any, index:number) => {
              // console.log(secondLayer,index)
              ProductCount += secondLayer.quantity
              productPosition = `${secondLayer.shelfNo}-${secondLayer.cellPosition.rowNo}-${secondLayer.cellPosition.colNo}`
              return
            })
            return (
              <span>{productPosition} X {ProductCount}; </span>
            )

          })
        }
      </div>
      {/*<div>*/}
      {/*  {*/}
      {/*    zoneData.map((zone:any,index:number) => {*/}
      {/*      return(*/}
      {/*        <div style={{display:'flex', flexDirection:'row'}} key={index}>*/}
      {/*          <div style={{height:30, width:50,border:'1px solid black',marginBottom:10,textAlign:'center'}}>*/}
      {/*            {zone.zoneCode}*/}
      {/*          </div>*/}
      {/*          <div style={{display:'flex', flexDirection:'row', textAlign: 'center'}}>*/}
      {/*            {*/}
      {/*              zone.shelf.map((shelf:any,index2:number) =>{*/}
      {/*                let productFromInner*/}
      {/*                let isProductShow = false*/}
      {/*                let materialFromInner*/}
      {/*                let isMaterialShow = false*/}
      {/*                let numsOfSelectedProduct = 0*/}
      {/*                let numsOfSelectedMaterial = 0*/}
      {/*                // console.log(shelf,index2)*/}
      {/*                // console.log(shelf.cell.filter((res:any)=> res.plate !== null),"?")*/}

      {/*                return(*/}
      {/*                    <div style={backgroundStyleChang(shelf.availableCellCount)} key={index2}>*/}
      {/*                      /!*{shelf.availableCellCount}*!/*/}
      {/*                      {shelf.cell.filter((res:any)=> res.plate !== null).map((cell:any,index:number) => {*/}
      {/*                        // console.log(cell,'cell')*/}
      {/*                        // console.log(cell.plate.box.length,shelf.shelfId)*/}
      {/*                        // console.log(cell.plate.box.filter((res:any) => res.length !== 0),cell.cellId)*/}
      {/*                        return(*/}
      {/*                            <React.Fragment key={index} >*/}
      {/*                              {*/}
      {/*                                cell.plate?.box.map((box:any) =>{*/}
      {/*                                  // console.log(box.product,zone.zoneCode,'box')*/}
      {/*                                  // console.log(box)*/}
      {/*                                  if(box.product.productId === productValue){*/}
      {/*                                    productFromInner = box.product.productName*/}
      {/*                                    isProductShow = true*/}
      {/*                                    numsOfSelectedProduct +=1*/}
      {/*                                  }*/}
      {/*                                  return*/}
      {/*                                })*/}
      {/*                              }*/}
      {/*                              {*/}
      {/*                                cell.plate?.rawMaterialBox.map((material:any,index:number) =>{*/}
      {/*                                  // console.log(material, zone,index)*/}
      {/*                                  if(material.rawMaterial.rawMaterialId === materialValue){*/}
      {/*                                    materialFromInner = material.rawMaterial.rawMaterialCode*/}
      {/*                                    isMaterialShow = true*/}
      {/*                                    numsOfSelectedMaterial +=1*/}
      {/*                                  }*/}
      {/*                                  return*/}
      {/*                                })*/}
      {/*                              }*/}
      {/*                            </React.Fragment>*/}
      {/*                        )*/}
      {/*                      })}*/}
      {/*                      {isProductShow && <span style={{cursor:'pointer'}} onClick={()=>getProductsDetailByShelf(shelf.shelfCode)}>{numsOfSelectedProduct}</span>}*/}
      {/*                      {isMaterialShow &&<span style={{cursor:'pointer'}} onClick={()=>getMaterialsDetailByShelf(shelf.shelfCode)}>{numsOfSelectedMaterial}</span> }*/}

      {/*                    </div>*/}
      {/*                    // <Boxes productFromInner={productFromInner} isProductShow={isProductShow}/>*/}
      {/*                )*/}
      {/*              })*/}
      {/*            }*/}
      {/*          </div>*/}

      {/*        </div>*/}
      {/*      )*/}
      {/*    })*/}
      {/*  }*/}
      {/*</div>*/}
      <ShelfSelector productValue={productValue} materialValue={materialValue} data={zoneData} getProductsDetailByShelf={getProductsDetailByShelf} getMaterialsDetailByShelf={getMaterialsDetailByShelf} getPlatesDetailByShelf={getPlatesDetailByShelf}/>
      <Row style={{marginTop: 20, textAlign: 'center', }}>
        <Col span={4} style={{border: '1px black solid', height: 100}} onClick={() => onAreaClick(0)}>
          <b style={{fontSize: 20}}>Temporary Area</b>
          <hr/>
          {selectTemporaryZoneProductValue.flat(Infinity).length !== 0 ? `${selectTemporaryZoneProductValue.flat(Infinity)[0]?.product.productName} X ${selectTemporaryZoneProductValue.flat(Infinity).length}` : ''}
          {selectTemporaryZoneMaterialValue.flat(Infinity).length !== 0 ? `${selectTemporaryZoneMaterialValue.flat(Infinity)[0]?.rawMaterial.rawMaterialName} X ${selectTemporaryZoneMaterialValue.flat(Infinity).length}` : ''}

        </Col>
        <Col span={4} offset={2} style={{border: '1px black solid', height: 100}} onClick={() => onAreaClick(1)}>
          <b style={{fontSize: 20}}>Stacking Area</b>
          <hr/>
          {selectStackingAreaProductValue.flat(Infinity).length !== 0 ? `${selectStackingAreaProductValue.flat(Infinity)[0]?.product.productName} X ${selectStackingAreaProductValue.flat(Infinity).length}` : ''}
          {selectStackingAreaMaterialValue.flat(Infinity).length !== 0 ? `${selectStackingAreaMaterialValue.flat(Infinity)[0]?.rawMaterial.rawMaterialName} X ${selectStackingAreaMaterialValue.flat(Infinity).length}` : ''}
        </Col>
      </Row>

      <ShowModal data={selectedDataFromShelf} onOk={() => setIsModalVisible(false)} visible={isModalVisible} contentsFor={modalTitle} productData={getAllProduct} materialData={getAllMaterial} productDelete={productDeleteHandler}/>
      <ShelfPlate data={shelfDetailsData} visible={showShelfDetails} onOk={() => setShowShelfDetails(false)} productDelete={productDeleteHandler}/>
    </div>

  )
}

const ShowModal = (props:{data: any, onOk:()=>void, visible:boolean, contentsFor:string, productData:any, materialData:any, productDelete:(data:any)=>void}) => {
  let contents:any
  // console.log(props.data)
  switch (props.contentsFor) {
    case 'Product':
      contents = <ProductTable data={props.data} productData={props.productData} productDelete={props.productDelete}/>
      break
    case 'Material':
      contents = <MaterialTableOfShelf data={props.data}/>
      break
  }
  return (
    <Modal title={props.contentsFor} visible={props.visible} onOk={props.onOk} onCancel={props.onOk} width={1100} destroyOnClose={true}>
      {contents}
    </Modal>
  )
}

const ShelfBoxDetail = (props: {boxData: any, rawMaterialBoxData: any, onOk: () => void, visible: boolean, productDelete: (data: any) => void}) => {
  const { TabPane } = Tabs
  return (
    <Modal title={'Shelf Boxes Detail'} visible={props.visible} onOk={props.onOk} onCancel={props.onOk} width={1100} destroyOnClose={true}>
      <Tabs defaultActiveKey="product">
        <TabPane tab="Product" key="product">
          <ProductTable data={props.boxData} productData={null} productDelete={props.productDelete}/>
        </TabPane>
        <TabPane tab="Material" key="material">
          <MaterialTableOfShelf data={props.rawMaterialBoxData}/>
        </TabPane>
      </Tabs>
    </Modal>
  )
}

const ShelfPlate = (props: {data: any, visible: boolean, onOk: any, productDelete:(data:any)=>void}) => {
  const [boxData, setBoxData] = useState<any>([])
  const [rawMaterialBoxData, setRawMaterialBoxData] = useState<any>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  const openShelfPlateDetails = (plate: any) => {
    plate.box.forEach((item: any) => {
      item.position = plate.position
    })

    plate.rawMaterialBox.forEach((item: any) => {
      item.position = plate.position
    })

    setBoxData(plate.box)
    setRawMaterialBoxData(plate.rawMaterialBox)
    setShowModal(true)
  }
  return (
    <Modal title={'Shelf Pallet'} visible={props.visible} onOk={props.onOk} onCancel={props.onOk} width={1400} destroyOnClose={true}>
      {props.data.length === 0 ? (<h4>There's no plates on this shelf.</h4>) :
        (<div style={{margin: '1rem 0'}}>
          <Row gutter={[16, 16]}>
            {
              props.data?.map((plate:any, index:number) => {
                return (
                  <Col key={index} className="gutter-row" span={4} >
                    <div onClick={() => openShelfPlateDetails(plate)}>
                      <CommonMachineCard
                        img={'https://storage.googleapis.com/neptune_media/7767c281-6989-4601-a9d0-d47596a9a8f9'}
                        machine={plate.plateCode + '(BQty: ' + plate.box.length + ', RQty: ' + plate.rawMaterialBox.length + ')'} />
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        </div>
        )
      }
      <ShelfBoxDetail boxData={boxData} rawMaterialBoxData={rawMaterialBoxData} onOk={() => setShowModal(false)} visible={showModal} productDelete={props.productDelete}/>
    </Modal>
  )
}

export default WarehouseManagement
