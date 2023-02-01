import React from 'react'
import NotificationManagementColumnModel from './notification-management-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey, urlType } from '../../../services/api/api-urls'
import { toLocalDate } from '../../../services/lib/utils/helpers'

const NotificationManagementPage = () => {
  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Notification,
    title: 'Notification Management',
    column: NotificationManagementColumnModel(),
    mappingUpdateData: (dataDetail: any, type: any) => {
      dataDetail.createrId = dataDetail.employeeId
      if (type === urlType.Create) {
        dataDetail.createdAt = (new Date()).toISOString()
      }
      dataDetail.isActive = !!dataDetail.isActive1
      if (dataDetail.startDate1 !== toLocalDate(dataDetail.startDate)) {
        dataDetail.startDate = dataDetail.startDate1
      }
      if (dataDetail.endDate1 !== toLocalDate(dataDetail.endDate)) {
        dataDetail.endDate = dataDetail.endDate1
      }
      return dataDetail
    },
    mappingRenderData: (data: any) => data.map((row: any) => {
      return {
        ...row,
        employeeId: row.createrId,
        employee: row.creater,
        startDate1: toLocalDate(row.startDate),
        endDate1: toLocalDate(row.endDate),
        isActive1: row.isActive ? 1 : 0
      }
    })
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default NotificationManagementPage

