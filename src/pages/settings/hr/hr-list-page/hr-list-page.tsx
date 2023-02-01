import React, { useState } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../services/api/api-urls'
import HrListColumnModel from './hr-list-column-model'
import HRAttachedPage from '../hr-attached-page/hr-attached-page'
import CommonDialog from '../../../../components/common/others/common-dialog'
import HRContractsPage from '../hr-contracts-page/hr-contracts-page'
import { toLocalDate } from '../../../../services/lib/utils/helpers'
import { getSelectOptions } from '../../../../components/common/common-form/common-form-select'

const HrListPage = (): any => {
  const [open, setOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState<any>()
  const [dialogTitle, setDialogTitle] = useState<any>()

  const HRAttachedDialog = (resouceId: any) => <HRAttachedPage resouceId={resouceId} />
  const HRContractsDialog = (resouceId: any) => <HRContractsPage resouceId={resouceId} />

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add Attachment',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(HRAttachedDialog, rowData)
      }
    },
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Add Contract',
      isFreeAction: false,
      onClick: (event: any, rowData: any) => {
        openDialog(HRContractsDialog, rowData)
      }
    },
  ]

  const openDialog = (dialogFn: any, rowData: any) => {
    setDialogContent(dialogFn(rowData.resouceId))
    setDialogTitle(rowData.firstName + rowData.lastName)
    setOpen(true)
  }

  return (
    <div>
      <CommonTablePage
        urlInfoKey={ urlKey.HumanResource }
        title="HR's List"
        column={ HrListColumnModel() }
        mappingRenderData={async (data: any) => {
          const roles = await getSelectOptions(urlKey.Role)
          const newData: any = data.map((item: any) => ({
            ...item,
            entryDate1: toLocalDate(item.entryDate),
            dob1: toLocalDate(item.dob),
            roleName: roles.filter((row: any) => row.roleId === item.role)[0]?.roleName,
            roleId: item.role,
            birthdayDue: item.birthdayDue ? 1 : 0,
            contractDue: item.contractDue ? 1 : 0,
          })) || []
          return newData
        }}
        mappingUpdateData={ (dataDetail: any) => {
          dataDetail.role = dataDetail.roleId
          if (dataDetail.entryDate1 !== toLocalDate(dataDetail.entryDate)) {
            dataDetail.entryDate = dataDetail.entryDate1
          }
          if (dataDetail.dob1 !== toLocalDate(dataDetail.dob)) {
            dataDetail.dob = dataDetail.dob1
          }
          return dataDetail
        }}
        actionButtons={actionButtons}
      />
      <CommonDialog open={open} title={dialogTitle} onDialogClose={() => setOpen(false)} dialogContent={dialogContent} />
    </div>
  )
}

export default HrListPage
