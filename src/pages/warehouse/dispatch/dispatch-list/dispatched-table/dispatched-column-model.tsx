import React from 'react'
import ItipsForProduct from '../../../../../components/common/i-tips/product'
import { Button, Popover, Upload } from 'antd'
import { renderOrderProduct } from '../../../../order/sales-order/sales-order-management-column-model'
import moment from 'moment'

export const DispatchedColumnModel = () => {
	const myfiler=(
		filterValue:any,
		rowData:any
	  ) => {
		const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1).toUpperCase();
		for (let ele of rowData.order.orderProduct){
		  const prodName = ele.product?.productName.replace(/-/g, '\u2011').trim().toUpperCase();
		  if (prodName.indexOf(filter) >=0) return true;
		}
		return false;
	  }  	
  return [
	{
		title: 'Customer',
		field: 'customerStr'
	},
	{
		title: 'Order Products',
		field: 'orderProducts',
		sorting: false,
		filtering: true,
		editable: 'never',
		render: (rowData:any) => (rowData.order && renderOrderProduct(rowData.order, false, rowData.dispatchingDetails)) || '',
		// customFilterAndSearch: (
		// 	filterValue:any,
		// 	rowData:any
		//   ) => {  //product?.productName
		// 		console.log(rowData)
		// 		console.log(rowData.order.orderProduct.map((e:any)=>{return e.product?.productName}))
		// 	 return !filterValue || ( rowData.order?.orderProduct?.map((e:any)=>{return e.product?.productName}).toString().toUpperCase().includes(filterValue.toUpperCase()))
		//   },   
		customFilterAndSearch:(        filterValue:any,
			rowData:any) =>myfiler(
			filterValue,
			rowData
		  ) 		
	},	
	{
		title: 'Details',
		field: 'dispatchingDetails',
		filtering: false,
		sorting: false,
		render: (rowData: any) => (
			<div>
				<Popover
					content={
						rowData.dispatchingDetails?.map((row: any, index: any) => (
							<div key={index}>
								<b>BoxCode:</b>&nbsp;{row.box?.barCode || 'null'}&nbsp;
								<b>Product:</b>&nbsp;<ItipsForProduct id={row.productId} label={row.box?.product?.productName}/>&nbsp;
								<b>Quantity:</b>&nbsp;{row.quantity}&nbsp;
							</div>
						))
					}
					title="Details"
				>
					<Button type="primary" ghost>Show details</Button>
				</Popover>
				{}
			</div>
		)
	},	
	{
	    title: 'CreatedAt',
	    field: 'createdAt1',
		  defaultSort: 'desc',
		  render: (rowData: any) => moment.utc(rowData.createdAt1).local().format('DD/MM/YYYY'),
	  },		  
	{
		title: 'Po',
		field: 'custOrderNo'
	},	  
	{
		title: 'PackingSlip',
		field: 'packingSlipNo'
	},		

	//   {
	//     title: 'Courier',
	//     field: 'courierName',
	//   },

	  {
	    title: 'TrackingNo',
	    field: 'trackingNo',
		render: (rowData: any) => 
			<div>
			  <div>{rowData.courierName ? rowData.courierName : ""}</div>
			  <div>{rowData.trackingNo ? rowData.trackingNo : ""}</div>
		  </div>
		  },
	  {
	    title: 'Status',
	    field: 'status',
	    lookup: {0: 'Cancelled', 1: 'Dispatch', 2: 'Delivered'}
	  },
	  {
	    title: 'Photos',
	    field: 'imgs',
	    render: (rowData: any) => rowData.imgs ?
			(<Popover content = {
				<div style={{width: '66rem', display: 'flex', flexWrap: 'wrap'}}>
					{getImgs(rowData.imgs).map((img: any) => (
						<div key={img.name} style={{width: '20rem', height: '20rem', margin: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
							<Upload className="img-preview"
								listType="picture-card"
								fileList={[img]}
								disabled>
							</Upload>
						</div>
					))}
				</div>
			} title="Photo Details">
				<div style={{width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<img style={{width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%'}} src={getImgs(rowData.imgs)[0]?getImgs(rowData.imgs)[0].url:null} />
				</div>
			</Popover>) : null
	  },

  ]
}

const getImgs = (imgStr: string) => {
  return imgStr ? JSON.parse(imgStr) : null
}
