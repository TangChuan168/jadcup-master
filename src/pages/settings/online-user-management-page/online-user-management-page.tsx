import React from 'react'
import OnlineUserManagementColumnModel from './online-user-management-column-model'
import { urlKey } from '../../../services/api/api-urls'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../../services/api/api'

export const OnlineUserManagementPage = () => {
  const actionButtons: any = [
    {
      icon: 'ghost', //Button attr of Ant design (danger, ghost)
      tooltip: 'Update password',
      isFreeAction: false,
      onClick: async (event: any, rowData: any) => {
        SweetAlertService
          .inputConfirm({type: 'text', title: 'Update Password', placeholder: 'Password', defaultValue: ''})
          .then(res => {
            if (res) {
              ApiRequest({
                url: 'OnlineUser/ChangeOnlineUserPassword',
                method: 'put',
                data: {
                  userId: rowData.userId,
                  newPassword: res
                }
              })
            }
          })
      }
    }
  ]

  return (
    <CommonTablePage
      urlInfoKey={urlKey.OnlineUser}
      title="Online User Management"
      column={OnlineUserManagementColumnModel.Column}
      actionButtons={actionButtons}
    />
  )
}

export default OnlineUserManagementPage
