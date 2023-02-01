import React from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../services/api/api-urls'
import HRAttachedColumnModel from './hr-attached-column-model'

const HRAttachedPage = (props: {resouceId: any}) => {
  const commonTablePageProps: CommonTablePagePropsInterface = {
    getAllUrl: 'HumanResource/GetHumanResourceById?id=' + props.resouceId,
    mappingRenderData: (data: any) => data.attachedRecord,
    urlInfoKey: urlKey.AttachedRecord,
    title: 'HR Attached Record',
    column: HRAttachedColumnModel(),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.resouceId = props.resouceId
      // dataDetail.recordType = parseInt(dataDetail.recordTypeId, 10)
      return dataDetail
    },
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default HRAttachedPage

