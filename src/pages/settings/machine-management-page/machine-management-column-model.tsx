import React from 'react'
import { getColModelItem } from '../../../services/lib/utils/helpers'
import { urlKey } from '../../../services/api/api-urls'

const MachineManagementColumnModel = () => {
	 return [
	  {
		  title: 'Name',
		  align: 'left',
		  field: 'machineName'
	  },
    {
      ...getColModelItem({
        title: 'Type',
        field: urlKey.MachineType,
        keywords: [
          urlKey.MachineType
        ]
      }, () => ([{key: urlKey.MachineType, label: '', otherOptions: {type: 'select'}}]))
	  },
    {
		  title: 'Sorting Order',
		  align: 'left',
		  field: 'sortingOrder',
      type: 'numeric'
	  },
    {
      ...getColModelItem({
        title: 'Img',
        field: 'picture',
        keywords: [
          'picture'
        ]
      }, () => ([{key: 'picture', label: 'Img', otherOptions: {type: 'image'}}]))
    }
  ]
}

export default MachineManagementColumnModel

