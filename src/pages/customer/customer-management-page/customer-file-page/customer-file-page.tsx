import React from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../services/api/api-urls'
import CustomerFileColumnModel from './customer-file-column-model'
import { toLocalDate } from '../../../../services/lib/utils/helpers'

const CustomerFilePage = (props: { customerId: any }) => {
  const getRenderData = (data: any) => data.contract.map((row: any) => ({
    ...row,
    effDate1: toLocalDate(row.effDate),
    expDate1: toLocalDate(row.expDate),
    trialDate1: toLocalDate(row.trialDate),
  }))

  const commonTablePageProps: CommonTablePagePropsInterface = {
    getAllUrl: 'Customer/GetAttachmentByCust?customerId=' + props.customerId,
    urlInfoKey: urlKey.CustomerAttachment,
    title: 'Attachment Management',
    column: CustomerFileColumnModel(),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.customerId = props.customerId
      return dataDetail
    },
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default CustomerFilePage
