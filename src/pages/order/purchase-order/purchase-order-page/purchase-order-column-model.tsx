import React from 'react'
import { nbsStr } from '../../../../services/lib/utils/helpers'
import moment from 'moment'

export const optionsArray = [{value: 1, label: 'Delivery Fee'}, {value: 2, label: 'Urgent Fee'}, {value: 3, label: 'Setup Fee'}]

const myfiler=(
  filterValue:any,
  rowData:any
  ) => {
  const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1).toUpperCase();
  for (let ele of rowData.poDetail){
    const prodName = ele?.rawMaterial.rawMaterialCode?.toUpperCase().replace(/-/g, '\u2011') + ele?.rawMaterial.rawMaterialName?.toUpperCase().replace(/-/g, '\u2011')
    if (prodName.indexOf(filter) >=0) return true;
  }
  return false
  }  

export const PurchaseOrderColumnModel = (): any => {
  return [
    {
      title: 'PO Number',
      field: 'poNo'
    },
    {
      title: 'Details',
      field: 'poDetail',
      filtering: true,
      render: (rowData: any) => {
        return (
          <ul>
            {rowData.poDetail?.map((row: any, index: number) => {
              return <li style={{display:"flex"}} key={index.toString()}><div style={{width:"65ch"}}>{nbsStr(row.rawMaterial?.rawMaterialCode + ' / ' + row.rawMaterial?.rawMaterialName,false,65)}</div><div><b style={{fontSize: '1rem'}}></b>PUR:{row.quantity},REV:{row.totalRevQty},HDL:{row.totalHandledQty}<b style={{fontSize: '1rem'}}></b></div></li>
            })}
            {rowData.poOption?.map((row: any, index: number) => {
              return <li key={index.toString()}>{optionsArray.filter((fee: any) => fee.value === row.optionId)[0].label}: ${row.price}</li>
            })}
          </ul>
        )
      },
      customFilterAndSearch:(        filterValue:any,
        rowData:any) =>myfiler(
        filterValue,
        rowData
        ) 	      
    },
    {
      title: 'Price',
      field: 'price',
      // type: 'currency',
      render: (rowData: any) => {
        return <div>${rowData.price + (rowData.poOption?.reduce((a: number, o: any) => a + o?.price, 0) || 0)}</div>
      }
    },
    {
      title: 'Supplier',
      field: 'supplierName'
    },
    {
      title: 'Created By',
      field: 'createdEmployeeName'
    },
   
    // {
    //   title: 'Delivery Addr',
    //   field: 'deliveryAddr'
    // },
    // {
    //   title: 'Delivery Date',
    //   field: 'deliveryDate1',
    // },
    {
      title: 'Created At',
      field: 'createdAt',
      render: (rowData: any) => moment.utc(rowData.createdAt).local().format('DD/MM/YYYY')
    },     
    {
      title: 'Status',
      field: 'poStatusId',
      defaultFilter: ['1', '2', '10'],
      lookup: { 1: 'AwAppr', 2: 'Appr', 3: 'Comp', 0: 'Canc', 10: 'UL' },
    }
  ]
}
