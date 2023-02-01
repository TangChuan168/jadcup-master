import { getColModelItem, getItemsObj, renderFn } from '../../../../services/lib/utils/helpers'
import { urlKey } from '../../../../services/api/api-urls'

export default class ProductPriceManagementColumnModel {
	static Column = [
	  {
	    ...getColModelItem({
	      title: 'Customer Group',
	      field: 'groupName',
	      keywords: [
	        urlKey.CustomerGroup1
	      ]
	    }, () => ([{key: urlKey.CustomerGroup1, label: '', otherOptions: {type: 'select'}}])),
	    render: (rowData: any) => rowData.group1 ? renderFn(getItemsObj([{key: urlKey.CustomerGroup1, label: '', otherOptions: {type: 'select'}}], rowData), [urlKey.CustomerGroup1]) : 'All',
		  defaultSort: 'asc',
		  sorting: true
	  },
	  {
	    title: 'QTY/Carton',
	    field: 'quantiy',
	    type: 'numeric',
		  defaultSort: 'asc',
	  },
	  {
	    title: 'Price',
	    field: 'price',
	    type: 'numeric',
	  },
	  {
	    title: 'MOQ',
	    field: 'description',
	  },
	  {
	    title: 'Last Price',
	    field: 'originalPrice',
		type: 'numeric',
	  },	  
	]
}
