import React, {useEffect, useState} from 'react'
import CommonTable from '../../../components/common/common-table/common-table'
import {Button, Space} from 'antd'
import { ApiRequest } from '../../../services/api/api'

const PalletList:React.FC = () => {
  const tableColumn = [
    // { title: 'Report Id', field: 'reportId' },
    { title: 'Pallet', field: 'plateCode' },
    { title: 'Notes',  field: 'plateCodeWithNote' },
    { title: 'Postion',field: 'position' },
  ]

  const [dataInTable, setDataInTable] = useState<any>([])
  // useEffect(() => {
  //   document.title = "Raw Material Boxes Management";
  //  }, [])
  useEffect(() => {
    document.title = "Pallet List";
    ApiRequest({
        url: 'Plate/GetUsing2PackagingPallet',
        method: 'get',
        isShowSpinner: true
      }).then((res: any) => {
        setDataInTable(res.data.data)
      })
  }, [])



 
  return (
    <div>
      <CommonTable title={'Pallets List'} column={tableColumn} initData={dataInTable}/>
    </div>
  )
}

export default PalletList
