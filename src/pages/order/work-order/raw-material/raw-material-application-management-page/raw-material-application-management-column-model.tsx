const RawMaterialApplicationManagementColumnModel = () => {
  return [
    {
      title: 'Raw Material',
      field: 'rawMaterialCode'
    },
    {
      title: 'Quantity',
      field: 'applyQuantity',
      render: (rowData: any) => rowData.applyQuantity ? (rowData.applyQuantity + 'KG') : null
    },
    {
      title: 'Apply At',
      field: 'appliedAt1',
      render: (rowData: any) => rowData.appliedAt,
    },
    {
      title: 'Apply By',
      field: 'applyEmployeeName',
    },
    {
      title: 'Warehouse',
      field: 'processed',
      lookup: {0: 'Not Picked', 1: 'Picked'}      
    },    
    {
      title: 'Status',
      field: 'isComplete',
      sorting: false,
      defaultFilter: ['0'],
      lookup: {0: 'Not Complete', 1: 'Complete'}
    }
  ]
}

export default RawMaterialApplicationManagementColumnModel
