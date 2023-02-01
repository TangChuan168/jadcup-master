import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import { allUrls } from '../../../services/api/api-urls'
import { ApiRequest } from '../../../services/api/api'
import { getJoinValueFromArray, getRandomKey } from '../../../services/lib/utils/helpers'

const { Option } = Select

interface CommonEditSelectComponentPropsInterface {
	urlInfoKey: string
	label?: string
	required?: boolean
	valueJoinArray?: any
	selectionGetUrl?: string
	rowDataKeyword?: any
	disabled?: boolean
	isOverrideSelectionOptions?: boolean
	width?: string
	exceptionOptionKey?: any
	propsFn: any
}

const CommonEditSelectComponent: React.FC<CommonEditSelectComponentPropsInterface> = (props: CommonEditSelectComponentPropsInterface) => {
  const [data, setData] = useState([])
  const id: string = props.urlInfoKey + 'Id'
  const rowDataKeyword: string = props.rowDataKeyword || props.urlInfoKey + 'Id'
  const name: string = props.urlInfoKey + 'Name'

  useEffect(() => {
	  let isCancelled = false
	  ApiRequest({
		  url: props.selectionGetUrl || allUrls[props.urlInfoKey].get,
		  method: 'get'
	  }).then((res: any) => {
      if (!isCancelled) {
			  setData(res.data.data)
		  }
	  })
	  return () => {
		  isCancelled = true
	  }
  }, [])

  const OptionComponent = (row: any) => (
    <Option value={row[id]} key={row[id]}>
      {
        props.isOverrideSelectionOptions ?
          getJoinValueFromArray(row, props.valueJoinArray) :
          row[name]
      }
    </Option>
  )

  const getOptionFromData = () => {
    const optionArr: any = []
    data.map((row: any) => {
      if (props.exceptionOptionKey) {
        if (row[props.exceptionOptionKey]) {
          optionArr.push(OptionComponent(row))
        }
      } else {
        optionArr.push(OptionComponent(row))
      }
    })
    return optionArr
  }

  return (
	  <Form.Item
		  key={props.urlInfoKey + getRandomKey()}
		  label={props.label}
		  name={props.urlInfoKey}
		  initialValue={props.propsFn.rowData[rowDataKeyword]}
		  rules={[{ required: props.required, message: props.label + ' is required!' }]}
	  >
		  <Select
			  allowClear
			  disabled={props.disabled}
			  showSearch
			  style={{ width: props.width || '12rem' }}
			  placeholder=""
			  value={props.propsFn.rowData[rowDataKeyword]}
			  optionFilterProp="children"
			  onChange={(value: any) => {
          const row: any = data.filter(item => item[id] === value)[0]
					  props.propsFn.onRowDataChange({
						  ...props.propsFn.rowData,
						  [rowDataKeyword]: value ? row[id] : null,
						  [props.urlInfoKey]: row
					  })
				  }
			  }
			  filterOption={(input: any, option: any) => {
	          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			  }}
			  getPopupContainer={node => node.parentNode} // Block for one hour
			  onInputKeyDown={(e: any) => {
				  if (e.key === 'Enter') {
					  e.preventDefault()
					  return
				  }
			  }}
		  >
			  {getOptionFromData()}
		  </Select>
	  </Form.Item>
  )
}

export default CommonEditSelectComponent
