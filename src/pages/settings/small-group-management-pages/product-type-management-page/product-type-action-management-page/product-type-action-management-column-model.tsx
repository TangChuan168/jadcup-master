import { getColModelItem } from '../../../../../services/lib/utils/helpers'
import { urlKey } from '../../../../../services/api/api-urls'

export default class ProductTypeActionManagementColumnModel {
	static Column = [
		{
			...getColModelItem({
				title: 'Action',
				field: urlKey.Action,
				keywords: [
					urlKey.Action
				]
			}, () => ([{key: urlKey.Action, label: '', otherOptions: {type: 'select'}}]))
		},
		{
			...getColModelItem({
				title: 'Order Type',
				field: urlKey.OrderType,
				keywords: [
					urlKey.OrderType
				]
			}, () => ([{key: urlKey.OrderType, label: '', otherOptions: {type: 'select'}}]))
		},
		{
			title: 'Sequence No',
			// align: 'left',
			type: 'numeric',
			field: 'sequenceNo'
		}
	]
}
