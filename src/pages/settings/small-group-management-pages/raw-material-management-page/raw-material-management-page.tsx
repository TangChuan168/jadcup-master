import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import RawMaterialManagementColumnModel from './raw-material-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'
import './rm.css'
import { concat } from 'lodash'


const RawMaterialManagementPage = (): any => {
//   const getRenderData = (data: any) => {
//     data.map((e:any)=>{
//       console.log(e);
//       let supllierInfo=''
//       // e.supllierInfo = 
      
//       e.suplierRawMaterial.map((ele:any)=>{
//         console.log(ele)
//         supllierInfo = supllierInfo +ele.suplierProductCode+','+ele.unitPrice+"<br>"
//       })
//       e.supllierInfo  = supllierInfo;
//     })
//     return data; 
//   }
  
  return (
    <div className="rm">
    <CommonTablePage
      urlInfoKey={urlKey.RawMaterial}
      title="Raw Material Management"
      column={RawMaterialManagementColumnModel.RawMaterialManagementColumn}
      // mappingRenderData={(data: any) => getRenderData(data)}
    />
    </div>
  )
}

export default RawMaterialManagementPage
