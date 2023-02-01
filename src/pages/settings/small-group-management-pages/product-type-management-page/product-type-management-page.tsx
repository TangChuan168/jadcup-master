import React, { useState } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import ProductTypeManagementColumnModel from './product-type-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'
import CommonDialog from '../../../../components/common/others/common-dialog'
import ProductTypeActionManagementPage from './product-type-action-management-page/product-type-action-management-page'

const ProductTypeManagementPage = (): any => {
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>()

  return (
    <div>
      <CommonTablePage
        urlInfoKey={urlKey.ProductType}
        title="Product Type Management"
        column={ProductTypeManagementColumnModel.ProductTypeManagementColumn}
        actionButtons={[
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: 'Action Edit',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              setSelectedRow(rowData)
              setOpen(true)
            }
          }
        ]}
      />
      <CommonDialog
        open={open}
        title={'Product Type Action Management'}
        onDialogClose={() => setOpen(false)}
        dialogContent={<ProductTypeActionManagementPage productTypeId={selectedRow?.productTypeId} />}
      />
    </div>
  )
}

export default ProductTypeManagementPage
