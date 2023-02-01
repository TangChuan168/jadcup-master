import { getColModelItem } from '../../../../../../services/lib/utils/helpers'
import { urlKey } from '../../../../../../services/api/api-urls'

export const colKey: any = {
  rawMaterialId: urlKey.RawMaterial,
  suplierProductCode: 'suplierProductCode',
  unitPrice: 'unitPrice',
  priceBreak: 'priceBreak',
  description: 'description',   
  unit: 'unit',    
}

const keyInfosArray: any = () => {
  return [
    // {key: colKey.rawMaterialId, label: '', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['rawMaterialName', 'rawMaterialCode'], width: '20rem'}},
    { key: colKey.rawMaterialId, label: '',otherOptions: {type: 'select',width:'35rem',isNotCutting:true, isOverrideSelectionOptions: true, valueJoinArray: ['rawMaterialName', 'rawMaterialCode']}},
    { key: colKey.suplierProductCode, label: '',otherOptions: {type: 'inputTextArea',isNotCutting:true,width:'16rem'} },
    { key: colKey.unitPrice, label: '' },
    { key: colKey.priceBreak, label: '',otherOptions: {type: 'inputTextArea',width:'5rem'}  },
    { key: colKey.description, label: '',otherOptions: {type: 'inputTextArea',width:'10rem'}  },    
    { key: colKey.unit, label: '' ,otherOptions: {type: 'inputTextArea',width:'5rem'} },      
  ]
}

const colInfos: any = {
  rawMaterialId: {
    title: 'Raw Material',
    field: 'rawMaterialId',
    keywords: [
      colKey.rawMaterialId,
    ],
    render: (rowData:any) => rowData.rawMaterial ? `${rowData.rawMaterial?.rawMaterialName}(Code: ${rowData.rawMaterial?.rawMaterialCode})` : null,
  },
  suplierProductCode: {
    title: 'Suplier Product Code',
    field: 'suplierProductCode',
    keywords: [
      colKey.suplierProductCode,
    ]    
  }, 
  unit: {
    title: 'Unit',
    field: 'unit',
    keywords: [
      colKey.unit,
    ]    
  },   
  unitPrice: {
    title: 'Unit Price',
    field: 'unitPrice',
    keywords: [
      colKey.unitPrice,
    ]      
  },   
  priceBreak: {
    title: 'Price Break',
    field: 'priceBreak',
    keywords: [
      colKey.priceBreak,
    ]       
  }, 
  description: {
    title: 'Note',
    field: 'description',
    keywords: [
      colKey.description,
    ]          
  },    

}


const SupplierRawMaterialColumnModel = (): any => {
  let modelArr: any = [
    colInfos.rawMaterialId,
    colInfos.suplierProductCode,
    colInfos.unit,    
    colInfos.unitPrice,
    colInfos.priceBreak,
    colInfos.description,
  ]

  modelArr = modelArr.map((row: any) => getColModelItem(row, keyInfosArray))

  return modelArr
}

export default SupplierRawMaterialColumnModel
