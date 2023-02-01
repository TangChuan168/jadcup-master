import { Input } from '@material-ui/core'
import React from 'react'

export default class PageManagementDialogColumnModel {
    static PageManagementDialogColumn = [
      {
        title: 'Page Name',
        align: 'left',
        field: 'pageName',
        validate: (rowData : any) => rowData.pageName === '' ? { isValid: false, helperText: 'Required' } : true
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
        title: 'Page URL',
        align: 'left',
        field: 'pageUrl',
        validate: (rowData : any) => rowData.pageUrl === '' ? { isValid: false, helperText: 'Required' } : true
      }
    ]
}
