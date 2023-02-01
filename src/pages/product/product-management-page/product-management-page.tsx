import React, { useState,useEffect } from 'react'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import ProductManagementColumnModel from './product-management-column-model'
import { getRandomKey, nsStr } from '../../../services/lib/utils/helpers'
import CommonDialog from '../../../components/common/others/common-dialog'
import AddOutsourceProductDialog from './add-outsource-product-dialog'
import { getCookie } from 'react-use-cookie'

const ProductManagementPage = (props: {customerId: any}): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open, setOpen] = useState(false) // Dialog

  const onDialogClose = (isModified: boolean) => {
    setOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }
  useEffect(() => {
    document.title = "Product Management";
   }, [])

  return (
    <>
      <CommonTablePage
        urlInfoKey={ urlKey.Product }
        getAllUrl={'Product/GetAllProduct?withOutStock=true'}
        title="Products"
        triggerResetData={triggerResetData}
        actionButtons={[
          // {
          //   icon: 'ghost', //Button attr of Ant design (danger, ghost)
          //   tooltip: 'Add Outsource Product',
          //   isFreeAction: true,
          //   onClick: (event: any, rowData: any) => {
          //     setOpen(true)
          //   }
          // }
        ]}
        column={ ProductManagementColumnModel() }
        mappingRenderData={(data: any) => {
          const newData = data.map((row: any) => ({
            ...row,
            marginOfError: row.marginOfError?.toString(),
            productInfo: (
              row.productName +
              row.customer?.company +
              row.customer?.customerCode +
              row.baseProduct?.baseProductName +
              nsStr(
                row.productName +
                row.customer?.company +
                row.customer?.customerCode +
                row.baseProduct?.baseProductName
              )
            )
          }))
          if (props.customerId) {
            return newData.filter((row: any) => row.customerId === props.customerId)
          }
          return newData
        }}
        mappingUpdateData={ (dataDetail: any) => ({
          ...dataDetail,
          plain: dataDetail.plain && parseInt(dataDetail.plain, 10),
          logoType: dataDetail.logoType && parseInt(dataDetail.logoType, 10),
          marginOfError: parseInt(dataDetail.marginOfError, 10) || 100,
          employeeId : getCookie('customerUserId')?0:parseInt(getCookie('id'))
        }) }
      />
      {/* <CommonDialog
        title={'Add Outsource Product'}
        open={open}
        onDialogClose={onDialogClose}
        dialogContent={<AddOutsourceProductDialog onDialogClose={onDialogClose}/>}
      /> */}
    </>
  )
}

export default ProductManagementPage
