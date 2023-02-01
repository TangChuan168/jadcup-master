import React, { useEffect } from 'react'
import { Button, Col, Divider, Form, Row, Tooltip } from 'antd'
import { getRandomKey } from '../../../services/lib/utils/helpers'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

export interface ItemElementPropsInterface {
	name: string | any[]
	label?: string
	rules?: any[]
	inputElement?: any
	isWholeRowWidth?: boolean
	otherProps?: any
	isNotEditable?: boolean
	addButtonText?: string
	span?: number
}

export interface CommonFormPropsInterface {
	items: ItemElementPropsInterface[]
	onFormChange?: any
	onFormBlur?: (form: any) => void
	initFormValues?: any
}

export const validateMessages: any = {
  required: 'required!',
  types: {
    email: 'not a valid email!',
    number: 'not a valid number!',
  },
  number: {
    min: 'must be greater than ${min}',
    max: 'must be less than ${max}',
	  range: 'must be between ${min} and ${max}',
  },
}

const CommonForm = (props: CommonFormPropsInterface) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (props.initFormValues) {
	    form.setFieldsValue(props.initFormValues)
	    props.onFormBlur && props.onFormBlur(form)
    }
  }, [props.initFormValues])

  const itemElement = (propsItemElement: ItemElementPropsInterface, isList?: boolean, span?: any) => {
	  // console.log(propsItemElement)
    const formItem = (
		  <Form.Item
			  {...propsItemElement.otherProps}
			  name={propsItemElement.name}
			  // label={false}
			  label={
				  (propsItemElement.label === ' ' || isList) ?
					  false :
					  (
              propsItemElement.label ||
						  propsItemElement.name && (propsItemElement.name[0].toUpperCase() + propsItemElement.name.slice(1)) ||
						  false
					  )
			  }
			  rules={propsItemElement.rules || []}
		  >
			  {propsItemElement.inputElement}
		  </Form.Item>
	  )
    return propsItemElement.isWholeRowWidth ?
      <Col key={getRandomKey()} sm={24}>{formItem}</Col> :
      <Col key={getRandomKey()} lg={span ? span : (propsItemElement.name?.toString().includes('Id') ? 6 : 3)} md={6} sm={24}>{formItem}</Col>
  }

  const itemListElement = (propsItemListElement: ItemElementPropsInterface[]) => {
    return (
      <div key={getRandomKey()} className="jadcup-form-list" style={{width: '100%', padding: '1rem', margin: '0.6rem', border: '1px solid #9e9e9e', borderRadius: '0.8rem'}}>
	      <Row gutter={24} align="middle">
		      {
			      propsItemListElement.map((row: ItemElementPropsInterface | any, index) => (
				      <Col key={getRandomKey()} lg={row.span ? row.span : (row.name[1]?.toString().includes('Id') ? 6 : 3)} md={6} sm={24} style={{marginBottom: '0.5rem'}}>
					      {
						      row.rules && row.rules[0].required ?
							      <span style={{color: 'red'}}>* </span> :
							      null
					      }
					      {row.label}
				      </Col>
			      ))
		      }
	      </Row>
		    <Form.List name={propsItemListElement[0].name[0]}>
			    {(fields, { add, remove }) => (
				    <>
					    {fields.map((field, index) => (
						    <div key={field.key}>
							    <Row gutter={24} align="middle">
	                  {
	                    propsItemListElement.map((row: ItemElementPropsInterface, i: any) => {
                        row.otherProps = {...row.otherProps, ...field, fieldKey: [field.fieldKey, row.name[1]]}
	                      row.name = [field.name, row.name[1]]
		                    // console.log(field)
		                    // console.log(row)
		                    // console.log(i)
		                    return itemElement(row, true, row.span)
	                    })
	                  }
								    {
                      !propsItemListElement[0].isNotEditable &&
									    <Col key={getRandomKey()} lg={1} md={6} sm={24}>
										    <Tooltip title="delete">
											    <Button type="primary" ghost shape="circle" onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
										    </Tooltip>
									    </Col>
								    }
							    </Row>
							    {(fields.length - 1) === index ? null : <Divider style={{borderColor: '#9e9e9e'}} dashed />}
						    </div>
					    ))}
					    {
						    !propsItemListElement[0].isNotEditable &&
						    <Form.Item>
							    <Divider style={{borderColor: '#9e9e9e', marginTop: '1rem'}} dashed />
							    <Button type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
								    {propsItemListElement[0].addButtonText || 'Add field' }
							    </Button>
						    </Form.Item>
					    }
				    </>
			    )}
		    </Form.List>
	    </div>
    )
  }

  return (
	  <Form
		  form={form}
		  scrollToFirstError={true}
		  wrapperCol={{span: 24}}
		  layout="vertical"
		  onValuesChange={(changedValues, values) => {
			  props.onFormChange(changedValues, values, form)
		  }}
		  validateMessages={validateMessages}
		  onBlur={() => props.onFormBlur && props.onFormBlur(form)}
	  >
		  <Row gutter={24}>
			  {
	        props.items.map((row: ItemElementPropsInterface | ItemElementPropsInterface[]) => {
					  if (row) {
						  if (!Array.isArray(row)) {
							  return itemElement(row, false, row.span)
						  } else {
							  return itemListElement(row)
						  }
					  }
			    })
			  }
		  </Row>
	  </Form>
  )
}

export default CommonForm
