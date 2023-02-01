import React, {useEffect, useState} from 'react'
import {Select} from 'antd'
// import {iSelectRequest} from '../../../services/i-select-services'

const {Option} = Select

interface Iprops {
    placeholder?:string
    onChange: (data:any) => void
    width?:number
    data:any
    value?:any
}

const Iselect:React.FC<Iprops> = (props) => {

  const onChange = (value:string) => {
    props.onChange(value)
  }

  const onBlur = () => {
    // console.log('blur');
  }

  const onFocus = () => {
    // console.log('focus');
  }

  const onSearch = (val:string) => {
    // console.log('search:', val);
  }

  const selects = props.data.map((res:any, index: number) => {
    return (
        <Option key={index} value={res.value}>{res.label}</Option>
    )
  })

  const otherProps = () => {
    if (props.value) {
      return {value: props.value}
    }
    return {}
  }

  return (
    <Select
      allowClear={true}
      showSearch
      style={{ width: props.width ? props.width : 140 }}
      placeholder={props.placeholder ? props.placeholder : 'select one'}
      optionFilterProp="children"
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onSearch={onSearch}
      filterOption={ (input: any, option: any) => {
        return option.children.toLowerCase().indexOf(input?.replace('\u2011', '\u002d').toLowerCase()) >= 0
      } }
      {...otherProps()}
    >
      {selects}
    </Select>

  )
}

export default Iselect
