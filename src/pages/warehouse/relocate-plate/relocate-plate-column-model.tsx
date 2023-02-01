import React from 'react'
import { nbsStr } from '../../../services/lib/utils/helpers'

const RelocatePlateColumnModel = () => {
	 return [
	  {
		  title: 'Bar Code',
		  align: 'left',
		  field: 'barCode',
		  render: (rowData: any) => rowData.box?.barCode
	  },
	  {
		  title: 'Box Info',
		  align: 'left',
		  field: 'boxInfo',
		  render: (rowData: any) => rowData.box && nbsStr(rowData.box?.product?.productName + ' * ' + rowData.box?.quantity)
	  },
    {
      title: 'Raw Material Box Code',
      align: 'left',
      field: 'boxCode',
      render: (rowData: any) => rowData.rawMaterialBox?.boxCode
    },
    {
      title: 'Raw Material Box Info',
      align: 'left',
      field: 'rawMaterialBoxInfo',
      render: (rowData: any) => rowData.rawMaterialBox && nbsStr(rowData.rawMaterialBox?.rawMaterial?.rawMaterialName + ' - ' + rowData.rawMaterialBox?.rawMaterial?.rawMaterialCode + ' * ' + rowData.rawMaterialBox?.quantity)
    },
  ]
}

export default RelocatePlateColumnModel

