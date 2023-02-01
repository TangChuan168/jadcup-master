import { getColModelItem } from '../../../services/lib/utils/helpers'
import { urlKey } from '../../../services/api/api-urls'

export default class OnlineUserManagementColumnModel {
	static Column = [
	  {
	    title: 'Username',
	    align: 'left',
	    field: 'userName'
	  },
	  {
	    title: 'Password',
	    align: 'left',
	    field: 'password',
		  editable: 'onAdd',
		  render: (rowData: any) => null
	  },
	  {
	    ...getColModelItem({
	      title: 'Customer',
	      field: 'customer',
	      keywords: [
	        urlKey.Customer
	      ]
	    }, () => ([{key: urlKey.Customer, label: '', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['company', 'customerCode']}}])),
		  render: (rowData: any) => rowData.customer ? (rowData.customer?.company + ' ' + rowData.customer?.customerCode) : ''
	  },
	]
}

