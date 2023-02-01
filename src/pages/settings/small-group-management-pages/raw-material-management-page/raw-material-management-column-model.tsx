import { TextField } from "@material-ui/core"
import React from "react"

export const renderOrderProduct = (rowData: any) => {
	console.log(rowData)
	return (rowData.suplierRawMaterial.length>0 && (
		<div>
			{
				rowData.suplierRawMaterial.map((row: any) => (
					<div>
						<b>Suplier:</b>{row.suplier.suplierName}&nbsp;&nbsp;<b>ProdCode:</b>{row.suplierProductCode}&nbsp;&nbsp;<b>UnitPrice:</b>{row.unitPrice}
					</div>
				))
			}
		</div>
	))
}
  
export default class RawMaterialManagementColumnModel {
	static RawMaterialManagementColumn = [
	  {
	    title: 'Raw material code',
	    align: 'left',
	    field: 'rawMaterialCode',
		editComponent: (props:any) => (
			<TextField
				value={props.value}
			fullWidth={true}
			multiline={true}
			onChange={e => props.onChange(e.target.value)}
			/>)		
	  },
	  {
		  title: 'Raw material name',
		  align: 'left',
		  field: 'rawMaterialName',
		  editComponent: (props:any) => (
			<TextField
				value={props.value}
			fullWidth={true}
			multiline={true}
			onChange={e => props.onChange(e.target.value)}
			/>)
	  },
	  {
	    title: 'Alarm Limit',
	    align: 'left',
		  filtering: false,
	    type: 'numeric',
	    field: 'alarmLimit',
		width: "10%" 	  
	  },
	  {
	    title: 'Supllier Info',
	    align: 'left',
	    field: 'supllierInfo',
		render: (rowData:any) => renderOrderProduct(rowData),
	  }
	]
}
