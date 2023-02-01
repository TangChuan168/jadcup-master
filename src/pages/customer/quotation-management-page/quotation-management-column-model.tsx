import React from 'react'
import { urlKey } from '../../../services/api/api-urls'
import { getColModelItem, getItemsObj, getRandomKey, renderFn, nbsStr } from '../../../services/lib/utils/helpers'
import moment from 'moment'


export const colKey: any = {
  draft: 'draft',
  quotationNo: 'quotationNo',
  customerId: urlKey.Customer,
  effDate: 'effDate',
  expDate: 'expDate',
  employeeId: urlKey.Employee,
}

const keyInfosArray: any = () => {
  return [
    {key: colKey.customerId, label: '', otherOptions: {required: true, type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['company', 'customerCode']}},
    {key: colKey.quotationNo, label: 'No'},
    {key: colKey.employeeId, label: 'Sales', otherOptions: {type: 'select', isOverrideSelectionOptions: true, valueJoinArray: ['firstName', 'lastName']}},
  ]
}

const colInfos: any = {
  basicInfo: {
    title: 'Basic Info',
    field: 'basicInfo',
    keywords: [colKey.customerId, colKey.employeeId]
  },
  items: {
    title: 'Items Info',
    field: 'items',
  },
  notes: {
    title: 'Notes',
    field: 'notes',
  },
}

const QuotationManagementColumnModel = () => {
  return [
    {
      ...getColModelItem(colInfos.basicInfo, keyInfosArray),
      render: (rowData: any) => renderFn(getItemsObj(keyInfosArray(), rowData), [...colInfos.basicInfo.keywords, colKey.quotationNo]),
    },
    {
      title: 'Quote Date',
      field: 'effDate1',
      render: (rowData: any) => moment.utc(rowData.effDate1).local().format('DD/MM/YY')+"-"+moment.utc(rowData.expDate).local().format('DD/MM/YY'),
    },
    // {
    //   title: 'Valid Date',
    //   field: 'expDate1',
    //   render: (rowData: any) =>  moment.utc(rowData.expDate).local().format('DD/MM/YY'),
    // },
    {
      title: colInfos.items.title,
      field: colInfos.items.field,
      filtering: true,
      editable: 'never',
      render: (rowData:any) => (
        <div>
          {
            rowData.quotationItem.map((row: any) => (
              <div style={{display:'flex'}} key={getRandomKey()}>
                {
                  row.baseProductId ? (
                    <div style={{width:'35ch'}}>
                      <b>Base:</b>&nbsp;{nbsStr(row.baseProduct?.productCode)}
                    </div>
                  ) : null
                }
                {
                  row.baseProductId ? (
                    <div style={{width:'48ch'}}>
                      <b></b>{nbsStr(row.baseProduct?.baseProductName,false,48)}
                    </div>
                  ) : null
                }
                {
                  row.productId ? (
                    <div style={{width:'35ch'}}>
                      <b>Prod:</b>&nbsp;{nbsStr(row.product?.productCode)}
                    </div>
                  ) : null
                }
               {
                  row.productId ? (
                    <div style={{width:'48ch'}}>
                      <b></b>{nbsStr(row.product?.productName,false,48)}
                    </div>
                  ) : null
                }                
                <div style={row.isLowerPrice||row.isBelowMin ? {color: 'red', fontWeight: 'bold'} : {}}>
                  <b>${row.price.toFixed(2)}</b>
                </div>
                {/* <div style={row.isBelowMin ? {color: 'red', fontWeight: 'bold'} : {}}>
                  <b>Below</b>
                </div>                 */}
              </div>
            ))
          }
        </div>
      ),
      customFilterAndSearch: (
        filterValue:any,
        rowData:any
      ) => {
        // console.log(filterValue)
        // console.log(rowData)
        const filter = filterValue.replace(/-/g, '\u2011').trim().slice(0,-1);
        const quotationItems = rowData.quotationItem
        for (const quotationItem of quotationItems) {
          console.log(quotationItem)
          if (quotationItem.product) {
            if (quotationItem.product?.productCode?.replace(/-/g, '\u2011').toUpperCase().includes(filter.toUpperCase())) {
              return true
            }
          }
          if (quotationItem.baseProduct) {
            if (quotationItem.baseProduct?.productCode?.replace(/-/g, '\u2011').toUpperCase().includes(filter.toUpperCase())) {
              return true
            }
          }

        }
        return false
      },
    },
    {
      title: 'Incl Lower Price',
      field: 'inclLowerPrice',
      lookup: {0: 'No', 1: 'Yes'},
    },    
    {
      title: 'Created By',
      field: 'employee',
      render: (rowData: any) => 
      <div style={rowData.isFinal ? {color: 'red', fontWeight: 'bold'} : {}}>
        <b>{rowData.isFinal?"Contact Price":rowData.employee?.firstName}</b>
      </div>
      ,
    },
    // {
    //   title: colInfos.notes.title,
    //   field: colInfos.notes.field,
    //   filtering: false,
    //   editable: 'never',
    //   render: (rowData:any) => (
    //     <div>
    //       {
    //         rowData.quotationOption.map((row: any, index: number) => {
    //
    //           return (
    //             <div key={getRandomKey()}>
    //               {
    //
    //                 row[urlKey.QuotationOptionItem + 'Id'] ? (
    //                   <span>
    //                     <b>#</b>&nbsp;{nbsStr(row[urlKey.QuotationOptionItem]?.[urlKey.QuotationOptionItem + 'Name'])}
    //                   </span>
    //                 ) : (
    //                   <span>
    //                     <b>#</b>&nbsp;{nbsStr(row.customizeOptionNotes)}
    //                   </span>
    //                 )
    //               }
    //             </div>
    //
    //           )
    //         })
    //       }
    //     </div>
    //   ),
    // },
    {
      title: 'Comments',
      field: 'notes',
    },
    // {
    //   title: 'Customer Confirmed',
    //   field: 'custConfirmed',
    //   editable: 'never',
    //   lookup: {0: 'No', 1: 'Yes'},
    //   render: (rowData: any) => rowData.custConfimedAt1
    // },
    {
      title: 'Draft',
      field: colKey.draft,
      defaultSort: 'asc',
      lookup: {0: 'No', 1: 'Yes'}
    }
  ]
}

export default QuotationManagementColumnModel
