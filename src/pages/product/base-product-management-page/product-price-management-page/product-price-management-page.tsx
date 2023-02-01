import ProductPriceManagementColumnModel from './product-price-management-column-model'
import React, { useState } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../../services/api/api-urls'
import { ApiRequest } from '../../../../services/api/api'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'

const ProductPriceManagementPage = (props: {baseProductId: any}): any => {
  const [data, setData] = useState<any>()
  return (
    <CommonTablePage
      urlInfoKey={urlKey.ProductPrice}
      getAllUrl={'ProductPrice/GetProductPriceByProduct?baseProductId=' + props.baseProductId}
      title="Product Price Management"
      mappingUpdateData={(dataDetail: any) => ({...dataDetail, baseProductId: props.baseProductId})}
      mappingRenderData={(data: any) => {
        setData(data.map((row: any) => ({...row, groupName: row.group1?.group1Name})).filter((item: any) => item.group1 === null)[0])
        return data.map((row: any) => ({...row, groupName: row.group1?.group1Name}))
      }}
      column={ProductPriceManagementColumnModel.Column}
      actionButtons={[
        {
          icon: 'danger', //Button attr of Ant design (danger, ghost)
          tooltip: 'Generate Quotation',
          isFreeAction: true,
          onClick: async (event: any, rowData: any) => {

            if (!data || !data.productPriceId){
              // console.log(data.productPriceId)              
              await SweetAlertService.errorMessage("Please set the price for all customer group!")
              return
            }
          
            // call generate quotation api here
            const result =await SweetAlertService.confirmMessage("Are you sure, this will generate draft quotations of this product for all customers? ")
            if (result){
              ApiRequest({url: 'ProductPrice/GenerateQuotaByProductPrice?id=' + data.productPriceId, method: 'put'})
              .then((res: any) => {
                console.log(res)
              })
            }
          }
        },
      ]}
    />
  )
}

export default ProductPriceManagementPage
