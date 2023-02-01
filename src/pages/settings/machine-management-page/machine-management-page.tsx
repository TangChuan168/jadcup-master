import React, { useState } from 'react'
import MachineManagementColumnModel from './machine-management-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey, urlType } from '../../../services/api/api-urls'
import { ApiRequest } from '../../../services/api/api'

const MachineManagementPage = () => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)

  const commonTablePageProps: CommonTablePagePropsInterface = {
    triggerResetData: triggerResetData,
    urlInfoKey: urlKey.Machine,
    title: 'Machine Management',
    column: MachineManagementColumnModel(),
    mappingUpdateData: (dataDetail: any, type: any) => {
      if (dataDetail.picture) {
        dataDetail.picture = JSON.parse(dataDetail.picture).url
      }
      dataDetail.sortingOrder = parseInt(dataDetail.sortingOrder, 10)
      if (type === urlType.Update) {
        ApiRequest({
          urlInfoKey: urlKey.Machine,
          type: urlType.Update,
          data: dataDetail
        }).then(_ => {
          setTriggerResetData(!triggerResetData)
        })
        return 'resolve'
      }
      return dataDetail
    },
    mappingRenderData: (data: any) => data.map((row: any) => {
      // setTriggerResetData(!triggerResetData)
      console.log(row)
      return {
        ...row,
        picture: '{"uid":1,"name":"img","url":"' + row.picture + '"}'
      }
    })
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default MachineManagementPage

