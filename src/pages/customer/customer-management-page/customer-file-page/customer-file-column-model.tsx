import React from 'react'
import { urlKey } from '../../../../services/api/api-urls'
import { getColModelItem } from '../../../../services/lib/utils/helpers'

const CustomerFileColumnModel = () => {
  return [
    {
      ...getColModelItem({
        title: 'Type',
        field: urlKey.Employee,
        keywords: [
          urlKey.Employee
        ]
      }, () => ([{key: urlKey.Employee, label: '', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}}]))
    },
    {
      title: 'Name',
      align: 'left',
      field: 'attachmentName'
    },
    {
      title: 'Description',
      align: 'left',
      field: 'attachmentDesc'
    },
    {
      ...getColModelItem({
        title: 'File',
        field: 'urls',
        keywords: [
          'urls'
        ]
      }, () => ([{key: 'urls', label: 'File', otherOptions: {type: 'image'}}]))
    }
  ]
}

export default CustomerFileColumnModel

