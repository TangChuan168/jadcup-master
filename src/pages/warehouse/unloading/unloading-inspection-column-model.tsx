import React from 'react'
import { Button, Popover } from 'antd'
import { nbsStr } from '../../../services/lib/utils/helpers'
import moment from 'moment'

const UnloadingInspectionColumnModel = (props: any) => {
  return [
    {
      title: 'PO Number',
      field: 'poNo',
      // sorting: false,
      // render: (rowData: any) => rowData.po?.poNo
    },
    {
      title: 'Supplier',
      field: 'suplierName',
      // sorting: false,
      // render: (rowData: any) => rowData.po?.suplier?.suplierName
    },    
    {
      title: 'Container Number',
      field: 'containerNo',
    },
    {
      title: 'Arrival Time',
      field: 'arrivalTime1',
      render: (rowData: any) => moment.utc(rowData.arrivalTime1).local().format('DD/MM/YYYY'),
    },
    // {
    //   title: 'Unloading Date',
    //   field: 'unloadingDate1',
    //   render: (rowData: any) => moment.utc(rowData.unloadingDate).local().format('DD/MM/YYYY'),
    // },
    {
      title: 'Receiver',
      field: 'unloadingPeople',
    },
    // {
    //   title: 'Take Away Date',
    //   field: 'takeAwayDate1',
    //   render: (rowData: any) => moment.utc(rowData.takeAwayDate).local().format('DD/MM/YYYY'),
    // },
    // {
    //   title: 'Actual Qty',
    //   field: 'actualQty',
    // },
    // {
    //   title: 'Package Condition',
    //   field: 'conditionOfPackage',
    // },
    {
      title: 'Product Condition',
      field: 'conditionOfProduct',
    },
    // {
    //   title: 'Spending Hours',
    //   field: 'spendingHours',
    // },
    {
      title: 'Notes',
      field: 'notes',
    },
    // {
    //   title: 'PO Status',
    //   field: 'poStatus',
    //   defaultFilter: ['1', '2'],
    //   lookup: { 1: 'New', 2: 'Approved', '3': 'Completed', 0: 'Cancelled', 10: 'Unloading Completed' },
    // },
    {
      title: 'Status',
      field: 'status',
      defaultFilter: ['1'],
      lookup: { 1: 'InProcessing', 10: 'Completed' },
    },    
    // {
    //   title: 'Details',
    //   field: 'rawMaterialBox',
    //   render: (rowData: any) => {
    //     return (
    //       <>
    //         <Popover
    //           content={
    //             <ul>
    //               {
    //                 rowData.rawMaterialBox?.map((row: any, index: number) => {
    //                   return <li key={index.toString()}>{nbsStr(row.rawMaterial?.rawMaterialName)}&nbsp;-&nbsp;{row.rawMaterial?.rawMaterialCode}&nbsp;<b style={{ fontSize: '1rem' }}>*</b>{row.quantity}</li>
    //                 })
    //               }
    //               {
    //                 rowData.box?.map((row: any, index: number) => {
    //                   return <li key={index.toString()}>{row.barCode}&nbsp;<b style={{ fontSize: '1rem' }}>*</b>{row.quantity}</li>
    //                 })
    //               }                  
    //             </ul >
                
    //           }
    //           title="Details"
    //         >
    //           <a>Show details</a>
    //         </Popover>
    //         {/* <Button
    //           type="ghost"
    //           onClick={() => {
    //             props.AddNewMaterialDialog(rowData)
    //           }}
    //         >
    //           Edit Raw Material
    //         </Button> */}
    //       </>
    //     )
    //   }


    // },
    /*
    {
      title: 'Outsource Product',
      field: 'box',
      render: (rowData: any) => {
        return (
          <>
            <Popover
              content={
                <ul>
                  {
                    rowData.box?.map((row: any, index: number) => {
                      return <li key={index.toString()}>{row.barCode}&nbsp;<b style={{ fontSize: '1rem' }}>*</b>{row.quantity}</li>
                    })
                  }
                </ul >
              }
              title="Details"
            >
              <a>Show details</a>
            </Popover>
            {/* <Button
              type="ghost"
              onClick={() => {
                props.AddNewBoxDialog(rowData)
              }}
            >
              Edit Box
            </Button> }
          </>
        )
      }


    }*/
  ]
}

export default UnloadingInspectionColumnModel
