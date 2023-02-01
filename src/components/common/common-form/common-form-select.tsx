import { getJoinValueFromArray } from '../../../services/lib/utils/helpers'
import { allUrls, urlKey } from '../../../services/api/api-urls'
import { ApiRequest } from '../../../services/api/api'
import { Select } from 'antd'
import React, { useState } from 'react'

const { Option } = Select

export const getSelectOptions = async (urlInfoKey: string, selectionGetUrl?: string) => {
  const result = await ApiRequest({
    url: selectionGetUrl || allUrls[urlInfoKey].get,
    method: 'get',
    isShowSpinner: [urlKey.City, urlKey.QuotationOptionItem].includes(urlInfoKey)
  })
  return result.data.data
}

export const commonFormSelect = (urlInfoKey: string, data: any, valueJoinArray?: any[], disabled?: boolean, onChangeFn?: any, valueKeyString?: any, placeholder?: any, value?: any, showDefault?: boolean) => {
  const id: string = urlInfoKey + 'Id'
  const name: string = urlInfoKey + 'Name'

  const showData = () => {
    console.log(data)
  }

  return (
    <Select
      placeholder={placeholder || ''}
      allowClear
      showSearch
      style={{width: '100%'}}
      defaultValue={showDefault && data[0][id]}
      disabled={disabled}
      onChange={onChangeFn}
      filterOption={ (input: any, option: any) => {
        return option.children.toLowerCase().indexOf(input?.replace('\u2011', '\u002d').toLowerCase()) >= 0
      } }
      value={value}
      onInputKeyDown={ (e: any) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          return
        }
      } }
    >
      {
        data.map((row: any, index: number) => row && (
          <Option value={valueKeyString ? row[valueKeyString] : row[id]} key={index.toString()}>
            {
              valueJoinArray && valueJoinArray.length ?
                getJoinValueFromArray(row, valueJoinArray) :
                row[name]
            }
          </Option>
        ))
      }
    </Select>
  )
}
