import React from 'react'
import SupplierQualificationManagementColumnModel from './supplier-qualification-management-column-model'
import CommonTablePage from '../../../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../../../services/api/api-urls'

const SupplierQualificationManagementTable = (props: {supplierId: any}): any => {
  const dateConvert = (date: any) => {
    return date && (new Date(date + '.000Z')).toDateString()
  }

  return (
    <CommonTablePage
      urlInfoKey={ urlKey.SupplierQualification }
      getAllUrl={'Supplier/GetSupplierById?id=' + props.supplierId}
      restRequestOptions={{
        getAllUrl: 'Supplier/GetSupplierById?id=' + props.supplierId
      }}
      title="Qualification Management"
      column={ SupplierQualificationManagementColumnModel() }
      mappingRenderData={(data: any) => {
        console.log(data)
        return data.qualification?.map((item: any) => ({...item, expDate1: dateConvert(item.expDate)})) || []
      }}
      mappingUpdateData={ (dataDetail: any) => {
        console.log(dataDetail)
        const newData = {...dataDetail, suplierId: props.supplierId}
        if (!newData.qualificationName) {
          newData.qualificationName = JSON.parse(newData.qualificationUrls.split('---')[0]).name
        }
        if (newData.expDate1 !== dateConvert(newData.expDate)) {
          newData.expDate = newData.expDate1
        }
        return newData.qualificationId ? newData : [newData]
      } }
    />
  )
}

export default SupplierQualificationManagementTable
