import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, nbsStr } from '../../../services/lib/utils/helpers'
import React from 'react'

export const colKey: any = {
  customerId:urlKey.Customer,
  customerGroup1: urlKey.CustomerGroup1,
  // customerGroup1: urlKey.CustomerGroup1,
  productId:urlKey.Product,
  baseProductId: urlKey.BaseProduct,
  price: 'price',
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.customerId, label: '', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup1Id, label: '', otherOptions: {type: 'select'}},
    {key: colKey.productId, label: '', otherOptions: {type: 'select'}},
    // {key: colKey.productCode, label: '', otherOptions: {type: 'select'}},
    {key: colKey.baseProductId, label: '', otherOptions: {type: 'select'}},
    {key: colKey.price, label: ''},
  ]
}

const colInfos: any = {
  customer: {
    title: 'Customer',
    field: 'customerName',
    keywords: [colKey.customerId]
  },
  group1: {
    title: 'Cust Group1',
    field: 'customerGroup1Id',
    keywords: [colKey.customerGroup1Id]
  },
  product: {
    title: 'Product',
    field: 'productName',
    keywords: [colKey.productId]
  },
  baseProduct: {
    title: 'Base Product',
    field: 'baseProductName',
    keywords: [colKey.baseProductId]
  },
  price: {
    title: 'Price($)',
    field: colKey.price,
    keywords: [colKey.price]
  },
}

const SalesProductInfosColumnModel = () => {
  return [
    {
      ...getColModelItem(colInfos.customer, keyInfosArray),
      render: (rowData:any) =>  rowData.quotation.customer.customerCode,
      customFilterAndSearch: (
        filterValue:any,
        rowData:any
      ) => {
         return !filterValue || (rowData.quotation.customer.customerCode.includes(filterValue))
      },            
    },
    {
      ...getColModelItem(colInfos.group1, keyInfosArray),
      render: (rowData:any) => rowData.quotation.customer.group1?.group1Name,
    },
    {
      ...getColModelItem(colInfos.product, keyInfosArray),
    },
    {
      ...getColModelItem(colInfos.baseProduct, keyInfosArray),
      render: (rowData:any) => rowData.product.baseProduct.baseProductName,
      customFilterAndSearch: (
        filterValue:any,
        rowData:any
      ) => {
         return !filterValue || (rowData.product.baseProduct.baseProductName.includes(filterValue))
      },                  
    },
    {
      ...getColModelItem(colInfos.price, keyInfosArray),
    }
  ]
}

export default SalesProductInfosColumnModel
