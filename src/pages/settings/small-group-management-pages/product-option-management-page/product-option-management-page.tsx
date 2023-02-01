import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import ProductOptionManagementColumnModel from './product-option-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

const ProductOptionManagementPage = (): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ProductOption}
      title="Product Option Management"
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, price: parseInt(dataDetail.price, 10)})}
      column={ProductOptionManagementColumnModel.Column}
    />
  )
}

export default ProductOptionManagementPage
