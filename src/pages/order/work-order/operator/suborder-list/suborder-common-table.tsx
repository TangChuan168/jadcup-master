import React, { useEffect, useState } from 'react'
import CommonTable from '../../../../../components/common/common-table/common-table'
import ItipsForProduct from '../../../../../components/common/i-tips/product'
import { commonFilterFn, nbsStr } from '../../../../../services/lib/utils/helpers'
import getImage from '../../../../../components/common/common-form/common-image'
import { ButtonsForPageLink } from '../../manager/work-arrangement/work-arrangement-presentation-only-page'
import { imgStringToArray } from '../../../../../components/common/common-column-components/common-edit-image-component'
import { Button, Modal, Upload } from 'antd'
import Plate from '../../../../warehouse/plate'

const SuborderCommonTable = (props: {isPackaging?: boolean, selectedMachine: any, tableData: any, getStatusButton: any}) => {
  const {isPackaging, selectedMachine, tableData, getStatusButton} = props
  const [isPlateModalVisible, setIsPlateModalVisible] = useState(false)
  const [footer, setFooter] = useState<any>(null)

  useEffect(() => {
    setFooterInfo(tableData)
  }, [tableData])

  const getRenderData = (data: any) => {
    const renderData: any = []
    data.map((row: any) => {
      renderData.push({
        ...row,
        product: row.workOrder?.product,
        productId: row.workOrder?.product?.productId,
        productName: row.workOrder?.product?.productName,
        productCode: row.workOrder?.product?.productCode,
        productImage: row.workOrder?.product?.images,
        urgent: row.workOrder?.urgent,
        suborderStatusName: row.suborderStatus?.suborderStatusName,
        completedDate: row.completedDate && (new Date(row.completedDate + '.000Z')).toDateString(),
        requiredDate1: row.workOrder?.requiredDate,
        requiredDate: row.workOrder?.requiredDate && (new Date(row.workOrder?.requiredDate + '.000Z')).toLocaleDateString(),
      })
    })
    return renderData
  }

  const setFooterInfo = (data: any[]) => {
    let total_qty = 0
    for (let i = 0; i < data.length; i++) {
      total_qty += data[i]?.receivedQuantity
    }
    setFooter({
      jobs: data?.length,
      total_qty: total_qty,
    })
  }

  const onFilterChange = (tableRef: any) => {
    debounce(() => setFooterInfo(tableRef.current.dataManager.searchedData),3000)
  }
  let timer:any;
  const debounce = (func:any, timeout = 1000) =>{
    console.log("debouse")
    if (timer) clearTimeout(timer) 
    timer = setTimeout(() => { func(); }, timeout);
  }

  const myfiler=(
    filterValue:any,
    rowData:any
  ) => {
    const filter = filterValue.replace(/-/g, '\u2011').trim();
    const prodName = (rowData.replace(/-/g, '\u2011').trim()).toUpperCase();
    if (prodName.indexOf(filter.toUpperCase()) >=0) return true;

    return false;
  }  

  return (
    <div>
      <Modal destroyOnClose={true} visible={isPlateModalVisible} onOk={() => setIsPlateModalVisible(true)} onCancel={() => setIsPlateModalVisible(false)} width={1200} footer={null}>
        <Plate cancelModal={() => setIsPlateModalVisible(false)} refresh={() => {
          return
        }}/>
      </Modal>
      <div style={{position: 'relative'}}>
        <div style={{marginBottom: '1rem', display: 'flex', alignItems: 'baseline'}}>
          <ButtonsForPageLink />
          <Button type={'primary'} onClick={() => setIsPlateModalVisible(true)} style={{marginTop: '1rem', marginRight: '10px'}}>Store To Pallet</Button>
        </div>
        <div style={{position: 'absolute', top: '130px', left: '26px'}}>
          <span><b>Total Jobs:&nbsp;</b>{footer?.jobs}&nbsp;&nbsp;</span>
          <span><b>Total Qty:&nbsp;</b> {footer?.total_qty}&nbsp;&nbsp;</span>
        </div>
        <CommonTable
          title={
            (isPackaging ? '??????/Packaging' : '?????????/Suborder') +
            ' ' +
            (selectedMachine ? `(Machine: ${selectedMachine.machineName})` : '')
          }
          initData={getRenderData(tableData)}
          onFilterChange={onFilterChange}
          column={[
            { title: '????????????/Product Code', field: 'productCode', customFilterAndSearch: ( filterValue:any,rowData:any) =>myfiler(filterValue, rowData.product?.productCode ) },
            { title: '??????/Product', field: 'productName', customFilterAndSearch:  ( filterValue:any,rowData:any) =>myfiler(filterValue, rowData.product?.productName ) , render: (rowData: any) => <ItipsForProduct id={rowData.productId} label={rowData.productName} isNotCutting={true} /> },
            selectedMachine?.machineTypeId==1?{ title: '??????????????????\nOriginal Qty', field: 'orginalQuantity' }:{ title: '??????????????????\nOriginal Qty', field: 'receivedQuantity' },
            {
              title: '????????????/Product Image',
              field: 'productImage',
              render: (rowData: any) => (
                <Upload
                  listType="picture-card"
                  fileList={[...imgStringToArray(rowData.productImage)]}
                  disabled
                >
                </Upload>
              )
            },
            { title: '???????????????/Received Qty', field: 'receivedQuantity' },
            // { title: '????????????/Completed Qty', field: 'completedQuantity' },
            {
              title: '??????/Urgent',
              field: 'urgent',
              // defaultSort: 'desc',
              lookup: {0: 'No', 1: 'Yes'},
              render: (rowData: any) => rowData.urgent ? <b style={{color: 'red'}}>Yes</b> : <span>No</span>
            },
            {
              title: '????????????/Logs Comment',
              field: 'logsComment',
              render: (rowData: any) => (
                <div>
                  <div style={{color:'blue'}}>{(rowData.workOrder.approvedComments&&rowData.workOrder.approvedComments!='Comment')?rowData.workOrder.approvedComments:null}</div>
                  {
                    rowData.logs?.map((row: any, index: any) => row.comment ? (
                      <div key={index.toString()}>
                        <b>{nbsStr(row.operEmployee?.firstName + ' ' + row.operEmployee?.lastName)}:</b>&nbsp;{row.comment}
                      </div>
                    ) : null)
                  }
                </div>
              )
            },
            { title: '????????????/REQ Date', field: 'requiredDate1', render: (rowData: any) => rowData.requiredDate },
            {
              title: '??????/Status',
              sorting: false,
              defaultFilter: ['1', '2', '3'],
              lookup: { '-1': '??????/Pending', 1: '???/Aw', 2: '???/Pr', 3: '???/Pa', 4: '????????????/NotReady', 9: '????????????/PartlyComp', 10: '??????/Comp', 0: '??????/Canc' },
              customFilterAndSearch: (term: any, rowData: any) => term && term.length ? term.includes(rowData.suborderStatusId?.toString()) : true,
              render: (rowData:any) => (
                // <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                //   {/*<div>{rowData.suborderStatusName}</div>*/}
                // </div>
                <div style={{textAlign: 'center'}}>{getStatusButton(rowData)}</div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

export default SuborderCommonTable
