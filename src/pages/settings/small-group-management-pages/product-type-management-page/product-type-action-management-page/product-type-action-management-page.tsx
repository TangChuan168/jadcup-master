import CommonTablePage from '../../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../../services/api/api-urls'
import ProductTypeActionManagementColumnModel from './product-type-action-management-column-model'
import React from 'react'

const ProductTypeActionManagementPage = (props: {productTypeId: any}): any => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ProductTypeAction}
      getAllUrl={'ProductTypeAction/GetActionIdByProductTypeId?productTypeId=' + props.productTypeId}
      title="Product Type Action Management"
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, productTypeId: props.productTypeId})}
      column={ProductTypeActionManagementColumnModel.Column}
    />
  )
}

export default ProductTypeActionManagementPage
