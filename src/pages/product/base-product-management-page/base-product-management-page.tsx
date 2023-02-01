import React, { useState } from 'react'
import BaseProductManagementColumnModel from './base-product-management-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import CommonDialog from '../../../components/common/others/common-dialog'
import MachineActionManagementPage from './machine-action-management-page/machine-action-management-page'
import { getSelectOptions } from '../../../components/common/common-form/common-form-select'
import ProductPriceManagementPage from './product-price-management-page/product-price-management-page'
import { getRandomKey } from '../../../services/lib/utils/helpers'
import AddOutsourceProductDialog from '../product-management-page/add-outsource-product-dialog'

const BaseProduct: any = () => {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [selectedRow, setSelectedRow] = useState<any>()
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open3, setOpen3] = useState(false) // Dialog

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.BaseProduct,
    title: 'Base Product',
    column: BaseProductManagementColumnModel(),
  }

  const onDialogClose = (isModified: boolean, response?: any) => {
    setOpen3(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
      if (response) {
        setSelectedRow({baseProductId: response.data.data})
        setOpen2(true)
      }
    }
  }

  return (
    <>
      <CommonTablePage
        {...commonTablePageProps}
        mappingRenderData={async (data: any) => {
          const rawMaterialData = await getSelectOptions(urlKey.RawMaterial)
          return data.map((row: any) => ({...row, rawMaterial2: rawMaterialData.filter((item: any) => item.rawMaterialId === row.rawMaterialId2)[0]}))
        }}
        mappingUpdateData={ (dataDetail: any) => ({
          ...dataDetail,
          manufactured: parseInt(dataDetail.manufactured, 10),
          visible: parseInt(dataDetail.visible, 10),
        }) }
        triggerResetData={triggerResetData}
        actionButtons={[
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: 'Machine Action Edit',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              setSelectedRow(rowData)
              setOpen(true)
            }
          },
          // {
          //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
          //   tooltip: 'Add outsource product',
          //   isFreeAction: true,
          //   onClick: (event: any, rowData: any) => {
          //     setOpen3(true)
          //   }
          // },
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: 'Price Edit',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              setSelectedRow(rowData)
              setOpen2(true)
            }
          }
        ]}
      />
      <CommonDialog
        open={open}
        title={'Machine Action Management - ' + selectedRow?.baseProductName}
        onDialogClose={() => setOpen(false)}
        dialogContent={<MachineActionManagementPage baseProductId={selectedRow?.baseProductId} />}
      />
      <CommonDialog
        open={open2}
        title={'Product Price Management--' + selectedRow?.baseProductName}
        onDialogClose={() => setOpen2(false)}
        dialogContent={<ProductPriceManagementPage baseProductId={selectedRow?.baseProductId} />}
      />
      {/* <CommonDialog
        title={'Add Outsource Product'}
        open={open3}
        onDialogClose={onDialogClose}
        dialogContent={<AddOutsourceProductDialog onDialogClose={onDialogClose}/>}
      /> */}
    </>
  )
}

export default BaseProduct
