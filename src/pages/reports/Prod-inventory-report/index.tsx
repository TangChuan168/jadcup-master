import React, {useEffect, useState} from 'react'
import { ApiRequest } from '../../../services/api/api'
import CommonTable from '../../../components/common/common-table/common-table'
import {Button, Space} from 'antd'

const ProdInventoryReport:React.FC = () => {
  const tableColumn = [
    // { title: 'Report Id', field: 'reportId' },
    { title: 'Product', field: 'productName' },
    { title: 'Pcs in Stock ', field: 'productInStock'},
    { title: 'Cartons in Stock ', field: 'cartonStock'},
    { title: 'Unit Price', field: 'unitPrice',render: (rowData: any) => rowData.unitPrice.toFixed(2)},
    { title: 'Value in Stock', field: 'price',render: (rowData: any) => rowData.price.toFixed(2)},
  ]

  const [dataInTable, setDataInTable] = useState<any>([])

  useEffect(() => {
    document.title="Inventory"
}, [])
  useEffect(() => {
      ApiRequest({
        url: 'StockMonitor/GetStockPrice',
        method: 'get',
        isShowSpinner: true
      })
      .then(res => {
        setDataInTable(res.data.data)
      })
  }, [])

 
  return (
    <div>
      <CommonTable title={'Inventory List'} column={tableColumn} initData={dataInTable} 
      isExportable={true} defaultPageSizeOptions={[2000, 10000]}  defaultPageSize={2000}/>
    </div>
  )
}

export default ProdInventoryReport
