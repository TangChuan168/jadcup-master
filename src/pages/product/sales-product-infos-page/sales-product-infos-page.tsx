import React,{useEffect} from 'react'
import SalesProductInfosColumnModel from './sales-product-infos-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'

const SalesProductInfosPage: any = () => {

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.BaseProduct,
    getAllUrl: 'Quotation/GetQuoteProductPrice',
    title: 'Product Price List',
    column: SalesProductInfosColumnModel(),
    isNotEditable: true,
    isNotDeletable: true,
    isNotAddable: true
  }
  useEffect(() => {
    document.title = "Products List";
   }, [])

  return (
    <>
      <CommonTablePage
        {...commonTablePageProps}
      />
    </>
  )
}

export default SalesProductInfosPage
