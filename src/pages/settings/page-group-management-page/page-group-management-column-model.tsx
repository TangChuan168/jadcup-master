import React from 'react'
import { Input } from '@material-ui/core'

export default class PageGroupManagementColumnModel {
    static PageManagementColumn = [
      {
        title: 'Group Name',
        align: 'left',
        field: 'groupName',
        validate: (rowData : any) => rowData.groupName === '' ? { isValid: false, helperText: 'Required' } : true
      },
      {
        title: 'Sorting Order',
        align: 'left',
        field: 'sortingOrder',
        validate: (rowData : any) => rowData.sortingOrder === '' ? { isValid: false, helperText: 'Required' } : true,
        editComponent: (props : any) => {
          return (
            <Input type="number" onChange={ (e: any) => props.onChange(e.target.value) } value={ props.value} />
          )
        }
      },
      {
        title: 'Pages',
        align: 'left',
        field: 'modifyPages',
        sorting: false,
        filtering: false,
        render: (props: any) => (
          props.page ?
            <div> {props.page.map((page: any) => (<span key={page.pageName}> {page.pageName} </span>))}  </div>
            :
            <div> </div>
        ),
        editComponent: (props : any) => {
          return (
            <div></div>
          )

        }
      }

    ]

}

