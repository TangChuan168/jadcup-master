import { urlKey } from '../../../services/api/api-urls'
import { editFn, filterFn, getColModelItem, getItemsObj, renderFn } from '../../../services/lib/utils/helpers'

export const colKey: any = {
  firstName: 'firstName',
  lastName: 'lastName',
  userName: 'userName',
  password: 'password',
  email: 'email',
  mobile: 'mobile',
  department: urlKey.Department,
  role: urlKey.Role,
}

const keyInfosArray: any = (rowData?: any) => {
  return [
    {key: colKey.firstName, label: 'First Name', otherOptions: {required: true}},
    {key: colKey.lastName, label: 'Last Name', otherOptions: {required: true}},
    {key: colKey.userName, label: 'Username', otherOptions: {required: true}},
    {key: colKey.password, label: 'Password', otherOptions: {required: true, isNotShow: !!rowData?.employeeId}},
    {key: colKey.department, label: 'Department', otherOptions: {type: 'select'}},
    {key: colKey.role, label: 'Role', otherOptions: {type: 'select'}},
    {key: colKey.email, label: 'Email'},
    {key: colKey.mobile, label: 'Mobile'},
  ]
}

const colInfos: any = {
  userInfo: {
    title: 'User Info',
    field: 'userInfo',
    keywords: [
      colKey.firstName,
      colKey.lastName,
      colKey.userName,
      colKey.password
    ]
  },
  position: {
    title: 'Position',
    field: 'position',
    keywords: [
      colKey.department,
      colKey.role,
    ]
  },
  contactInfo: {
    title: 'Contact Info',
    field: 'contactInfo',
    keywords: [
      colKey.email,
      colKey.mobile,
    ]
  },
}

const EmployeeManagementColumnModel = (): any => {
  return [
    {
      ...getColModelItem(colInfos.userInfo, keyInfosArray),
      // if Functions are override below, same functions in getColModelItem will not be called
      validate: (rowData: any) => (rowData.firstName?.length > 0 && rowData.lastName?.length > 0 && rowData.userName?.length > 0 && (!!rowData.employeeId || rowData.password?.length > 0)),
      customFilterAndSearch: (inputValue: any, rowData: any) => filterFn(inputValue, getItemsObj(keyInfosArray(), rowData), [colKey.firstName, colKey.lastName, colKey.userName]),
      render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), [colKey.firstName, colKey.lastName, colKey.userName]),
      editComponent: (props: any) => editFn(props, getItemsObj(keyInfosArray(props.rowData), props.rowData), colInfos.userInfo.keywords),
    },
    getColModelItem(colInfos.position, keyInfosArray),
    getColModelItem(colInfos.contactInfo, keyInfosArray),
    {
      title: 'is Sales Person',
      field: 'isSales',
      initialEditValue: 1,
      type: 'numeric',
      lookup: {0: 'No', 1: 'Yes'}
    },
  ]
}

export default EmployeeManagementColumnModel
