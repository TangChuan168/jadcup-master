import React, {useEffect, useState} from 'react'
import {DeleteDailyReportRequest, getAllDailyReportByDateRequest} from '../../../services/others/daily-report-service'
import {getCurrentDateString} from '../../../services/lib/utils/helpers'
import CommonTable from '../../../components/common/common-table/common-table'
import {Button, Space} from 'antd'

const DailyReportRecord:React.FC = () => {
  const tableColumn = [
    // { title: 'Report Id', field: 'reportId' },
    { title: 'Machine', field: 'machine.machineName' },
    { title: 'User', field: 'employee.firstName'},
    { title: 'Report Date', field: 'reportDate', type: 'date' },
    { title: 'Loss', field: 'loss' },
    { title: 'Reason', field: 'reason' },
    { title: 'Actions', field: 'actions',
      render: (rowData: any) => {
        // console.log(rowData)
        return (
          <Space>
            <Button type="primary" onClick={() => onClickHandler(rowData)}>Detail</Button>
            <Button type="primary" danger onClick={() => reportDeleteHandler(rowData.reportId)}>Delete</Button>
          </Space>
        )
      }},
  ]

  const [dataInTable, setDataInTable] = useState<any>([])

  useEffect(() => {
    getAllDailyReportByDateRequest(getCurrentDateString())
      .then(res => {
        // console.log(res.data.data)
        setDataInTable(res.data.data)
      })
  }, [])

  const onClickHandler = (data:any) => {
    console.log(data)
    console.log(dataInTable)

  }

  const reportDeleteHandler = (reportId:string) => {
    console.log(reportId)
    DeleteDailyReportRequest(reportId)
      .then(res => {
        console.log(res.data.data)
        getAllDailyReportByDateRequest(getCurrentDateString())
          .then(res => {
            // console.log(res.data.data)
            setDataInTable(res.data.data)
          })
      })
  }
  return (
    <div>
      <CommonTable title={'Daily Report in Half Year'} column={tableColumn} initData={dataInTable}/>
    </div>
  )
}

export default DailyReportRecord
