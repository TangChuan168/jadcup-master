import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import CommonEditSelectComponent from './common-edit-select-component'
import CommonEditImageComponent from './common-edit-image-component'
import CommonEditGoogleMapAddressSelectComponent from './common-edit-google-map-address-select-component'

const { TextArea } = Input

interface CommonEditComponentPropsInterface {
  formItems: any
  restFormItems?: any
  propsFunction: any
}

export interface FormItemPropsInterface {
  label: string
  keyword: string
  value?: any
  type?: string
  required?: boolean
  disabled?: boolean
  selectionGetUrl?: string
  rowDataKeyword?: string
  isNotShow?: boolean
  valueJoinArray?: any
  isOverrideSelectionOptions?: boolean
  width?: string
  exceptionOptionKey?: any
  max?: number
  min?: number
  isNotCutting?: boolean
}

const CommonEditComponent = (props: CommonEditComponentPropsInterface): any => {
  const propsFn = props.propsFunction

  const inputFormItem = (formItem: FormItemPropsInterface, otherProps?: any) => {
    const inputProps = {
      allowClear: true,
      autoComplete: 'newpassword',
      style: {width: formItem.width || '12rem'},
      disabled: formItem.disabled,
      onChange: (e: any) => updateRowData(formItem, otherProps?.type === 'number' ? parseInt(e.target.value, 10) : e.target.value),
      ...otherProps
    }
    return (
      <Input {...inputProps} />
    )
  }

  const selectFormItem = (formItem: FormItemPropsInterface) => {
    return (
      <CommonEditSelectComponent
        key={formItem.keyword}
        urlInfoKey={formItem.keyword}
        required={formItem.required}
        label={formItem.label}
        disabled={formItem.disabled}
        selectionGetUrl={formItem.selectionGetUrl}
        rowDataKeyword={formItem.rowDataKeyword}
        valueJoinArray={formItem.valueJoinArray}
        isOverrideSelectionOptions={formItem.isOverrideSelectionOptions}
        width={formItem.width}
        exceptionOptionKey={formItem.exceptionOptionKey}
        propsFn={propsFn}
      />
    )
  }

  const googleMapAddrSelectFormItem = (formItem: FormItemPropsInterface) => {
    return (
      <CommonEditGoogleMapAddressSelectComponent
        key={formItem.keyword}
        urlInfoKey={formItem.keyword}
        required={formItem.required}
        label={formItem.label}
        disabled={formItem.disabled}
        width={formItem.width}
        propsFn={propsFn}
      />
    )
  }

  const ImageFormItem = (FormItem: FormItemPropsInterface) => {
    return (
      <CommonEditImageComponent
        key={FormItem.keyword}
        formItems={FormItem}
        propsFn={propsFn}
      />
    )
  }

  const inputNumberFormItem = (formItem: FormItemPropsInterface) => {
    const inputNumberProps: any = {
      type: 'number',
      onKeyPress: (e: any) => {
        if (e.key === 'e' || e.key === '-') {
          e.preventDefault()
        }
      }
    }
    return inputFormItem(formItem, inputNumberProps)
  }

  const inputNumberWithRangeFormItem = (formItem: FormItemPropsInterface) => {
    const inputProps = {
      autoComplete: 'newpassword2',
      style: {width: formItem.width || '12rem'},
      disabled: formItem.disabled,
      max: formItem.max || 999999999999,
      min: formItem.min || -999999999999,
      onChange: (value: any) => updateRowData(formItem, value),
    }
    return (
      <InputNumber {...inputProps} />
    )
  }

  const inputTextAreaFormItem = (formItem: FormItemPropsInterface) => {
    const onTextAreaChange: any = (e: any) => updateRowData(formItem, e.target.value)
    return <TextArea style={{width: formItem.width||'16rem'}} showCount autoSize maxLength={300} disabled={formItem.disabled} onChange={onTextAreaChange} />
  }

  const updateRowData = (formItem: FormItemPropsInterface, value: any) => {
    propsFn.onRowDataChange({
      ...propsFn.rowData,
      [formItem.keyword]: value
    })
  }

  const dateFormItem = (formItem: FormItemPropsInterface) => null

  const dateRangeFormItem = (formItem: FormItemPropsInterface) => null

  const getFormItem = (formItem: FormItemPropsInterface) => {
    switch (formItem.type) {
      case 'select':
        return selectFormItem(formItem)
      case 'googleMapAddrSelect':
        return googleMapAddrSelectFormItem(formItem)
      case 'inputNumber':
        return formatFormItem(formItem, inputNumberFormItem(formItem))
      case 'inputNumberWithRange':
        return formatFormItem(formItem, inputNumberWithRangeFormItem(formItem))
      case 'inputTextArea':
        return formatFormItem(formItem, inputTextAreaFormItem(formItem))
      case 'date':
        return formatFormItem(formItem, dateFormItem(formItem))
      case 'dateRange':
        return formatFormItem(formItem, dateRangeFormItem(formItem))
      case 'image':
        return ImageFormItem(formItem)
      default:
        return formatFormItem(formItem, inputFormItem(formItem))
    }
  }

  const formatFormItem = (formItem: FormItemPropsInterface, element: any) => {
    return (
      <Form.Item
        key={formItem.keyword}
        label={formItem.label}
        name={formItem.keyword}
        initialValue={formItem.value || ''}
        rules={[{ required: formItem.required, message: formItem.label + ' is required!' }]}
      >
        {element}
      </Form.Item>
    )
  }

  return (
    <div>
      <Form layout="vertical">
	      { props.formItems.map((formItem: FormItemPropsInterface) => !formItem.isNotShow ? getFormItem(formItem) : null) }
	      { props.restFormItems ? props.restFormItems.map((formItem: any) => formItem) : null }
      </Form>
    </div>
  )
}

export default CommonEditComponent
