import React from 'react'
import { urlKey } from '../../../../services/api/api-urls'
import { getColModelItem } from '../../../../services/lib/utils/helpers'

const HRContractsColumnModel = () => {
  return [
    {
      ...getColModelItem({
        title: 'Type',
        field: urlKey.ContractType,
        keywords: [
          urlKey.ContractType
        ]
      }, () => ([{key: urlKey.ContractType, label: '', otherOptions: {type: 'select'}}]))
    },
    {
      title: 'EffDate',
      field: 'effDate1',
      sorting: false,
      type: 'date'
    },
    {
      title: 'Expired Date',
      field: 'expDate1',
      sorting: false,
      type: 'date'
    },
    {
      title: 'Trial Date',
      field: 'trialDate1',
      sorting: false,
      type: 'date'
    },
    {
      title: 'Description',
      align: 'left',
      field: 'contractDesc'
    },
    {
      ...getColModelItem({
        title: 'File',
        field: 'url',
        keywords: [
          'url'
        ]
      }, () => ([{key: 'url', label: 'File', otherOptions: {type: 'image'}}]))
    }
  ]
}

export default HRContractsColumnModel

