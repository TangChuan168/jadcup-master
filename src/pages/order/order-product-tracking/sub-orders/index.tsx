import React, {useEffect, useState} from 'react'
import CommonTable from '../../../../components/common/common-table/common-table'
import {Button} from 'antd'
import {subOrder} from '../../../../mock/subOrderMock'

const SubOrder = () => {
  const [data, setData] = useState<any>()

  useEffect(() => {
    //prop传进来接收id，call api 再去分配
    setData(subOrder())
  }, [])
  const tableColumn = [
    { title: 'Job Type', field: 'jobType' },
    { title: 'Original Qty', field: 'originalQty' },
    { title: 'Actual Qty', field: 'actualQty'},
    { title: 'Material', field: 'material' },
    { title: 'Operator Date', field: 'operatorDate', type: 'date' },
    { title: 'Worker', field: 'work' },
    { title: 'Actions', field: 'actions',
      render: (rowData: any) => {
        // console.log(rowData)
        return (
          <div>
            <Button type="primary" >Detail</Button>
          </div>
        )
      }},
  ]
  return (
    <div>
      <CommonTable title={'SubOrder'} column={tableColumn} initData={data}/>
    </div>
  )
}

export default SubOrder
