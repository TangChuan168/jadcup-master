import ItipsForProduct from '../../../../../components/common/i-tips/product'
import React from 'react'

export const DispatchOrderDetailsColumnModel = () => {
  return [
	  {
	    title: 'Product',
	    field: 'product',
		  render: (rowData: any) => rowData.product ? <ItipsForProduct id={rowData.productId} label={rowData.product.productName} /> : null
	  },
	  {
	    title: 'Quantity',
	    field: 'quantity'
		// field: 'productQty'
	  },
	//   {
	//     title: 'Delivered',
	//     field: 'delivered',
	//     defaultFilter: ['0'],
	//     lookup: {0: 'No', 1: 'Yes'}
	//   },
	  {
	    title: 'Delivered Qty',
	    field: 'deliveredQuantity'
	  },
	  {
		  title: 'Selected Qty',
		  field: 'selectedQty'
	  }
  ]
}
