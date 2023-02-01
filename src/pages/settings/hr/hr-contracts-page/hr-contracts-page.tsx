import React from 'react'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../services/api/api-urls'
import HRContractsColumnModel from './hr-contracts-column-model'
import { toLocalDate } from '../../../../services/lib/utils/helpers'

const HRContractsPage = (props: { resouceId: any }) => {
  const getRenderData = (data: any) => data.contract.map((row: any) => ({
    ...row,
    effDate1: toLocalDate(row.effDate),
    expDate1: toLocalDate(row.expDate),
    trialDate1: toLocalDate(row.trialDate),
  }))

  const commonTablePageProps: CommonTablePagePropsInterface = {
    getAllUrl: 'HumanResource/GetHumanResourceById?id=' + props.resouceId,
    urlInfoKey: urlKey.Contract,
    title: 'HR Contracts Management',
    column: HRContractsColumnModel(),
    mappingRenderData: (data: any) => getRenderData(data),
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.resouceId = props.resouceId
      // dataDetail.contractType = parseInt(dataDetail.contractTypeId, 10)
      // delete dataDetail.contractType // TODO: contractType table
      if (dataDetail.effDate1 !== toLocalDate(dataDetail.effDate)) {
        dataDetail.effDate = dataDetail.effDate1
      }
      if (dataDetail.expDate1 !== toLocalDate(dataDetail.expDate)) {
        dataDetail.expDate = dataDetail.expDate1
      }
      if (dataDetail.trialDate1 !== toLocalDate(dataDetail.trialDate)) {
        dataDetail.trialDate = dataDetail.trialDate1
      }
      return dataDetail
    },
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default HRContractsPage
