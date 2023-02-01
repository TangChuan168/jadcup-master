import {getColModelItem} from '../../../../../../../services/lib/utils/helpers'

export const colKey: any = {
  rawMaterialBoxCode: 'rawMaterialBox',
  quantity: 'quantity'
}

const colInfos: any = {
  rowMaterial: {
    title: 'Raw Material Box',
    field: 'boxCode',
    keywords: [
      colKey.rawMaterialBoxCode,
    ]
  },
  quantity: {
    title: 'Quantity',
    field: 'quantity',
    keywords: [
      colKey.quantity,
    ]
  }
}

const WarehouseConfirmDialogTableColumnModel = (props: any): any => {
  const keyInfosArray: any = (props: any) => {
    return [
      {
        key: colKey.rawMaterialBoxCode,
        label: '',
        otherOptions: {
          type: 'select',
          isOverrideSelectionOptions: true,
          exceptionOptionKey: 'active',
          valueJoinArray: ['boxCode'],
          selectionGetUrl: 'RawMaterialBox/GetRawMaterialBoxLocationByRawMaterialId?rawMaterialId=' + props.rawMaterialId
        }
      },
      {key: colKey.quantity, label: '', otherOptions: {type: 'inputNumber'}},
    ]
  }

  const modelArr: any = [
    colInfos.rowMaterial,
    colInfos.quantity,
  ]

  return modelArr.map((row: any) => getColModelItem(row, () => keyInfosArray(props)))
}

export default WarehouseConfirmDialogTableColumnModel
