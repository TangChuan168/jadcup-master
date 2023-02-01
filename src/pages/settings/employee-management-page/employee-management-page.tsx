import React, { useState } from 'react'
import EmployeeManagementColumnModel from './employee-management-column-model'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../../services/api/api'

const EmployeeManagementPage = (): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)

  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Reset password',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        const result = await SweetAlertService.confirmMessage('Reset to 000000')
        if (result) {
          ApiRequest({
            url: 'Employee/ResetPassword?employeeId=' + rowData.employeeId + '&newPassword=000000',
            method: 'put'
          }).then(_ => {
            setTriggerResetData(!triggerResetData)
          })
        }
      }
    }
  ]

  return (
    <CommonTablePage
      urlInfoKey={ urlKey.Employee }
      title="Employee Management"
      actionButtons={actionButtons}
      column={ EmployeeManagementColumnModel() }
      mappingUpdateData={ (dataDetail: any) => {
        return {...dataDetail, isSales: parseInt(dataDetail.isSales, 10)}
      } }
    />
  )
}

export default EmployeeManagementPage
