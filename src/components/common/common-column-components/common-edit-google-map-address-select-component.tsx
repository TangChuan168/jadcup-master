import React from 'react'
import { Form, Select, Spin } from 'antd'
import { ApiRequest } from '../../../services/api/api'
import { getRandomKey } from '../../../services/lib/utils/helpers'
import debounce from 'lodash/debounce'

interface CommonEditGoogleMapAddressSelectComponentPropsInterface {
	urlInfoKey: string
	label?: string
	required?: boolean
	disabled?: boolean
	width?: string
	propsFn: any
}

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }: any) => {
  const [fetching, setFetching] = React.useState(false)
  const [options, setOptions] = React.useState<any>([])
  const fetchRef = React.useRef(0)
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: any) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)
      fetchOptions(value).then((newOptions: any) => {
        if (fetchId !== fetchRef.current) {
          return
        }
        setOptions(newOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])
  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
} // Usage of DebounceSelect

const fetchUserList = async (username: any) => {
  console.log('fetching user', username)
  const result: any = [{
    label: username,
    value: username,
  }]
  const apiResult = await ApiRequest({
    url: 'Common/GetGoogleAddr?Path=' + username,
    method: 'get'
  })
  if (apiResult.data.predictions?.length) {
    result.push(...apiResult.data.predictions.map((row: any, i: any) => ({
      label: row.description,
      value: row.description,
    })))
  }
  return result
}

const CommonEditGoogleMapAddressSelectComponent = (props: CommonEditGoogleMapAddressSelectComponentPropsInterface) => {
  const [value, setValue] = React.useState()
  return (
	  <Form.Item
		  key={props.urlInfoKey + getRandomKey()}
		  label={props.label}
		  name={props.urlInfoKey}
		  initialValue={props.propsFn.rowData[props.urlInfoKey]}
		  rules={[{ required: props.required, message: props.label + ' is required!' }]}
	  >
      <DebounceSelect
        mode="single"
        showSearch
        value={value}
        placeholder="Search address"
        fetchOptions={fetchUserList}
        onChange={(newValue: any) => {
          setValue(newValue)
	        props.propsFn.onRowDataChange({
		        ...props.propsFn.rowData,
		        [props.urlInfoKey]: newValue
	        })
        }}
        style={{
          width: '100%',
        }}
        initialValue={props.propsFn.rowData[props.urlInfoKey]}
      />
	  </Form.Item>
  )
}

export default CommonEditGoogleMapAddressSelectComponent
