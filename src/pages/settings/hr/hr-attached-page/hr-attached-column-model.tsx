import React from 'react'
import { urlKey } from '../../../../services/api/api-urls'
import { getColModelItem } from '../../../../services/lib/utils/helpers'

const HRAttachedColumnModel = () => {
	 return [
	  {
		  ...getColModelItem({
			  title: 'Type',
			  field: urlKey.RecordType,
			  keywords: [
				  urlKey.RecordType
			  ]
		  }, () => ([{key: urlKey.RecordType, label: '', otherOptions: {type: 'select'}}]))
	  },
    {
      ...getColModelItem({
        title: 'File',
        field: 'content',
        keywords: [
          'content'
        ]
      }, () => ([{key: 'content', label: 'Img', otherOptions: {type: 'image'}}]))
    }
  ]
}

export default HRAttachedColumnModel

