import React, { useState } from 'react'
import CommonTablePage from '../../../../../components/common/common-table/common-table-page'
import RawMaterialApplicationDetailsManagementColumnModel from './raw-material-application-details-management-column-model'
import { urlKey } from '../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../services/api/api'

const RawMaterialApplicationDetailsManagementPage = (): any => {
  const [triggerResetData, setTriggerResetData] = useState(false)

  return (
    <CommonTablePage
      urlInfoKey={urlKey.ApplicationDetails}
      title="Application Details"
      actionButtons={[
        {
          icon: '', //Button attr of Ant design (danger, ghost)
          tooltip: 'Change Run Out',
          isFreeAction: false,
          onClick: (event: any, rowData: any) => {
            ApiRequest({
              url: 'ApplicationDetails/MarkAsRunout?id=' + rowData.detailsId + '&runout=' + (rowData.runout ? 0 : 1),
              method: 'put'
            }).then(_ => {
              setTriggerResetData(!triggerResetData)
            })
          }
        }
      ]}
      isNotAddable={true}
      triggerResetData={triggerResetData}
      isNotEditable={true}
      isNotDeletable={true}
      mappingRenderData={(data: any) => data.map((row: any) => ({...row, ...row.rawMaterialBox, ...row.rawMaterialBox?.rawMaterial}))}
      column={RawMaterialApplicationDetailsManagementColumnModel.Column}
    />
  )
}

export default RawMaterialApplicationDetailsManagementPage
