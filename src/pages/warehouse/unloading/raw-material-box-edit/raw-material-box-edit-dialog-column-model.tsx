import React from 'react'

const RawMaterialBoxColumnModel = (): any => {
  return [
    {
      title: 'Raw Material',
      field: 'rawMaterial',
      sorting: false,
      render: (rowData: any) => rowData.rawMaterial?.rawMaterialName + '-' + rowData.rawMaterial?.rawMaterialCode
    },
    {
      title: 'Pallet',
      field: 'plate',
      render: (rowData: any) => rowData.plate?.plateCode
    },
    {
      title: 'Zone - Shelf - Row - Col',
      field: 'locationCode'
    },
    {
      title: 'Is Moved To Cell',
      field: 'isCell',
      lookup: {0: 'No', 1: 'Yes'}
    }
  ]
}

export default RawMaterialBoxColumnModel
