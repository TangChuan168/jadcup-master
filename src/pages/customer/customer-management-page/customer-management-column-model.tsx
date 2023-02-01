import React from 'react'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, getItemsObj, getRandomKey, nbsStr, renderFn } from '../../../services/lib/utils/helpers'
import { Button } from 'antd'
import CommonDatePickerFilter from '../../../components/common/others/common-date-picker-filter'
import moment from 'moment'

export const colKey: any = {
  customerNumber: 'customerNumber',
  company: 'company',
  customerCode: 'customerCode',
  salutation: 'salutation',
  contactPerson: 'contactPerson',
  address1: 'address1',
  address2: 'address2',
  postalCode: 'postalCode',
  phone: 'phone',
  mobile: 'mobile',
  email: 'email',
  leadRating: 'leadRating',
  notes: 'notes',
  city: urlKey.City,
  customerGroup1: urlKey.CustomerGroup1,
  customerGroup2: urlKey.CustomerGroup2,
  customerGroup3: urlKey.CustomerGroup3,
  customerGroup4: urlKey.CustomerGroup4,
  customerGroup5: urlKey.CustomerGroup5,
  customerStatus: urlKey.CustomerStatus,
  customerSource: urlKey.CustomerSource,
  paymentCycle: urlKey.PaymentCycle,
  employee: urlKey.Employee,
  brand: urlKey.Brand,
  deliveryMethod: urlKey.DeliveryMethod,
  customerCredit:'customerCredit'
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.customerNumber, label: 'Customer Number', otherOptions: {disabled: true}},
    {key: colKey.company, label: 'Company'},
    {key: colKey.customerCode, label: 'Trading Name', otherOptions: {required: true}},
    {key: colKey.salutation, label: 'First Name'},
    {key: colKey.contactPerson, label: 'Last Name'},
    {key: colKey.city, label: 'City', otherOptions: {type: 'select', width: '20rem'}},
    {key: colKey.address1, label: 'Address', otherOptions: {type: 'googleMapAddrSelect', width: '20rem'}},
    {key: colKey.postalCode, label: 'Postal Code', otherOptions: {width: '20rem'}},
    {key: colKey.phone, label: 'Phone'},
    {key: colKey.mobile, label: 'Mobile'},
    {key: colKey.email, label: 'Email'},
    {key: colKey.customerCredit, label: 'Credit Limit',otherOptions: {type: 'inputNumber'}},
    {key: colKey.customerGroup1, label: 'Group1', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup2, label: 'Group2', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup3, label: 'Group3', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup4, label: 'Group4', otherOptions: {type: 'select'}},
    {key: colKey.customerGroup5, label: 'Group5', otherOptions: {type: 'select'}},
    {key: colKey.leadRating, label: 'Rating', otherOptions: {type: 'inputNumber'}},
    {key: colKey.paymentCycle, label: 'Payment Term', otherOptions: {type: 'select'}},
    {key: colKey.customerStatus, label: 'Status', otherOptions: {type: 'select'}},
    {key: colKey.employee, label: 'Sales', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}},
    {key: colKey.brand, label: 'Brand', otherOptions: {type: 'select'}},
    {key: colKey.customerSource, label: 'Source', otherOptions: {type: 'select'}},
    {key: colKey.deliveryMethod, label: 'Delivery Method', otherOptions: {type: 'select', width: '20rem'}},
    {key: colKey.notes, label: 'Comments', otherOptions: {type: 'inputTextArea'}},
  ]
}

const colInfos: any = (isSalesCustomer: any) => ({
  companyInfo: {
    title: 'Customer Info',
    field: 'customerCode',
    keywords: [
      colKey.customerNumber,
      colKey.company,
      colKey.customerCode,
      colKey.brand,
      colKey.notes,
    ],
    render: [
      colKey.customerCode,
    ]
  },
  contactInfo: {
    title: 'Contact Info',
    field: 'contactInfo',
    keywords: [
      colKey.salutation,
      colKey.contactPerson,
      colKey.phone,
      colKey.mobile,
      colKey.email,
    ],
    render: [
      colKey.phone,
    ]
  },
  addressInfo: {
    title: 'Address Info',
    field: 'addressInfo',
    keywords: [
      colKey.city,
      colKey.address1,
      colKey.postalCode,
      colKey.deliveryMethod,
    ],
    render: [
      colKey.address1,
    ]
  },
  groupClassification: {
    title: 'Group Classification',
    field: 'groupClassification',
    keywords: [
      colKey.customerGroup1,
      colKey.customerGroup2,
      colKey.customerGroup3,
      colKey.customerGroup4,
      colKey.customerGroup5,
    ],
    render: [
      colKey.customerGroup1,
    ]
  },
  otherInfo: {
    title: 'Other Info',
    field: 'otherInfo',
    keywords: isSalesCustomer ? [
      colKey.customerSource,
    ] : [
      colKey.paymentCycle,
      colKey.customerCredit,   
      colKey.customerSource,
      colKey.employee,
      // colKey.leadRating,
      colKey.customerStatus,
    ],
    render: [
      colKey.employee,
    ]
  }
})

const CustomerManagementColumnModel = (props: any): any => {
  let modelArr: any = [
    colInfos(props.isSalesCustomer).companyInfo,
    colInfos(props.isSalesCustomer).contactInfo,
    colInfos(props.isSalesCustomer).addressInfo,
    colInfos(props.isSalesCustomer).groupClassification,
  ]
  if (!props.isSalesCustomer) {
    modelArr.push(colInfos(props.isSalesCustomer).otherInfo)
  }
  modelArr = modelArr.map((row: any, index: number) => ({
    ...getColModelItem(row, keyInfosArray),
    render: (rowData: any) => {
      if (index === 0) {
        return nbsStr(rowData[colKey.customerCode])
      }
      if (index === 1) {
        return nbsStr(rowData[colKey.phone])
      }
      if (index === 2) {
        return rowData[colKey.address1]
      }
      if (index === 3) {
        return rowData.group1?.group1Name
      }
      if (index === 4) {
        return rowData.employee?.firstName + ' ' + rowData.employee?.lastName
      }
      return renderFn(getItemsObj(keyInfosArray(), rowData), row.render)
    },
  }))

  modelArr.push(
    {
      title: 'Created At',
      field: 'createdAt',
      type: 'datetime',
      editable: 'never',
      render: (rowData: any) =>rowData.createdAtDate?moment.utc( rowData.createdAtDate).local().format('DD/MM/YYYY'):'',
      filterComponent: (props:any) => {
        return (
          <>
            <CommonDatePickerFilter
              columnDef={props.columnDef}
              onFilterChanged={props.onFilterChanged}
            />
          </>
        )
      },
      customFilterAndSearch: (
        filterValue:any,
        rowData:any
      ) => {
        if (filterValue && (!filterValue.startDate || !filterValue.endDate || filterValue.startDate > filterValue.endDate)) {
          return false
        }
        return !filterValue || (rowData.createdAt >= filterValue.startDate && rowData.createdAt.slice(0, 10) <= filterValue.endDate)
      },
    }
  )
  modelArr.push(
    {
      title: 'Last Order',
      field: 'lastOrderDate',
      type: 'datetime',
      editable: 'never',
      render: (rowData: any) =>rowData.lastOrderDate?moment.utc( rowData.lastOrderDate).local().format('DD/MM/YYYY'):''
    })
  if (!props.isSalesCustomer && props.isSalesView != true) {
    modelArr.push({
      title: 'Status Change',
      field: 'statusChange',
      editComponent: (props: any) => null,
      render: (rowData: any) => (
        <Button
          key={getRandomKey()}
          type="primary"
          danger={rowData[colKey.customerStatus + 'Id'] === 1}
          onClick={() => {
            props.updateCustomerStatus(rowData, rowData[colKey.customerStatus + 'Id'] === 1 ? 2 : 1)
          }}
        >
          {rowData[colKey.customerStatus + 'Id'] === 1 ? 'Deactivate' : 'Active'}
        </Button>
      )
    })
  } else {
    modelArr.push({
      title: 'Status',
      field: 'customerStatus',
      editable: 'never',
      render: (rowData: any) => rowData.status?.statusName,
    })
  }

  return modelArr
}

export default CustomerManagementColumnModel
