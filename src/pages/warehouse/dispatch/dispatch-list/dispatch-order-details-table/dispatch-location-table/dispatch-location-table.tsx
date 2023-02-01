import React, { useEffect, useState } from 'react'
import CommonTablePage from '../../../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../../services/api/api'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'
import {DispatchLocationColumnModel} from './dispatch-location-column-model'
import {Button} from 'antd'
import {getRandomKey} from '../../../../../../services/lib/utils/helpers'
import { CommonCheckboxTree } from '../../../../../../components/common/others/common-checkbox-tree'

export const getLocationCode = (row: any) => {
  if (row.cell) {
    return getLocationString(row.cell.shelf?.zone?.zoneCode) +
    getLocationString(row.cell.shelf?.shelfCode) +
    getLocationString(row.cell.rowNo) +
    (row.cell.colNo || 'null')
  }
  if (row.tempzone){
    if (row.tempzone.zoneType==1) return "Temprary Area"
    if (row.tempzone.zoneType > 1) return "Stacking Area "+ (row.tempzone.zoneType-1)
  }
  return "";
}

export const getShelfCode = (row: any) => {
  if (row.cell) {
    return getLocationString(row.cell.shelf?.zone?.zoneCode) +
    getLocationString(row.cell.shelf?.shelfCode) +
    getLocationString(row.cell.rowNo) +
    (row.cell.colNo || 'null')
  }
  return ''
}

export const getTempzoneCode = (row: any) => {
  if (row.tempzone) {
    if (row.tempzone.zoneType==1) return "Temprary Area"
    if (row.tempzone.zoneType > 1) return "Stacking Area "+ (row.tempzone.zoneType-1)
  }
  return '';
}

const getLocationString = (locationItem: any) => {
  if (locationItem) {
    return locationItem + '-'
  }
  return 'null-'
}

const DispatchLocationTable = (props: {orderProductData?: any, orderId: any, onDialogClose: any, isUpdate?: boolean, dispatchData?: any, orderProductWithDetails?: any, qty?: any}):any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [currentOrderProductWithDetails, setCurrentOrderProductWithDetails] = useState<any>([])
  const [selectedWholeBoxes, setSelectedWholeBoxes] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const currentOP = React.useRef()

  useEffect(() => {
    currentOP.current = currentOrderProductWithDetails
  }, [currentOrderProductWithDetails])

  const getRenderData = async () => {
    console.log(props.dispatchData)
    console.log(props.orderProductData)
    console.log(props.orderProductWithDetails)
    console.log(props.orderProductData?.orderProductId)
    const filteredResult = (
      (currentOrderProductWithDetails?.length && currentOrderProductWithDetails) ||
      props.orderProductWithDetails.filter((row: any) => row.orderProductId === props.orderProductData?.orderProductId)[0]?.details ||
      props.dispatchData?.dispatchingDetails
    )
    console.log(filteredResult)
    setCurrentOrderProductWithDetails(filteredResult)
    const result = await ApiRequest({
      url: 'Box/GetBoxLocationByProductId?productId=' + props.orderProductData?.productId,
      method: 'get',
    })
    const renderData: any = []
    // console.log(props.dispatchData)
    // console.log(boxQty)
    result.data.data
      .map((row: any) => {
        renderData.push({
          ...row,
          locationCode: getLocationCode(row),
          quantity: getRenderDataQuantity(row, filteredResult),
          tableData: {
            ...row.tableData,
            checked: getRenderDataChecked(row, filteredResult)
          }
        })
      })
    console.log(renderData)
    setTableData(renderData)
    getTreeData(renderData)
    return renderData
  }

  const getRenderDataChecked = (row: any, currentOrderProductWithDetails: any) => {
    let checkArr
    if (currentOrderProductWithDetails?.length) {
      checkArr = currentOrderProductWithDetails
    } else {
      checkArr = props.dispatchData?.dispatchingDetails
    }
    return !!checkArr?.filter((item: any) => item.boxId === row.boxId)[0]
  }

  const getRenderDataQuantity = (row: any, currentOrderProductWithDetails: any) => (
      currentOrderProductWithDetails?.filter((item: any) => item.boxId === row.boxId)[0]?.quantity ||
      props.dispatchData?.dispatchingDetails?.filter((item: any) => item.boxId === row.boxId)[0]?.quantity ||
      row.quantity
  )

  const onSelectionChange = (newRows: any) => {
    console.log(newRows)
    console.log(currentOrderProductWithDetails)
    console.log(currentOP.current)
    setCurrentOrderProductWithDetails(newRows)
  }


  const actionButtons: any = [
    // {
    //   icon: '', //Button attr of Ant design (danger, ghost)
    //   tooltip: 'Confirm',
    //   isFreeAction: false,
    //   onClick: async (event: any, rowData: any) => {
    //     const result = await SweetAlertService.confirmMessage()
    //     if (result) {
    //       onConfirm(
    //         currentOrderProductWithDetails.map((row: any) => ({
    //           ...row,
    //           orderProductId: props.orderProductData?.orderProductId,
    //           quantity: getRenderDataQuantity(row, currentOrderProductWithDetails),
    //           isWhole: selectedWholeBoxes.filter((item: any) => item.boxId === row.boxId)[0] ? 1 : 0
    //         }))
    //       )
    //     }
    //   }
    // },
    // {
    //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
    //   tooltip: 'Set as whole',
    //   isFreeAction: false,
    //   onClick: async (event: any, rowData: any) => {
    //     console.log(currentOP.current)
    //     setSelectedWholeBoxes(currentOP.current)
    //     SweetAlertService.successMessage()
    //   }
    // },
    {
      icon: 'danger', //Button attr of Ant design (danger, ghost)
      tooltip: 'Clear',
      isFreeAction: true,
      onClick: async (event: any, rowData: any) => {
        const result = await SweetAlertService.confirmMessage()
        if (result) {
          onConfirm([])
        }
      }
    }
  ]

  const onConfirm = (details: any) => {
    const requestData: any = {
      orderProductId: props.orderProductData?.orderProductId,
      details: details
    }
    if (props.isUpdate) {
      requestData.dispatchId = props.dispatchData.dispatchId
    }
    // console.log(requestData)
    props.onDialogClose(requestData)
  }
  const  confirmClick = async () => {
    const req = props.orderProductData?.quantity - props.orderProductData?.deliveredQuantity;
    const selected = currentOrderProductWithDetails?.reduce((a: any, c: any) => a + c.quantity, 0);
    let result:any;
    result = await SweetAlertService.confirmMessage();
    if (!result) return;
    if (req != selected){
      result = await SweetAlertService.confirmMessage("Required is "+req+" and Selected is "+selected+" ,Are you sure!")
    }

    if (result) {
      onConfirm(
        currentOrderProductWithDetails.map((row: any) => ({
          ...row,
          orderProductId: props.orderProductData?.orderProductId,
          quantity: getRenderDataQuantity(row, currentOrderProductWithDetails),
          isWhole: selectedWholeBoxes.filter((item: any) => item.boxId === row.boxId)[0] ? 1 : 0
        }))
      )
    }
  }
  const onChangeQty = async (rowData: any) => {
    console.log(currentOP.current)
    const orderProductWithDetails: any = currentOP.current
    console.log(currentOrderProductWithDetails)
    const result = await SweetAlertService.inputConfirm({type: 'number', title: 'Change Qty', placeholder: 'qty', defaultValue: rowData.quantity})
    // console.log(result)
    if (result !== null) {
      let qty = result || rowData.quantity
      qty = parseInt(qty)
      if (qty <= 0) {
        SweetAlertService.errorMessage('Please input a valid qty')
        return
      }
      let newBoxQty = orderProductWithDetails
      if (orderProductWithDetails?.filter((row: any) => row.boxId === rowData.boxId)[0]) {
        newBoxQty = orderProductWithDetails.map((row: any) => {
          if (row.boxId === rowData.boxId) {
            if (qty < row.quantity) {
              return {...row, quantity: qty}
            } else {
              SweetAlertService.errorMessage('Value must be less than Original Quantity.')
            }
          }
          return row
        })
        console.log(newBoxQty)
        setCurrentOrderProductWithDetails(newBoxQty)
        setTriggerResetData(getRandomKey())
      } else {
        SweetAlertService.errorMessage('Please select firstly.')
      }
    }
  }

  const changeQtyButton = (rowData: any) => (
    <div>
      <Button
        style={{marginLeft: '1rem'}}
        type="primary"
        onClick={() => onChangeQty(rowData)}
      >Change Qty</Button>
      {/*<Button*/}
      {/*  style={{marginLeft: '1rem'}}*/}
      {/*  type="ghost"*/}
      {/*  onClick={async () => {*/}
      {/*    const result = await SweetAlertService.inputConfirm({type:'number', title:'Change Qty', placeholder:'qty', defaultValue: rowData.quantity})*/}
      {/*    // console.log(result)*/}
      {/*    if (result !== null) {*/}
      {/*      let qty = result || rowData.quantity*/}
      {/*      qty = parseInt(qty)*/}
      {/*      if (qty <= 0) {*/}
      {/*        SweetAlertService.errorMessage('Please input a valid qty')*/}
      {/*        return*/}
      {/*      }*/}
      {/*      ApiRequest({*/}
      {/*        url: 'Box/UpdateStockBoxQuantity?boxId=' + rowData.boxId + '&quantity=' + qty,*/}
      {/*        method: 'put'*/}
      {/*      })*/}
      {/*    }*/}
      {/*  }}*/}
      {/*>Update Box Qty</Button>*/}
    </div>
  )

  const getTreeData = (data?: any) => {
    let treeData: any = []
    const formattedTableData = (data || tableData).map((item: any) => ({
      title: item.plate?.plateCode || 'No plate code',
      children: [{
        title: (item.barCode || 'No bar code') + (item.locationCode ? ' (' + item.locationCode + ')' : ''),
        key: item.boxId,
        locationCode : item.locationCode
      }]
    }))
    console.log(formattedTableData)
    formattedTableData.map((item: any) => {
      if (treeData.filter((row: any) => row.title === item.title)[0]) {
        treeData = treeData.map((itemTree: any) => itemTree.title === item.title ? ({...itemTree, children: [...itemTree.children, ...item.children]}) : itemTree)
      } else {
        treeData.push(item)
      }
    })
    // item.title = item.title+item.children[0].locationCode ? '-(' + item.children[0].locationCode + ')' : ''
    // item.title = item.title+'-['+item.children.length+'Carton Boxes]'
    treeData.map((item:any)=>{
    item.title = item.title +'  - 【'+item.children.length+'】'+ (item.children[0].locationCode ? '【' + item.children[0].locationCode + '】' : '')
    })
    console.log(treeData)
    const arrayData = treeData.map((data: any) => {
      return {title: data.title, key: data.title}
    })
    let arrayDataIndex = 0
    treeData.forEach((data: any) => {
      let length = data.children.length
      let index = 0
      const childrenData = []
      if (data.children.length <= 10) {
        childrenData.push({title: `【${length}】${data.title}  Part1`, key: `${data.title} Part1`, children: data.children})
      } else {
        while (length > 10) {
          childrenData.push({title: `【10】${data.title} Part${index + 1}`, key: `${data.title} Part${index + 1}`, children: data.children.slice((index * 10), ((index * 10) + 10))})
          length -= 10
          index += 1
        }
        childrenData.push({title: `【${length}】${data.title}  Part${index + 1}`, key: `${data.title} Part${index + 1}`, children: data.children.slice((index * 10), data.children.length)})
      }
      arrayData[arrayDataIndex].children = childrenData
      arrayDataIndex++
    })
    console.log(arrayData)
    return arrayData
  }

  return props.orderProductData?.productId ? (
    <div>
      <div style={{position:'fixed',marginTop:"-90px",left:"450px",zIndex:999, border:"groove 1px", backgroundColor:'white', padding:"10px" ,width:"60%"}}>
        <span><b>Order QTY: </b>{props.orderProductData?.quantity}</span>
        <span>&nbsp;&nbsp;<b>Deliverd QTY: </b>{props.orderProductData?.deliveredQuantity}</span>
        <span>&nbsp;&nbsp;<b>REQ QTY: </b>{props.orderProductData?.quantity - props.orderProductData?.deliveredQuantity}</span>
        <span>&nbsp;&nbsp;<b>Selected QTY: </b>{currentOrderProductWithDetails?.reduce((a: any, c: any) => a + c.quantity, 0) || ''}&nbsp;</span>
        { currentOrderProductWithDetails?.reduce((a: any, c: any) => a + c.quantity, 0) > 0 && <span><Button type="primary"  onClick={confirmClick}>Confirm</Button></span>}
      </div>
      <div style={{margin: '1rem 0'}}>
        <CommonCheckboxTree
          isShowTree={true}
          data={getTreeData()}
          checkedItems={currentOrderProductWithDetails?.map((item: any) => item.boxId) || []}
          onChange={(data: any) => {
            onSelectionChange(tableData.filter((item: any) => data.includes(item.boxId)))
            setTriggerResetData(getRandomKey())
          }}
        />
      </div>
      <CommonTablePage
        urlInfoKey={urlKey.City}
        title={'Locations table - ' + (props.isUpdate ? 'Update' : 'Create')}
        column={DispatchLocationColumnModel({changeQtyButton: changeQtyButton})}
        mappingRenderData={(data: any) => getRenderData()}
        isNotEditable={true}
        isNotDeletable={true}
        isNotAddable={true}
        isEnableSelect={true}
        actionButtons={actionButtons}
        triggerResetData={triggerResetData}
        onSelectionChange={onSelectionChange}
      />
    </div>
  ) : null
}

export default DispatchLocationTable
