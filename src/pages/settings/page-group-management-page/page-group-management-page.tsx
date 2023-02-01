import React, { useState } from 'react'
import PageGroupManagementColumnModel from './page-group-management-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import PageManagementDialog from './page-management-dialog/page-management-dialog'
import { urlKey } from '../../../services/api/api-urls'
import CommonDialog from '../../../components/common/others/common-dialog'

const PageGroupManagementPage: React.FC = () => {
  const [triggerResetData, setTriggerResetData] = useState(false)
  const [open, setOpen] = useState(false)
  const [groupId, setGroupId] = useState()
  const [pageName, setPageName] = useState('')
  const pageManagementDialog = <PageManagementDialog groupId={groupId} />

  const onDialogClose = () => {
    setOpen(false)
    setTriggerResetData(!triggerResetData)
  }

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Modify Pages',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        setOpen(true)
        setGroupId(rowData.groupId)
        setPageName(rowData.groupName)
      }
    }
  ]

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.PageGroup,
    title: 'Page Group Management',
    column: PageGroupManagementColumnModel.PageManagementColumn,
    mappingUpdateData: (dataDetail: any) => {
      dataDetail.sortingOrder = parseInt(dataDetail.sortingOrder, 10)
      return dataDetail
    },
    triggerResetData: triggerResetData,
    actionButtons: actionButtons
  }

  return (
    <div>
      <CommonTablePage {...commonTablePageProps} />
      <CommonDialog title={'Page Management --- ' + pageName} open={open} onDialogClose={onDialogClose} dialogContent={pageManagementDialog} />
    </div>
  )
}

export default PageGroupManagementPage
