import { TextField } from '@material-ui/core'
import React from 'react'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem } from '../../../services/lib/utils/helpers'

export const colKey: any = {
  baseProductName: 'baseProductName',
  productCode: 'productCode',
  description: 'description',
  rawMaterialDesc: 'rawmaterialDesc',
  // visible: 'visible',
  imgUrl: 'imgUrl',  
  productType: urlKey.ProductType,
  rawMaterial: urlKey.RawMaterial,
  packagingTypeId: urlKey.PackagingType,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.baseProductName, label: '', otherOptions: {type: 'inputTextArea',width: '20rem'},},
    {key: colKey.productCode, label: 'Code'},
    {key: colKey.productType, label: 'Type', otherOptions: {type: 'select'}},
    {key: colKey.rawMaterial, label: 'Raw 1', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['rawMaterialName', 'rawMaterialCode']}},
    {key: colKey.packagingTypeId, label: 'Pack Type', otherOptions: {type: 'select'}},
    {key: colKey.description, label: 'Base Desc', otherOptions: {type: 'inputTextArea'}},
    {key: colKey.rawMaterialDesc, label: 'Raw Desc', otherOptions: {type: 'inputTextArea'}},
    // {key: colKey.visible, label: 'visible', otherOptions: {type: 'select'}},
    {key: colKey.imgUrl, label: 'Sample', otherOptions: {type: 'image'}},    
  ]
}

const colInfos: any = {
  baseProduct: {
    title: 'Base Product Name',
    field: 'baseProduct',
    keywords: [colKey.baseProductName]
	 },
  productCode: {
    title: 'Base Product Info',
    field: 'productCode',
    keywords: [colKey.productCode, colKey.productType, colKey.packagingTypeId]
  },
  rawMaterial: {
    title: 'Other Info',
    field: 'rawMaterial',
    keywords: [colKey.description, colKey.rawMaterialDesc, colKey.rawMaterial],
  },
  imgUrl: {
    title: 'Sample',
    field: 'imgUrl',
    keywords: [
      colKey.imgUrl
    ]
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
const BaseProductManagementColumnModel = () => {
  return [
    {
      ...getColModelItem(colInfos.baseProduct, keyInfosArray),
      render: (rowData:any) => rowData.baseProductName,
    },
    {
      ...getColModelItem(colInfos.productCode, keyInfosArray),
      customFilterAndSearch:(        filterValue:any,
        rowData:any) =>myfiler(
        filterValue,
        rowData
      )  
    },
    {
      ...getColModelItem({
        title: 'Raw 2',
        field: 'rawMaterialId2',
        keywords: [
          urlKey.RawMaterial
        ]
      }, () => ([{key: urlKey.RawMaterial, label: 'Raw 2', otherOptions: {type: 'select', rowDataKeyword: 'rawMaterialId2'}}])),
      render: (rowData:any) => rowData.rawMaterial2 ? `${rowData.rawMaterial2?.rawMaterialName}(Code: ${rowData.rawMaterial2?.rawMaterialCode})` : null,
    },
    {
      ...getColModelItem(colInfos.rawMaterial, keyInfosArray),
    },    
    {
      title: 'Customer Visible',
      field: 'visible',
      initialEditValue: 0,
      // type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'}
    },  
    {
      ...getColModelItem(colInfos.imgUrl, keyInfosArray),
    },
    {
      title: 'Manufactured',
      field: 'manufactured',
      initialEditValue: 0,
      // editable: 'onAdd',
      editable: 'never',
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'}
    }
  ]
}

export default BaseProductManagementColumnModel
