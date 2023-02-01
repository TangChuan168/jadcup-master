import React from 'react'
import moment from 'moment'
import ItipsForPo from '../../../../components/common/i-tips/purchase-info/index'

export const BoxInfoColumnModel = () => {
  return [
    {
      title: 'Bar Code',
      align: 'left',
      field: 'barCode'
    },
    {
      title: 'Product',
      align: 'left',
      field: 'productName'
    },
    {
      title: 'Customer',
      align: 'left',
      field: 'customerName'
    },    
    {
      title: 'Created At',
      align: 'left',
      field: 'createdAt',
      render: (rowData: any) => moment.utc(rowData.createdAt).local().format('DD/MM/YYYY'),
    },
    {
      title: 'Prt By',
      align: 'left',
      field: 'printerName',
    },
    {
      title: 'Prt At',
      align: 'left',
      field: 'printedAt',
      render: (rowData: any) => rowData.printedAt?moment.utc(rowData.printedAt).local().format('DD/MM/YYYY'):null,      
    },

    {
      title: 'Prod At',
      align: 'left',
      field: 'productionAt',
      render: (rowData: any) => rowData.productionAt?moment.utc(rowData.productionAt).local().format('DD/MM/YYYY'):null,        
    },
    {
      title: 'Prod By',
      align: 'left',
      field: 'productionerName',
    },
    {
      title: 'Pack At',
      align: 'left',
      field: 'packagedAt',
      render: (rowData: any) => rowData.packagedAt?moment.utc(rowData.packagedAt).local().format('DD/MM/YYYY'):null,        
    },    
    {
      title: 'Pack By',
      align: 'left',
      field: 'packagerName',
    },      
    {
      title: 'Disp At',
      align: 'left',
      field: 'dispatchedAt',
      render: (rowData: any) => rowData.dispatchedAt?moment.utc(rowData.dispatchedAt).local().format('DD/MM/YYYY'):null,           
    },    
    {
      title: 'Disp By',
      align: 'left',
      field: 'dispatcherName',
    },         
    {
      title: 'Qty',
      align: 'left',
      field: 'quantity',
    },
    {
      title: 'RM',
      align: 'left',
      field: 'poNo',
      render: (rowData: any) =>  <ItipsForPo poNo={rowData.poNo} label={rowData.poNo}></ItipsForPo>,       
    },    
    {
      title: 'Source',
      align: 'left',
      field: 'source',
      lookup: {0: 'Manual Created', 1: 'Sales Order',2: 'Manually Order',3: 'Inventory Order'},
    },      
    // {
    //   title: 'Status',
    //   align: 'left',
    //   field: 'status',
    //   lookup: {0: 'Del', 1: 'Normal',2: 'In Dispatching'},
    // }, 
    {
      title: 'Update At',
      align: 'left',
      field: 'updatedAt',
      render: (rowData: any) => rowData.updatedAt?moment.utc(rowData.updatedAt).local().format('DD/MM/YYYY'):null,        
    },       
    {
      title: 'Location',
      align: 'left',
      field: 'location2',
      lookup: {1: 'Warehouse', 2:"In Dispatching",3: 'Deliveried',4:"deleted",5:"Unknown",},
    },     
    // {
    //   title: 'Position',
    //   align: 'left',
    //   field: 'position'
    // },
    // {
    //   title: 'Pallet',
    //   align: 'left',
    //   field: 'palletCode'
    // },
  ]
}
