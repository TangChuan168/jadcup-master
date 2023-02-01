import MachineActionManagementColumnModel from './machine-action-management-column-model'
import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../services/api/api-urls'

const MachineActionManagementPage = (props: {baseProductId: any}): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ProductMachineMapping}
      getAllUrl={'ProductMachineMapping/GetAllProductMachineMapping?baseProductId=' + props.baseProductId}
      title="Machine Action Management"
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, baseProductId: props.baseProductId})}
      column={MachineActionManagementColumnModel.Column}
    />
  )
}

export default MachineActionManagementPage
