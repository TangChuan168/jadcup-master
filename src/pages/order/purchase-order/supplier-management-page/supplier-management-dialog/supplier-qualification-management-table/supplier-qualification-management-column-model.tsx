import { getColModelItem } from '../../../../../../services/lib/utils/helpers'

export const colKey: any = {
  qualificationUrls: 'qualificationUrls',
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.qualificationUrls, label: '', otherOptions: {type: 'image'}},
  ]
}

const colInfos: any = {
  qualificationUrls: {
    title: 'File',
    field: 'qualificationUrls',
    keywords: [
      colKey.qualificationUrls,
    ]
  },
}

const SupplierQualificationManagementColumnModel = (): any => {
  let modelArr: any = [
    colInfos.qualificationUrls
  ]

  modelArr = modelArr.map((row: any) => getColModelItem(row, keyInfosArray))
  modelArr.push({
    title: 'Expire Date',
    field: 'expDate1',
    sorting: false,
    type: 'date'
  })

  return modelArr
}

export default SupplierQualificationManagementColumnModel
