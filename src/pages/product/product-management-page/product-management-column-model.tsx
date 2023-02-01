import { getColModelItem } from '../../../services/lib/utils/helpers'
import { urlKey } from '../../../services/api/api-urls'

export const colKey: any = {
  productName: 'productName',
  productCode: 'productCode',
  baseProductId: urlKey.BaseProduct,
  plain: 'plain',
  logoType: 'logoType',
  logoUrl: 'logoUrl',
  showImgUrl:'showImgUrl',
  description: 'description',
  customerId: urlKey.Customer,
  plateTypeId: urlKey.PlateType,
  marginOfError: 'marginOfError',
  minOrderQuantity: 'minOrderQuantity',
  productImage: 'images',
  productMsl: 'productMsl',
  semiMsl: 'semiMsl',
  inStock: 'inStock',
  palletStacking: urlKey.PalletStacking
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.productName, label: 'Name', otherOptions: {type: 'inputTextArea',required: true, width: '36rem', isNotCutting: true}},
    {key: colKey.productCode, label: 'Product Code', otherOptions: {required: true}},
    {key: colKey.customerId, label: 'Customer', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['company', 'customerCode'], width: '36rem'}},
    {key: colKey.baseProductId, label: 'Base Product', otherOptions: {type: 'select', width: '36rem'}},
    {key: colKey.palletStacking, label: 'Pallet Stacking', otherOptions: {required: true, type: 'select'}},
    {key: colKey.description, label: 'Description', otherOptions: {type: 'inputTextArea'}},
    {key: colKey.plateTypeId, label: 'Pallet Type', otherOptions: {type: 'select'}},
    {key: colKey.inStock, label: 'inStock[-1:Out of stock]', otherOptions: {type: 'inputNumberWithRange', min:0 , max:1}},
    {key: colKey.marginOfError, label: 'Default Margin of Error[%]'},
    {key: colKey.minOrderQuantity, label: 'MOQ for Order[Cartons]', otherOptions: {type: 'inputNumber'}},
    {key: colKey.productMsl, label: 'Product Stock Level[Pieces]', otherOptions: {type: 'inputNumber'}},
    {key: colKey.semiMsl, label: 'Semi Stock Level[Pieces]', otherOptions: {type: 'inputNumber'}},
    {key: colKey.productImage, label: 'Product Image', otherOptions: {type: 'image'}},
    {key: colKey.logoUrl, label: 'Logo File', otherOptions: {type: 'image'}},
    {key: colKey.showImgUrl, label: 'Show Image', otherOptions: {type: 'image'}},    
  ]
}
export const myfiler=(
  filterValue:any,
  rowData:any
) => {
  const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1);
  const prodName = (rowData.productName?.replace(/-/g, '\u2011'))?.toUpperCase();
  if (prodName?.indexOf(filter.toUpperCase()) >=0) return true;
  const prodCode = (rowData.productCode?.replace(/-/g, '\u2011'))?.toUpperCase();
  if (prodCode?.indexOf(filter.toUpperCase()) >=0) return true;  
  if (rowData.customer?.customerCode?.indexOf(filter.toUpperCase()) >=0) return true;  
  if (rowData.customer?.company?.indexOf(filter.toUpperCase()) >=0) return true;  
  return false;
}   
const colInfos: any = {
  productInfo: {
    title: 'Product Info',
    field: 'productInfo',
    keywords: [
      colKey.productName,
      colKey.customerId,
      colKey.baseProductId,
      colKey.productCode,
    ],
    customFilterAndSearch:(
      filterValue:any,
      rowData:any) =>myfiler(
      filterValue,
      rowData
    )     
  },
  properties: {
    title: 'Properties',
    field: 'properties',
    keywords: [
      colKey.plateTypeId,
      colKey.palletStacking,
      colKey.description,
      colKey.inStock, 
    ]
  },
  quantityInfo: {
    title: 'Quantity Info',
    field: 'quantityInfo',
    keywords: [
      colKey.marginOfError,
      colKey.minOrderQuantity,
      colKey.productMsl,
      colKey.semiMsl,
    ]
  },
  productImage: {
    title: 'Image',
    field: 'images',
    keywords: [
      colKey.productImage
    ]
  },
  logoUrl: {
    title: 'Logo File',
    field: 'logoUrl',
    keywords: [
      colKey.logoUrl,
    ]
  },
  // showImgUrl: {
  //   title: 'Customer Picture',
  //   field: 'showImgUrl',
  //   keywords: [
  //     colKey.showImgUrl
  //   ]
  // }  
}

const ProductManagementColumnModel = (): any => {
  let modelArr: any = [
    colInfos.properties,
    colInfos.quantityInfo
  ]

  modelArr = modelArr.map((row: any) => getColModelItem(row, keyInfosArray))
  const productInfoColumn = getColModelItem(colInfos.productInfo, keyInfosArray)
  productInfoColumn.customFilterAndSearch = colInfos.productInfo.customFilterAndSearch;
  modelArr.unshift(productInfoColumn)
  modelArr.push({
    ...getColModelItem(colInfos.productImage, keyInfosArray),
    filtering: false,
  })
  // modelArr.push({
  //   ...getColModelItem(colInfos.showImgUrl, keyInfosArray),
  //   filtering: false,
  // })  
  modelArr.push({
    title: 'Logo Type',
    field: colKey.logoType,
    initialEditValue: 0,
    type: 'numeric',
    lookup: {0: 'Normal', 1: 'With Customer Logo', 2: 'Without Customer Logo', 3: 'Without made in NZ'}
  })
  modelArr.push({
    ...getColModelItem(colInfos.logoUrl, keyInfosArray),
    filtering: false,
  })
  modelArr.push({
    title: 'Plain',
    field: colKey.plain,
    initialEditValue: 0,
    type: 'numeric',
    editable: 'onAdd',
    lookup: {0: 'No', 1: 'Yes'}
  })

  return modelArr
}

export const OutsourceProductManagementColumnModel = () => {
  return [
    {
      title: 'Product Description',
      field: 'productName',
      render: (rowData: any) => rowData.productName
    },
    {
      title: 'Product Code',
      field: 'productCode',
      render: (rowData: any) => rowData.productCode
    },
    {
      title: 'Note',
      field: 'description',
      render: (rowData: any) => rowData.description
    },
  ]
}

export default ProductManagementColumnModel
