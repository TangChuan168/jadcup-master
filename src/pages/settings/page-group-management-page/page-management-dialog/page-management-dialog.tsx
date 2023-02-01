import React from 'react'
import PageManagementDialogColumnModel from './page-management-dialog-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../../components/common/common-table/common-table-page'
import { allUrls, urlKey } from '../../../../services/api/api-urls'

const PageManagementDialog: React.FC<{groupId: any}> = (props: any) => {
  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.Page,
    title: 'Page Management',
    column: PageManagementDialogColumnModel.PageManagementDialogColumn,
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.sortingOrder = parseInt(dataDetail.sortingOrder, 10)
      dataDetail.groupId = props.groupId
      return dataDetail
    },
    restRequestOptions: {
      getAllUrl: allUrls[urlKey.Page].get + '?id=' + props.groupId
    }
  }

  return (
    <div style={{width: '97%', margin: '0 auto 1rem'}}>
      <CommonTablePage {...commonTablePageProps} />
    </div>
  )
}

export default PageManagementDialog
