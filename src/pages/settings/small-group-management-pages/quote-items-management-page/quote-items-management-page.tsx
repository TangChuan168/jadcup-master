import React from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import QuoteItemsManagementColumnModel from './quote-items-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'

export const QuoteItemsManagementPage = () => {
  return (
    <CommonTablePage
      urlInfoKey={urlKey.QuotationOptionItem}
      title="Quote Items Management"
      column={QuoteItemsManagementColumnModel.Column}
    />
  )
}

export default QuoteItemsManagementPage
