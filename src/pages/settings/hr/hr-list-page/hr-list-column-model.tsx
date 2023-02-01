import React from 'react'
import { urlKey } from '../../../../services/api/api-urls'
import { getColModelItem } from '../../../../services/lib/utils/helpers'

export const colKey: any = {
  resouceId: 'resouceId',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  email: 'email',
  status: 'status',
  notes: 'notes',
  role: urlKey.Role,
}

const keyInfosArray: any = () => {
  return [
    { key: colKey.firstName, label: '' },
    { key: colKey.lastName, label: '' },
    { key: colKey.phone, label: '' },
    { key: colKey.email, label: '' },
    { key: colKey.role, label: '', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['roleName']} },
  ]
}

const colInfos: any = {
  firstName: {
    title: 'First Name',
    field: 'firstName',
    keywords: [
      colKey.firstName,
    ]
  },
  lastName: {
    title: 'Last Name',
    field: 'lastName',
    keywords: [
      colKey.lastName,
    ]
  },
  phone: {
    title: 'Phone',
    field: 'phone',
    keywords: [
      colKey.phone,
    ]
  },
  email: {
    title: 'Email',
    field: 'email',
    keywords: [
      colKey.email,
    ]
  },
  role: {
    title: 'Role',
    field: 'role',
    keywords: [
      colKey.role,
    ]
  },
}

const HrListColumnModel = (): any => {
  let modelArr: any = [
    colInfos.firstName,
    colInfos.lastName,
    colInfos.phone,
    colInfos.email,
    colInfos.role,
  ]

  modelArr = modelArr.map((row: any) => getColModelItem(row, keyInfosArray))

  return [
    ...modelArr,
    {
      title: 'Birthday',
      field: 'dob1',
      sorting: false,
      type: 'date'
    },
    {
      title: 'EntryDate',
      field: 'entryDate1',
      sorting: false,
      type: 'date'
    },
    {
      title: 'BirthdayDue',
      field: 'birthdayDue',
      editable: 'never',
      lookup: { 1: 'Yes', 0: 'No' },
    },
    {
      title: 'ContractDue',
      field: 'contractDue',
      editable: 'never',
      lookup: { 1: 'Yes', 0: 'No' },
    }
  ]
}

export default HrListColumnModel
