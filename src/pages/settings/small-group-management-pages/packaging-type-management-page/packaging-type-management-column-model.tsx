export default class PackagingTypeManagementColumnModel {
	static PackagingTypeManagementColumn = [
	  {
		  title: 'Packaging type',
		  align: 'left',
		  field: 'packagingTypeName'
	  },
		{
			title: 'Qty',
			align: 'left',
			type: 'numeric',
			field: 'quantity'
		},
		{
			title: 'Sleeve Qty',
			align: 'left',
			type: 'numeric',
			field: 'sleeveQty'
		},
		{
			title: 'Sleeve Pkt',
			align: 'left',
			type: 'numeric',
			field: 'sleevePkt'
		}
	]
}
