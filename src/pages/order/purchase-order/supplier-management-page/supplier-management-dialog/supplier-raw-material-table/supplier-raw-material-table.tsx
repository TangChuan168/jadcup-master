import React, { useState } from 'react'
import SupplierRawMaterialColumnModel from './supplier-raw-material-column-model'
import CommonTablePage from '../../../../../../components/common/common-table/common-table-page'
import { urlType } from '../../../../../../services/api/api-urls'
import { ApiRequest } from '../../../../../../services/api/api'
import { getRandomKey } from '../../../../../../services/lib/utils/helpers'

const SupplierRawMaterialTable = (props: {supplierId: any}): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)

  const tableProps = () => ({
    urlInfoKey: '',
    title: 'Product Management',
    column: SupplierRawMaterialColumnModel(),
    getAllUrl: 'SupplierRawMaterial/GetRawMaterialDtoBySupplierId?supplierId=' + props.supplierId,
    // isNotEditable: true,
    triggerResetData: triggerResetData,
    mappingUpdateData: async (dataDetail: any, type: any) => {
      if (type === urlType.Delete) {
        await ApiRequest({
          url: 'SupplierRawMaterial/DeleteSupplierRawMaterial',
          method: 'delete',
          data: {
            suplierId: props.supplierId,
            rawMaterialId: dataDetail.rawMaterialId
          }
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
      }
      if (type === urlType.Create) {
        await ApiRequest({
          url: 'SupplierRawMaterial/AddSupplierRawMaterial',
          method: 'post',
          data: {
            suplierId: props.supplierId,
            rawMaterialId: dataDetail.rawMaterialId,
            suplierProductCode:dataDetail.suplierProductCode,
            description:dataDetail.description,
            unitPrice:Number(dataDetail.unitPrice),
            priceBreak:dataDetail.priceBreak,
            unit:dataDetail.unit,

          }
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
      }
      if (type === urlType.Update) {
        await ApiRequest({
          url: 'SupplierRawMaterial/UpdateSupplierRawMaterial',
          method: 'put',
          data: {
            suplierId: props.supplierId,
            rawMaterialId: dataDetail.rawMaterialId,
            suplierProductCode:dataDetail.suplierProductCode,
            description:dataDetail.description,
            unitPrice:Number(dataDetail.unitPrice),
            priceBreak:dataDetail.priceBreak,
            unit:dataDetail.unit,
            suplierRawMaterialId:dataDetail.suplierRawMaterialId            
          }
        }).then(_ => {
          setTriggerResetData(getRandomKey())
        })
      }      
      return 'resolve'
    },
  })

  return (
    <CommonTablePage {...tableProps()} />
  )
}

export default SupplierRawMaterialTable
