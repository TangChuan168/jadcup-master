import React from 'react'
import CommonForm from '../../../../components/common/common-form/common-form'
import { Button, Form, Checkbox, Descriptions, Divider, Input, Modal, Radio ,Upload} from 'antd'
import { ApiRequest } from '../../../../services/api/api'
import { useEffect, useState } from 'react'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import { toLocalDate } from '../../../../services/lib/utils/helpers'
import './quotation-customer-side-page.css'
import TextArea from 'antd/lib/input/TextArea'
import quotationPdfGenerate from '../../../static/pdf/quotation/quotation-pdf-generate'
import { UploadOutlined } from '@ant-design/icons';
import {baseUrl} from '../../../../services/api/base-url'

/* eslint-disable */
const QuotationCustomerSidePage = () => {
  const [formRef, setFormRef] = useState<any>()
  const [quotationData, setQuotationData] = useState<any>()
  const [initFormValues, setInitFormValues] = useState<any>()
  const [formItems, setFormItems] = useState<any>([])
  const [quotationItemDataArray, setQuotationItemDataArray] = useState<any>([])
  const [disableSubmit, setDisableSubmit] = useState<any>(false)
  const [termAgreed, setTermAgreed] = useState<any>(false)  
  const [showTerms, setShowTerms] = useState<any>(false)
  const [optionsAmount, setOptionsAmount] = useState<number>(0)
  const formRefCurrent: any = React.useRef()
  const [fileList, setFileList] = useState<any>([]);

  useEffect(() => {
    const [qNo, qId] = window.location.href.slice(window.location.href.indexOf('=') + 1).split('_')
    ApiRequest({
      url: 'Quotation/GetQuotationByIdAndNo?id=' + qId + '&quotationNo=' + qNo,
      method: 'get'
    }).then((res: any) => {
      console.log(res)
	    if (!res.data.success) {
        SweetAlertService.errorMessage(res.data.errorMessage.message)
		    setDisableSubmit(true)
	    }
	    if (res.data.data.custConfirmed) {
		    SweetAlertService.errorMessage('Already confirmed.')
		    setDisableSubmit(true)
	    }
      const vfsFonts = import("pdfmake/build/vfs_fonts");
	    setQuotationData(res.data.data)
	    checkIsOnlyProduct(res.data.data)
    }).catch(_ => {
	    SweetAlertService.errorMessage('Invalid Page.')
    })
  }, [])

  useEffect(() => {
    formRefCurrent.current = formRef
  }, [formRef])

  useEffect(() => {
	  console.log(quotationData)
	  const quotationItemData = setFormItem()
	  const initValue: any = {}
	  for (const quotationItemDataElement of quotationItemData) {
		  initValue[quotationItemDataElement[0]] = quotationItemDataElement[1][0].quotationItemId
	  }
	  setInitFormValues(initValue)
  }, [quotationData])

  const handleQuotationItemData = (quotationItemData: any, row: any, type: any) => {
    if (quotationItemData.filter((item: any) => item[0] === row[type])[0]) {
      quotationItemData = quotationItemData.map((item: any) => {
        if (item[0] === row[type]) {
          item[1].push(concatQuotationItemNameRow(row))
        }
        return item
      })
    } else {
      if (row[type]) {
        quotationItemData.push([row[type], [concatQuotationItemNameRow(row)]])
      }
    }
    console.log(quotationItemData)
    return quotationItemData
  }

  const concatQuotationItemNameRow = (row: any) => ({...row, name: 'Qty: ' + row.notes2 + ' -- ' + 'Price: $' + row.price.toFixed(2)})

  const checkIsOnlyProduct = (data: any) => {
    if (data?.quotationItem?.filter((row: any) => row.productId).length) {
      setDisableSubmit(true)
      return 1
    }
    return 0
  }

  /* eslint-disable */
  const getSubtotal = () => {
    let total = 0
    quotationData?.quotationItem && quotationData?.quotationItem.forEach((item: any) => {
      total += item.price
    })
    return total
  }

  const handleShowTerms = () => {
    setShowTerms(true)
  }

  const handleTermsClose = () => {
    setShowTerms(false)
  }

  const setFormItem = () => {
    let quotationItemData: any = []
    if (quotationData?.quotationItem) {
      for (const row of quotationData.quotationItem) {
	      quotationItemData = handleQuotationItemData(quotationItemData, row, 'baseProductId')
      }
    }
    setQuotationItemDataArray(quotationItemData)

    const formItem: any = []
    quotationItemData.forEach((row: any) => {
      formItem.push({
        name: row[0],
        isWholeRowWidth: true,
        rules: [{required: true}],
        // span: 12,
        label: 'Price Select - ' + row[1][0].baseProduct.baseProductName+
            ',Raw Material:'+row[1][0].baseProduct.rawmaterialDesc+
              ',Sleeve/Pkt:'+row[1][0].baseProduct.packagingType.sleevePkt+
              ',Sleeve Qty:'+row[1][0].baseProduct.packagingType.sleeveQty+
              ',Carton Qty:'+row[1][0].baseProduct.packagingType.quantity,
        inputElement: (
	        <Radio.Group>
		        {row[1].map((item: any, i: any) => <Radio value={item.quotationItemId} key={i.toString()}>{item.name}&nbsp;/Size</Radio>)}
	        </Radio.Group>
        )
      })
      formItem.push({
        isWholeRowWidth: true,
        inputElement: <Divider />
      })
    })
    setFormItems(formItem)
    return quotationItemData
  }
/*
  const onFormChange = (changedValues: any, newValues: any, form: any) => {
	  console.log(changedValues)
	  console.log(newValues)
  }

  const onFormBlur = (form: any) => {
    // console.log(form.getFieldsValue())
    if (!formRef) {
      setFormRef(form)
    }
  }

  const onConfirm = async () => {
    formRef.submit()
    const formValues: any = await formRef.validateFields()
    if (formValues) {
	    console.log(formValues)
	    const selectedQuotations = Object.keys(formValues).map((key: any) => formValues[key])
	    console.log(selectedQuotations)
	    const requestValues = {
		    ...quotationData,
		    custConfimedAt: (new Date()).toISOString(),
		    custConfirmed: 1,
		    draft: 0,
		    quotationItem: quotationData.quotationItem.filter((row: any) => selectedQuotations.includes(row.quotationItemId))
	    }
	    console.log(requestValues)
	    const result = await ApiRequest({
		    url: 'Quotation/UpdateQuotation',
		    method: 'put',
		    data: requestValues
	    })
      if (result) {
        // console.log(result)
        await SweetAlertService.successMessage('Submit successfully')
        setDisableSubmit(true)
      }
    }
  }
  */
  
  const onCheckBoxChange = async (e: any) => {
    setTermAgreed( e.target.checked)
  }
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    if (!termAgreed){
      await SweetAlertService.errorMessage('Please agree this quotation') 
      return
    }
    const selectedQuotations:any=[];
    for (var prop in values) {
      selectedQuotations.push(values[prop.toString()])
    }
    const requestValues = {
      ...quotationData,
      custConfimedAt: (new Date()).toISOString(),
      custConfirmed: 1,
      draft: 0,
      quotationItem: quotationData.quotationItem.filter((row: any) => selectedQuotations.includes(row.quotationItemId))
    } 
    const imgArrayToString = (arr:any) => {
      return arr.map((row:any) => JSON.stringify(row)).join('---')
    }

    let stringurl;
    const imgUrls:any=[];
    fileList.map((row:any, index:any) => {
      imgUrls.push({
        uid: ++index,
        name: row.name,
        url: row.url || row.response
      })
    })
    stringurl = imgArrayToString(imgUrls);
    const result1 = ApiRequest({
      url: 'Customer/AddAttachment',
      method: 'post',
      data: {
        customerId:quotationData.customer.customerId,
        urls:stringurl,
        attachmentName: "customer upload",
        attachmentDesc: "customer upload in quotation",
      }
    })
  
    const result = await ApiRequest({
      url: 'Quotation/UpdateQuotation',
      method: 'put',
      data: requestValues
    })
    if (result) {
      // console.log(result)
      await SweetAlertService.successMessage('Submit successfully')
      setDisableSubmit(true)
    }    
  };
   const onChange = ( newFileList :any) => {
    // if (newFileList.file.response) {}
    setFileList(newFileList.fileList);
  };
  /*
  const onUploadChange = (propsUpload:any) => {
    const imgUrls:any = []
    if (propsUpload.file.response) {
      propsUpload.fileList.map((row:any, index:any) => {
        imgUrls.push({
          uid: ++index,
          name: row.name,
          url: row.url || row.response
        })
      })
      if (imgUrls && imgUrls.length) {
        const imgUrlsStringed = imgArrayToString(imgUrls)
        props.propsFn.onChange(imgUrlsStringed)
      }
    }
  }*/
  const onclick = async (e: any) => {
    // alert("Test");
    const getTableContent = (data: any) => {
      const tableNewData = (res: any) => {
        if (res.productId === null) {
          res.baseProduct.price = res.price
          res.baseProduct.notes = res.notes
          res.baseProduct.notes2 = res.notes2
          res.baseProduct.description = null
          res.baseProduct.itemDesc = res.itemDesc
          return res.baseProduct
        }
        res.product.price = res.price
        res.product.notes = res.notes
        res.product.notes2 = res.notes2
        return res.product
      }
      const resultArrObj: any = {}
      data.map((res:any) => {
        const productTypeName = res.baseProduct?.productType?.productTypeName || res.product?.baseProduct?.productType?.productTypeName
        if (resultArrObj[productTypeName]) {
          resultArrObj[productTypeName].push(tableNewData(res))
        } else {
          resultArrObj[productTypeName] = []
          resultArrObj[productTypeName].push(tableNewData(res))
        }
      })
      return resultArrObj
    }

    const getBlob = (blob?:any) => {
      console.log(blob, 'blob111')
      // setEmailBlob(blob)
    }

    const rowData:any = quotationData;

    const obj = {
      ...rowData,
      customerName: rowData.customer.company,
      email: rowData.customer.email,
      // address: rowData.customer.address2 + ' ' + rowData.customer.address1,
      address: rowData.customer.address2,
      phone: rowData.customer.phone,
      tradingName: rowData.customer?.customerCode,
      validDate: rowData.expDate,
      quoteDate: rowData.effDate,
      quotationNo: rowData.quotationNo,
      tableContent: getTableContent(rowData.quotationItem),
      options: rowData.quotationOption.map((res:any) => {
        if (res.customizeOptionNotes === null) {
          return res.quotationOptionItem.quotationOptionItemName
        }

        return res.customizeOptionNotes
      })
    }
  quotationPdfGenerate(obj, 'print', getBlob)
  }
  /*
  const description = () => {
    const data = quotationData
    if (!data) {
      return null
	  }
    console.log(data)
    return (
      <div style={{background: 'white', opacity: 0.78}} className="quotation-customer-side">
		    <Descriptions bordered>
			    <Descriptions.Item label="Customer">{data.customer.company}</Descriptions.Item>
			    <Descriptions.Item label="Sales">{data.employee?.firstName + ' ' + data.employee?.lastName}</Descriptions.Item>
			    <Descriptions.Item label="Quote Date">{toLocalDate(data.effDate)}</Descriptions.Item>
			    <Descriptions.Item label="Valid Date">{toLocalDate(data.expDate)}</Descriptions.Item>
			    <Descriptions.Item label="Quotation No">{data.quotationNo}</Descriptions.Item>
			    <Descriptions.Item label="Comments">{data.notes}</Descriptions.Item>
			    <Descriptions.Item label="Options">
				    {data.quotationOption && data.quotationOption[0]?.customizeOptionNotes.split('\n').map((str: string, i: any) => <div key={i.toString()}>{str}</div>)}
			    </Descriptions.Item>
		    </Descriptions>
	    </div>
	  )
  }
  */

  return (
    
    <div className={''} style={{height: '100vh'}}>
    <Form
      name="validate_other"
      onFinish={onFinish}  
      >   
      <div className="container mt-1">
        <div className='mb-1 flex content-between items-end'>
          <div className="width-50">
            <div className="logo"></div>
          </div>
          <div className="width-50">
            <span className="fs-28 mr-3">Quotation</span>
            <span>No: {quotationData?.quotationNo}</span>
          </div>
        </div>
      </div>
      <div className="black-block mb-1">
        <div className="container">
          <div className="flex">
            <div className="width-50 mt-1">
              <span className='text-white'>Quote Date: {toLocalDate(quotationData?.effDate)}</span>
            </div>
            <div className="width-50 mt-1">
              <span className='text-white'>Valid Date: {toLocalDate(quotationData?.expDate)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mb-1 flex content-between items-start">
          <div className="width-50">
            <p><strong>For: {quotationData?.customer?.company}</strong></p>
            <p><strong>To: {quotationData?.customer?.contactPerson}</strong></p>
            <p><strong>Add: {quotationData?.customer?.address1}</strong></p>
          </div>
          <div className="width-50">
            <p><strong>From: Jadcup</strong></p>
            <p><strong>Add:4 Pukekiwiriki Place, East Tāmaki, Auckland 2013</strong></p>
            <p><strong>Account Person: {quotationData?.employee?.firstName + ' ' + quotationData?.employee?.lastName}</strong></p>
            <p><strong>Contact No: {quotationData?.employee?.mobile}</strong></p>
          </div>
        </div>
        <Form.Item>
          <Button className="black-button" onClick={onclick} ><strong>Download PDF</strong></Button>
        </Form.Item>
        <div className="hr"></div>
        {quotationItemDataArray && (
          quotationItemDataArray?.map((item: any, i: any) => (
            // quotationData?.quotationItem.map((item: any, i: any) => (
            <div key={item[1][0]?.quotationItemId}>
              <Descriptions layout="vertical" column={4} bordered labelStyle={{fontWeight: 700}}>
                <Descriptions.Item label="Item Code">{item[1][0]?.baseProduct.productCode}</Descriptions.Item>
                <Descriptions.Item label="Product Description">{item[1][0]?.baseProduct.baseProductName}</Descriptions.Item>
                <Descriptions.Item label="Raw Material">{item[1][0]?.baseProduct.rawmaterialDesc}</Descriptions.Item>
                <Descriptions.Item label="Carton Qty">{item[1][0]?.baseProduct.packagingType.quantity}</Descriptions.Item>
              </Descriptions>
              <div style={{padding: '1rem 0 0 0.4rem'}} className='flex content-between'>
                <p><strong>Please Select:</strong></p>
                <Form.Item name={item[1][1]?.baseProduct.productCode}  rules={[{ required: true, message: 'Please select!' }]}>
                  <Radio.Group>
                    {quotationItemDataArray[i] &&
                      quotationItemDataArray[i][1].map((itemData: any) => <Radio value={itemData.quotationItemId} key={itemData.quotationItemId}>{itemData.name}</Radio>)}
                  </Radio.Group>
                </Form.Item>
                <button className="grey-button self-end"><strong>Remove This Item</strong></button>
                {/* <p className='self-end' style={{marginBottom: '0'}}><strong>Amount: $ {item[1][0]?.price.toFixed(2)}</strong></p> */}
              </div>
              <div className="hr"></div>
            </div>
          ))
        )}
        <div style={{padding: '1rem 0 0 0.4rem'}} className='flex content-between'>
          <p><strong>Other Options:</strong></p>
          <p><strong>Amount: $ {optionsAmount?.toFixed(2)}</strong></p>
        </div>
        <div className="hr"></div>
        {/* <div className='mt-3 flex flex-column items-end'>
          <div className='width-50 flex'>
            <div className="width-50 flex flex-column items-end">
              <p><strong>Subtotal</strong></p>
              <p><strong>GST 15%</strong></p>
            </div>
            <div className="width-50 flex flex-column items-end">
              <p><strong>$ {getSubtotal().toFixed(2)}</strong></p>
              <p><strong>$ {(getSubtotal() * 0.15).toFixed(2)}</strong></p>
            </div>
          </div>
          <div className="black-hr width-50"></div>
          <div className='width-50 flex'>
            <div className="width-50 flex flex-column items-end">
              <p><strong>Total (NZD)</strong></p>
            </div>
            <div className="width-50 flex flex-column items-end">
              <p><strong>$ {(getSubtotal() * 1.15).toFixed(2)}</strong></p>
            </div>
          </div>
        </div> */}
        <div className="mt-3 note">
          <div>Note:</div>
          <div style={{whiteSpace:'pre-wrap'}}>
            {quotationData?.quotationOption[0]?.customizeOptionNotes}
          </div>
          
          {/* <div>Full CMYK Colour Digital Printing.</div>
          <div>Urgent orders required within 3-5 working days, $300 extra fees applied</div>
          <div>Production lead-time will be 10 working days upon confirmation of artwork</div>
          <div>Free shipping to 410 Lincoln Road, Addington, Christchurch.</div>
          <div>Full payment on proof confirmed.</div>
          <div>Free mock-up available.</div>
          <div>All prices exclude GST</div> */}
        </div>
        <p className="mt-3"><strong>Need a Free mock-up? Upload a artwork at the link below and we will make it for you within 1-3 working days.</strong></p>
          <Form.Item>
            {/* <Button className="black-button"><strong>Add Image or File +</strong></Button> */}
            <Upload
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              name="imageFile"
              action= {baseUrl + 'Common/UploadImage'}
              listType="picture-card"
              defaultFileList={[...fileList]}
              onChange={onChange}
            >
              <div>
                <Button icon={<UploadOutlined />}><strong>Add Image+</strong></Button>
              </div>
            </Upload>
          </Form.Item>
        
        <div className="note mt-3">
          {/* <p><strong>Additional comments</strong></p>
          <TextArea rows={4} placeholder="Optional"/>
          <p className='mt-1'><strong>Your order/reference number</strong></p>
          <Input placeholder="Optional" /> */}
          <p onClick={handleShowTerms} className='quote-terms mt-1'>Online Quote Terms *</p>
          <Checkbox  onChange={onCheckBoxChange} className='mt-1'><strong>Yes, I {quotationData?.customer?.contactPerson} agree to and accept this (Total NZD including GST $ {(getSubtotal() * 1.15).toFixed(2)}), on {new Date().toLocaleDateString()}.</strong></Checkbox>
          <div className="mt-1 flex">
          <Form.Item>
            <Button  className="black-button mr-3" disabled={disableSubmit}  htmlType="submit" ><strong>Accept Quote</strong></Button >
            <Button className="white-button"><strong>Cancel</strong></Button>
          </Form.Item>
            
          </div>
          
          <Modal visible={showTerms} title="Online Qtuote Terms" footer={[]} width='900px' style={{top: 0}} onCancel={handleTermsClose}>
            Client Order Reference:<br/>
            This quote is only valid for 30 days after dated. This quote is under the term and trade of Brainjam Production Limited<br/>
            Terms and Conditions - You must read first before you accept this quote !<br/>

            Here are Brainjam Production terms, conditions and general trading information. These terms and conditions apply to all orders/quotes and supersede all others. Receipt of acknowledgment of order by you, constitutes your acceptance that our conditions apply to the contract notwithstanding any purported terms put forward by you.<br/>

            1.0 Payment<br/>
            Payment shall be made within seven days of the products being dispatched, unless special settlement terms have been agreed by us in writing.<br/>

            2.0 Non-Account<br/>
            2.1 Hamilton Delivery: Payment is required within 24 hours of your delivery date unless you are an account holder.<br/>
            2.2 New Zealand: Payment is required within 48 hours of your delivery dates.<br/>

            3.0 Discount<br/>
            Any discounts are offered on the strict understanding that accounts are paid by the due date. We reserve the right to invoice any such discounts to accounts which become overdue<br/>

            4.0 Overdue Accounts<br/>
            4.1 No goods will be delivered on accounts which remain unpaid 14 days after payment is due. We reserve the right to charge interest on overdue accounts, at the rate of 5% from time to time from the date the account became due until payment is received. This does not prevent us from pursuing payment of overdue accounts at any time after payment becomes due and shall be in addition to and without prejudice to any other rights we may have against you.<br/>
            4.2 We reserve the right to charge you for any legal or collection charges where it is necessary to obtain payment from you of an overdue account through a third party or Court proceedings<br/>

            5.0 Passing of Title and Risk<br/>
            5.1 The risk in the goods shall pass to you on delivery. All goods, delivered or not, remain our property until payment is received in full.<br/>
            5.2 Until such time as payment is made you shall retain such goods separately from other goods and clearly mark them in such a way that they can be readily identified as being our property and any payment received by you for any sale of such goods must be held in a separate account in trust for us. In the event of non-payment for such goods we will, without loss of any rights or remedy, remove from your possession those goods belonging to us in accordance with these conditions and we shall be entitled to enter upon the property where the goods are stored to repossess and remove the same. You hereby grant us an irrevocable license to enter your premises for the said purposes.<br/>

            6.0 Products<br/>
            We reserve the right to alter any details of products advertised without notice and while every effort is made to describe goods accurately in the advertisement no warranty is given as to accuracy and no responsibility will be accepted for error or mis-scription and any resulting loss.<br/>

            7.0 Quotations and Contracts<br/>
            7.1 Orders are accepted subject to our right to adjust prices quoted to take account of any changes in the law or Government regulations requiring us to increase prices by way of direct taxation, import duties, customs and excise duties or otherwise. The prices are based on today’s current costs of production and in the event of any increase in wages or costs of materials to us occurring after the confirmation of accepted contract, we shall be entitled to charge such increases to you.<br/>
            7.2 Quotations are only valid for 30 days after the initial quote date.<br/>
            7.3 Any price or quotations is subject to change at any point without notice, including advertised offers<br/>

            8.0 Prices<br/>
            All prices quoted are subject to GST.<br/>

            9.0 Delivery<br/>
            Every effort will be made to deliver on time, but any delivery day specified is a best estimate and no liability is accepted for any loss arising from delay or error in the delivery of the goods. All deliveries will be charged at the prevailing rates applying at the date of such delivery.<br/>

            10.0 Quantity Variation<br/>
            We shall be deemed to have fulfilled our contract by delivery of a quantity within 5% plus or minus of the quantity of printed goods ordered and you will be charged at the contract rate for the quantity delivered.<br/>

            11.0 Claims<br/>
            11.1 Claims arising from damages, delay or partial loss in transit must be made in writing to us, so as to reach us within 5 days of delivery.<br/>
            11.2 All claims with regard to the quality or quantity of the goods shall be made in writing to us so as to reach us within 5 working days of receipt of goods or such goods shall be deemed to comply as to quality and quantity within the terms of the contract.<br/>
            11.3 You as a customer must examine all goods delivered at the time of delivery. We shall not be liable for any loss arising from damage caused to the goods in transit unless loss or damage is noted on the delivery note at time of delivery.<br/>
            11.4 Claims in respect of non-delivery must be made in writing so as to reach us within 4 days from receipt of our invoice.<br/>
            11.5 Brainjam Production requires any printing to be returned in full before agreeing to reprint. If The Print Company deem the printing to be of sufficient quality, and within tolerance we reserve the right to return the goods and refuse a reprint or refund.<br/>

            12.0 Liability<br/>
            12.1 Save in so far as defects in the goods cause death injury or damage to personal property, our liability for any loss or damage suffered by you in respect of the goods shall be limited to the contract value of the goods.<br/>
            12.2We can accept no responsibility for loss or damage arising from the supply of goods under this contract unless you have fully complied with the notification of claims procedure set out in Claims Section<br/>
            12.3 We are not liable for any financial loss incurred by you, including but not limited to expenses incurred by you, interest payments & loss of earnings or similar gainsyou would have received on monies paid to us in lieu of any unfulfilled order.<br/>
            12.4 Nothing in these terms and conditions shall affect the rights of a consumer<br/>

            13.0 Refunds<br/>
            13.1 We Reserve the right to rectify defective work by reprinting and shall not be liable to refund.<br/>
            13.2 Brainjam Production will credit your account if we deem a refund should be made.<br/>
            13.3 If we offer to replace you must accept such an offer unless you can show clear cause for refusing to do so.<br/>
            13.4 If you do opt to have work re-done by a third party without reference to us you automatically revoke your right to any remedy from us.<br/>
            13.5 All defective work must be returned to us before replacement, if the subject work is not available we will assume that it has been accepted and no replacement will be provided.<br/>
            13.6 Refunds will take 3 to 4 working days to complete once Brainjam Production has agreed to refund. This cannot be completed any faster.<br/>
            13.7 Cancellation charges: Any costs incurred for work already carried out up to the date of written cancellation will also be charged for and deducted before any refunds are made. If the order has not yet been paid for then an invoice will be raised for the amount concerned and sent to the responsible party<br/>

            14.0 Quantity Changes to Orders<br/>
            Any changes in quantity ordered must be made in writing to us prior to commencement of processing. Any increases in the order must be regarded as a separate contract unless written notification is received before work commences on the original order.<br/>

            15.0 Artwork and Printing<br/>
            15.1 The entire copyright throughout the world in all printing plates, litho positives and negatives, artwork, designs, photographic transparencies, negatives or positives and any other artistic craftsmanship made by or for Brainjam Production pursuant to or in implementation of any contract with the customer shall belong to Brainjam Production. Brainjam Production agrees that unless the customer becomes in default of any obligation to make any payment to Brainjam Production, it will not reproduce any such items for any competitor in business of the customer.<br/>
            15.2 All artwork is printed using CMYK unless otherwise requested by the customer. Such a request will incur an additional fee.<br/>
            15.3 All design charges must be paid upfront unless you have agreed and approved credit account.<br/>
            15.4 We charge $85 plus GST for our logo design service for the first 4 proofs. We then charge $120 plus GST an hour for any changes after that.<br/>
            15.5 Once your design project is initiated and any preliminary artwork has been created by Brainjam Production, all retainer payments made by you become non-refundable.<br/>
            15.6 Once you have placed your order, you have one hour to make changes to the artwork you have supplied, after this time you will become liable to charges if you need to amend or supply new artwork.<br/>
            15.7 We only quote for one design per kind, any additional are chargeable.<br/>
            15.8 We will print the order before payment has been made, unless otherwise specified by Brainjam Production.<br/>

            16.0 Proofs<br/>
            16.1 Please note that the colour of the printed item will be affected by the type of material chosen for the artwork to be printed on, as well as any applied Lamination or Varnish.<br/>
            16.2 Please read thoroughly as all proofs, once passed, are deemed correct and ready to go to print, and the responsibility passes to the customer. You will need to view all PDF proofs at 100% to see the exact size of your product when printed.<br/>
            16.3 We will not be held responsible for any mistakes, viewing, spelling, punctuation, contact details or layout. We will not commence print until we have received a copy of the final proof with a written confirmation to go to print either by email, fax or post.<br/>
            16.4 Proofs are NOT supplied as standard. Proofs must be requested by the person ordering at the time of ordering in writing, verbal confirmation will not be accepted.<br/>

            17.0 Force Majeure<br/>
            We will not be held responsible for failure or delay in the carrying out of our obligations under the contract arising from any cause outside our reasonable control or by inability to procure materials or articles except at higher prices due to any such cause and in such circumstances we shall be entitled by notice to terminate the contract in whole or in part without incurring any liability whatsoever to you.<br/>

            18.0 Miscellaneous<br/>
            The contract between ourselves the Company and the Customer shall be governed by and construed in accordance with New Zealand Law.<br/>

            19.0 Complaints<br/>
            Complaints must be made within 48 hours of receiving your goods. Any complaints made after this time period are void of any right to refund or reprint<br/>
          </Modal>
        </div>
        <div className="flex content-center mt-5">
          <img src="https://static.wixstatic.com/media/6f5302_7e5e65745e3c4a1cbfdeffaa763384d5~mv2.png/v1/fill/w_889,h_107,al_c,usm_0.66_1.00_0.01,enc_auto/Jadcup%20icon.png" alt="Jadcup icon.png" />
        </div>
      </div>
      <div className="mt-3 black-block flex content-center items-center">
        <span className='text-white'>YOUR LOCAL FOOD PACKAGING MANUFACTURER &copy; 2020 NZ MADE 2013 Ltd. T/A </span>
        <span className='jadcup-link'><a href="https://www.jadcup.co.nz/">Jadcup</a></span>
      </div>
      {/* <h1 style={{textAlign: 'center', margin: '0 auto', paddingBottom: '3rem', color: '#005132', fontWeight: 600, fontFamily: 'fantasy', fontSize: '3rem'}}>Jadcup Quotation
      </h1>
      {description()}
      <Divider />
      <CommonForm
        items={formItems}
        onFormChange={onFormChange}
        onFormBlur={onFormBlur}
        initFormValues={initFormValues}
      />
      {(quotationData && !disableSubmit) && (
        <div style={{display: 'flex', justifyContent: 'flex-start'}}>
          <Button
            disabled={!formRef}
            onClick={onConfirm}
            type="primary"
          >Submit</Button>
        </div>
      )} */}
      </Form>   
    </div>
  )
}

export default QuotationCustomerSidePage
