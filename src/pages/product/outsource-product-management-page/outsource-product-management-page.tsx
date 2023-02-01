import React, { useState, useEffect } from 'react'
import CommonTablePage from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'
import ProductManagementColumnModel, { OutsourceProductManagementColumnModel } from '../product-management-page/product-management-column-model'
import { getRandomKey, nsStr } from '../../../services/lib/utils/helpers'
import CommonDialog from '../../../components/common/others/common-dialog'
import AddOutsourceProductDialog from '../product-management-page/add-outsource-product-dialog'
import { getCookie } from 'react-use-cookie'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { ApiRequest } from '../../../services/api/api'

const OutsourceProductManagementPage = (props: {customerId: any}): any => {
  const [triggerResetData, setTriggerResetData] = useState<any>(false)
  const [open, setOpen] = useState(false) // Dialog
  const [currentProduct, setCurrentProduct] = useState<any>()

  const onDialogClose = (isModified: boolean) => {
    setOpen(false)
    if (isModified) {
      setTriggerResetData(getRandomKey())
    }
  }
  useEffect(() => {
    document.title = 'Outsource Product Management'
  }, [])

  return (
    <>
      <CommonTablePage
        urlInfoKey={ urlKey.Product }
        getAllUrl={'Product/GetOutsourceProduct'}
        title="Outsource Products"
        triggerResetData={triggerResetData}
        actionButtons={[
          {
            icon: 'ghost', //Button attr of Ant design (danger, ghost)
            tooltip: 'Add Outsource Product',
            isFreeAction: true,
            onClick: (event: any, rowData: any) => {
              setCurrentProduct(null)
              setOpen(true)
            }
          },
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: 'Edit',
            isFreeAction: false,
            onClick: (event: any, rowData: any) => {
              setCurrentProduct(rowData)
              setOpen(true)
            }
          },
          {
            icon: '', //Button attr of Ant design (danger, ghost)
            tooltip: 'Delete',
            isFreeAction: false,
            onClick: async (event: any, rowData: any) => {
              const result = await SweetAlertService.confirmMessage('Are you sure you want to delete this product? This is Irreversible.')
              if (result) {
                console.log('delete')
                console.log(rowData)
                ApiRequest({url: 'Product/DeleteOutSourceProduct?id=' + rowData.productId, method: 'delete'})
                .then((res: any) => {
                  SweetAlertService.successMessage()
                  setTriggerResetData(getRandomKey())
                })
              }
            }
          }
        ]}
        column={ OutsourceProductManagementColumnModel() }
        mappingRenderData={(data: any) => {
          // const newData = data.map((row: any) => ({
          //   ...row,
          //   marginOfError: row.marginOfError?.toString(),
          //   productInfo: (
          //     row.productName +
          //     row.customer?.company +
          //     row.customer?.customerCode +
          //     row.baseProduct?.baseProductName +
          //     nsStr(
          //       row.productName +
          //       row.customer?.company +
          //       row.customer?.customerCode +
          //       row.baseProduct?.baseProductName
          //     )
          //   )
          // }))
          if (props.customerId) {
            return data.filter((row: any) => row.customerId === props.customerId)
          }
          console.log(data)
          return data
        }}
        mappingUpdateData={ (dataDetail: any) => ({
          ...dataDetail,
          plain: dataDetail.plain && parseInt(dataDetail.plain, 10),
          logoType: dataDetail.logoType && parseInt(dataDetail.logoType, 10),
          marginOfError: parseInt(dataDetail.marginOfError, 10) || 100,
          employeeId: getCookie('customerUserId') ? 0 : parseInt(getCookie('id'))
        }) }
        isNotAddable={true}
        isNotEditable={true}
        isNotDeletable={true}
      />
      <CommonDialog
        title={'Add Outsource Product'}
        open={open}
        onDialogClose={onDialogClose}
        dialogContent={<AddOutsourceProductDialog onDialogClose={onDialogClose} product={currentProduct}/>}
      />
    </>
  )
}

export default OutsourceProductManagementPage
