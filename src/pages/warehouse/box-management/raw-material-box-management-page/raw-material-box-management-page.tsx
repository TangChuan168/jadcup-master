import React,{useEffect} from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import RawMaterialBoxManagementColumnModel from './raw-material-box-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const RawMaterialBoxManagementPage = (): any => {
  useEffect(() => {
    document.title = "Raw Material Boxes Management";
   }, [])
  return (
    <CommonTablePage
      urlInfoKey={urlKey.RawMaterialBox}
      title="Obsolete Raw Material Box"
      isNotAddable={true}
      isNotEditable={true}
      mappingRenderData={(data: any) => data.filter((row: any) => row.active).map((row: any) => ({...row, ...row.rawMaterial}))}
      column={RawMaterialBoxManagementColumnModel.Column}
    />
  )
}

export default RawMaterialBoxManagementPage
