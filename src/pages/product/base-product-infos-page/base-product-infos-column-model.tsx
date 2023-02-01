import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, nbsStr } from '../../../services/lib/utils/helpers'
import React from 'react'

export const colKey: any = {
  baseProductName: 'baseProductName',
  productCode: 'productCode',
  rawMaterialDesc: 'rawmaterialDesc',
  productType: urlKey.ProductType,
  packagingTypeId: urlKey.PackagingType,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.baseProductName, label: ''},
    {key: colKey.productCode, label: ''},
    {key: colKey.productType, label: '', otherOptions: {type: 'select'}},
    {key: colKey.packagingTypeId, label: '', otherOptions: {type: 'select'}},
    {key: colKey.rawMaterialDesc, label: '', otherOptions: {type: 'inputTextArea'}},
  ]
}
// row.Group1.Group1Name
const showGrp1:any = (e:any)=> {
  if (!e ) return ''
  if (e.Group1)
    return '-Group1:'+e.Group1.Group1Name
  else
  return '-Group1:All'
}
const colInfos: any = {
  baseProduct: {
    title: 'Base Product Name',
    field: 'baseProduct',
    keywords: [colKey.baseProductName]
  },
  productCode: {
    title: 'Base Product Code',
    field: 'productCode',
    keywords: [colKey.productCode]
  },
  packagingType: {
    title: 'Packaging Type',
    field: 'packagingType',
    keywords: [colKey.packagingTypeId]
  },
  rawMaterialDesc: {
    title: 'Raw Material Description',
    field: colKey.rawMaterialDesc,
    keywords: [colKey.rawMaterialDesc]
  },
}
export const myfiler=(
  filterValue:any,
  rowData:any
) => {
  const filter = filterValue.replace(/-/g, '\u2011').trim();
  const prodName = (rowData.productCode?.replace(/-/g, '\u2011')?.trim())?.toUpperCase();
  if (prodName?.indexOf(filter.toUpperCase()) >=0) return true;
  return false;
}  
const BaseProductInfosColumnModel = () => {
  return [
    {
      ...getColModelItem(colInfos.baseProduct, keyInfosArray),
      render: (rowData:any) => rowData.baseProductName,
    },
    {
      ...getColModelItem(colInfos.productCode, keyInfosArray),
      render: (rowData:any) => rowData.productCode,
      customFilterAndSearch:(        filterValue:any,
        rowData:any) =>myfiler(
        filterValue,
        rowData
      )  
    },      
    {
      ...getColModelItem(colInfos.packagingType, keyInfosArray),
    },
    {
      ...getColModelItem(colInfos.rawMaterialDesc, keyInfosArray),
    },
    {
      ...getColModelItem({
        title: 'Img',
        field: 'sampleImage2',
        keywords: [
          'sampleImage'
        ]
      }, () => ([{key: 'sampleImage', label: 'Img', otherOptions: {type: 'image'}}]))
    },
    // {
    //   title: 'Prices',
    //   field: 'productPrice',
    //   render: (rowData: any) => (
    //     <div>
    //       {rowData.productPrice.map((row: any, i: any) => <div key={i.toString()}>{nbsStr(`Qty: ${row.quantiy} - Price: $${row.price} - Desc: ${row.description}{showGrp1(${row})}`)}</div>)}
    //     </div>
    //   )
    // }
  ]
}

export default BaseProductInfosColumnModel
