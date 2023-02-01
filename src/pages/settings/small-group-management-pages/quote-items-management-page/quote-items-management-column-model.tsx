import { urlKey } from '../../../../services/api/api-urls'

export default class QuoteItemsManagementColumnModel {
	static Column = [
	  {
	    title: 'Name',
	    align: 'left',
	    field: urlKey.QuotationOptionItem + 'Name'
	  }
	]
}

