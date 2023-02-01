import React from 'react'
import { Button } from 'antd'

const StockMonitorColumnModel = (props: any) => {
  return [
    {
      title: 'Name',
      field: 'productName',
      // defaultSort: 'asc'
    },
    {
      title: 'Product',
      field: 'productFilter',
      filtering: false,
      sorting: false,
      render: (rowData: any) => rowData.productInventoryInfo ? (
        <div>
          <div>
            <b>InStock:&nbsp;</b>{rowData.productInventoryInfo.productInStock}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>Msl:&nbsp;</b>{rowData.productInventoryInfo.productMsl}
          </div>
          <div>
            <b >Appr WO:&nbsp;</b>{rowData.productInventoryInfo.pendingWorkOrderQuantity}&nbsp;&nbsp;            
            <b >Order:&nbsp;</b>{rowData.productInventoryInfo.pendingOrderQuantity}&nbsp;&nbsp;
          </div>
          <div>
            <b >In Packaging:&nbsp;</b>{rowData.productInventoryInfo.pendingWarehouseQuantity}&nbsp;&nbsp;
          </div>
        </div>
      ) : null
    },
    {
      title: 'Semi-Product',
      field: 'semiProductFilter',
      filtering: false,
      sorting: false,
      render: (rowData: any) => rowData.semiProductInventoryInfo ? (
        <div>
          <div>
            <b>InStock:&nbsp;</b>{rowData.semiProductInventoryInfo.semiProductInStock}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>Msl:&nbsp;</b>{rowData.semiProductInventoryInfo.semiProductMsl}
          </div>
          <div>
            <b>Pending&nbsp;WorkOrder&nbsp;Quantity:&nbsp;</b>{rowData.semiProductInventoryInfo.pendingWorkOrderQuantity}
          </div>
          <div>&nbsp;</div>
        </div>
      ) : null
    },
    {
      title: 'Suggested Qty',
      field: 'suggestedQuantity',
      render: ((rowData: any) => (
        <div>
          <div>{rowData.suggestedQuantity}</div>
          {
            rowData.suggestedQuantity ?
              <Button type="primary" onClick={() => props.updateQuantity(rowData, false)}>
                Handle
              </Button> : null
          }
        </div>
      ))
    },
    {
      title: 'Suggested Semi Qty',
      field: 'suggestedSemiQuantity',
      render: ((rowData: any) => (
        <div>
          <div>{rowData.suggestedSemiQuantity}</div>
          {/* {
            rowData.suggestedSemiQuantity ?
              <Button type="primary" onClick={() => props.updateQuantity(rowData, true)}>
                Handle
              </Button> : null
          } */}
        </div>
      ))
    },
    {
      title: 'Low',
      field: 'low',
      defaultFilter: ['1'],
      lookup: {0: 'No', 1: 'Yes'},
    }
  ]
}

export default StockMonitorColumnModel
