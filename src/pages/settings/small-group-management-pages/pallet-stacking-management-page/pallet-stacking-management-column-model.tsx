import { getColModelItem } from '../../../../services/lib/utils/helpers'

export default class PalletStackingManagementColumnModel {
	static PalletStackingManagementColumn = [
	  {
		  title: 'Name',
		  align: 'left',
		  field: 'palletStackingName'
	  },
		{
			title: 'Qty',
			align: 'left',
			type: 'numeric',
			field: 'quantity'
		},
		{
			...getColModelItem({
				title: 'Img',
				field: 'layoutImage',
				keywords: [
					'layoutImage'
				]
			}, () => ([{key: 'layoutImage', label: 'Img', otherOptions: {type: 'image'}}]))
		}
	]
}
