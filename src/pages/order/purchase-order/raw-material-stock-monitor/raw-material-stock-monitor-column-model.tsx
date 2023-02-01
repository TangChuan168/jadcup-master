import React from 'react'
import { nbsStr } from '../../../../services/lib/utils/helpers'

const RawMaterialStockMonitorColumnModel = () => {
  return [
    {
      title: 'Code',
      field: 'rawMaterialCode',
    },
    {
      title: 'Name',
      field: 'rawMaterialName',
    },
    {
      title: 'Alarm Limit',
      field: 'alarmLimit',
    },
    {
      title: 'inStock',
      field: 'inStock',
    },
    {
      title: 'Pending',
      field: 'unloadingZone',
      render: (rowData: any) => (
        <div>
           {rowData.unloadingZone>0 && <div><b>Unloading:</b>{rowData.unloadingZone}</div>}
           {rowData.pendingPo>0 && <div><b>Purchase:</b>{rowData.pendingPo}</div>}
           {rowData.pendingSales>0 && <div><b>Sale:</b>{rowData.pendingSales}</div>}
           {rowData.pendingApplication>0 && <div><b>Application:</b>{rowData.pendingApplication}</div>}
        </div>              
      )      
    },    
    {
      title: 'Suggested PO',
      field: 'suggestedPo',
    },
    // {
    //   title: 'Name',
    //   field: 'rawMaterialName',
    // },
    {
      title: 'Suppliers && Qty',
      field: 'supplierQty',
      filtering: false,
      render: (rowData: any) => (
        <div>
          {
            rowData.rawMaterialSuplierStock?.map((row: any, i: any) => <p>{nbsStr(row.supplier?.suplierName + ' -- ' + row.quantity)}</p>)
          }
        </div>
      )
    },
    {
      title: 'Low',
      field: 'low',
      defaultFilter: ['1'],
      lookup: {0: 'No', 1: 'Yes'},
    },
    {
      title: 'OutSource Prod',
      field: 'isProduct',
      defaultFilter: ['0'],
      lookup: {0: 'RawMaterial', 1: 'OutSource'},
    }    
  ]
}

export default RawMaterialStockMonitorColumnModel
