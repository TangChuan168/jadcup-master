import { getColModelItem } from '../../../services/lib/utils/helpers'
import { urlKey } from '../../../services/api/api-urls'

const NotificationManagementColumnModel = () => {
	 return [
    {
      ...getColModelItem({
			  title: 'Creator',
			  field: 'creator',
			  keywords: [
          urlKey.Employee
			  ]
		  }, () => ([{key: urlKey.Employee, label: '', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}}]))
	  },
    {
      ...getColModelItem({
        title: 'Role',
        field: 'role',
        keywords: [
          urlKey.Role
        ]
      }, () => ([{key: urlKey.Role, label: '', otherOptions: {type: 'select'}}]))
	  },
    {
		  title: 'Start Date',
		  align: 'left',
		  field: 'startDate1',
      type: 'date',
	    sorting: false
	  },
    {
		  title: 'End Date',
		  align: 'left',
		  field: 'endDate1',
      type: 'date',
	    sorting: false
    },
    {
      title: 'Active',
      field: 'isActive1',
      lookup: {0: 'No', 1: 'Yes'},
    },
    {
      title: 'Content',
      field: 'notificationContext',
    },
  ]
}

export default NotificationManagementColumnModel

