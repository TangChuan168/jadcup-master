import React, { useEffect, useState } from 'react'
import CommonTablePage from '../../../../components/common/common-table/common-table-page'
import ContactManagementColumnModel from './contact-management-column-model'
import { urlKey } from '../../../../services/api/api-urls'


const ContactManagementPage = (props: {customerId: any, isReadOnly?: boolean}):any => {
  return (
    <div>
    <CommonTablePage
      urlInfoKey={urlKey.Contact}
      title="Contact Management"
      column={ContactManagementColumnModel.ContactManagementColumn}
      isNotDeletable={props.isReadOnly}
      isNotEditable={props.isReadOnly}
      isNotAddable={props.isReadOnly}
      mappingRenderData={(data: any) => data.filter((row: any) => row.customerId === props.customerId)}
      mappingUpdateData={(dataDetail: any) => {
        console.log(dataDetail)
        return {...dataDetail,
           customerId: props.customerId,
          }
      }}
    />
    </div>
  )
}

export default ContactManagementPage
