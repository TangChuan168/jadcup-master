import { getColModelItem } from '../../../../services/lib/utils/helpers'
import { urlKey } from '../../../../services/api/api-urls'

export default class MachineActionManagementColumnModel {
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
				title: 'Machine',
				field: urlKey.Machine,
				keywords: [
					urlKey.Machine
				]
			}, () => ([{key: urlKey.Machine, label: '', otherOptions: {type: 'select'}}]))
		}
	]
}
