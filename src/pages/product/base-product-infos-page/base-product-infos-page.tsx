import React,{useEffect} from 'react'
import BaseProductInfosColumnModel from './base-product-infos-column-model'
import CommonTablePage, { CommonTablePagePropsInterface } from '../../../components/common/common-table/common-table-page'
import { urlKey } from '../../../services/api/api-urls'

const BaseProductInfosPage: any = (props: any) => {

  const commonTablePageProps: CommonTablePagePropsInterface = {
    urlInfoKey: urlKey.BaseProduct,
    getAllUrl: 'ProductForShowing/GetAllShowingProducts',
    title: props.title || 'Base Product Info',
    column: BaseProductInfosColumnModel(),
    isNotEditable: true,
    isNotDeletable: true,
    isNotAddable: true
  }
  useEffect(() => {   
    document.title="Base Product"
  }, [])
  return (
    <>
      <CommonTablePage
        {...commonTablePageProps}
      />
    </>
  )
}

export default BaseProductInfosPage
