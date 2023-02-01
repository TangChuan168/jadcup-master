import React from 'react'
import {Select} from 'antd'

interface Iprops{
    title?: string
    defaultValue?:number
    placeholder?:string
    data:any
    onChange: (data: any,rowData?: any, days?: any, dayInWeek?: any, )=>void
    location: any,
    date:string
}

const {Option} = Select

const ISelectForNormal:React.FC<Iprops> = (props) => {
  // array of data, placeholder
  // console.log(props.data,props.location,'select得到的data')
  const onChange = (value:any, event:any) => {
    //   console.log(props.data,'props.data')
    // console.log(`selected ${value}`);
    // console.log(event,'event')
    if (event.value === 'clear') {
      event.value = null
    }
    props.onChange(event, props.location,props.title,props.date,)
  }

    return (
      <>
        <Select
          // allowClear={true}
          showSearch
          style={{ width: 150 }}
          placeholder={props.placeholder ? props.placeholder : 'Select a person'}
          defaultValue={props.defaultValue}
          optionFilterProp="children"
          onChange={onChange}
          // onSelect={onSelect}
        >
          <Option key={0} value={'clear'} title={props.title}>None</Option>
          {props.data.map((res:any, index: number) => {
            return (
              <Option key={index + 1} title={props.title} value={res.id}>{res.name}</Option>
            )
          })}
        </Select>
      </>
  )
}

export default ISelectForNormal
