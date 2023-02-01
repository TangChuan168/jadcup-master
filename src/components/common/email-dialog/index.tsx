import React, {useEffect, useState} from 'react'
import {Button, Col, Form, Input, Modal, Row} from 'antd'
import moment from 'moment'
import {Editor} from 'react-draft-wysiwyg'
import {convertToRaw, EditorState, ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {sendEmail} from '../../../services/others/quotation-email-services'
import {Email} from '../../../pages/customer/quotation-management-page/quotation-management-page'
import { frontEndBaseUrl } from '../../../services/api/base-url'
import PurchaseOrderPdf from '../../../pages/static/pdf/purchaseOrder/purchaseOrder-pdf'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'

const { TextArea } = Input

const tailLayout = {
  wrapperCol: { offset: 22 },
}

const EmailModal1 = (props:{visible:boolean, onCancel:()=>void, rowData:any, blob?:any, quotationRowData?:Email,pdfData?:any}) => {

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )
  useEffect(() => {
    if (props.quotationRowData) {
      const html =
            `<p>Thanks for the opportunity to quote on your request.</p>
            <p>You can approve your quote online by clicking the link below.</p>
            <p style="color:blue"><b><a href="${frontEndBaseUrl}/cus-qot?token=${props.quotationRowData?.quotationNo}_${props.quotationRowData?.quotationId}">${frontEndBaseUrl}/cus-qot?token=${props.quotationRowData?.quotationNo}_${props.quotationRowData?.quotationId}</a></b></p>
            <p>Alternatively you can contact me directly via email or phone and we’ll get your job moving.</p>
            <p>Should you have any further questions/queries please don’t hesitate to get in touch.</p>
            <p></p>
            <p>Kind Regards,</p>
            <p></p>
            <p>${props.quotationRowData?.roleId == 9 ? 'General Manager' : (props.quotationRowData?.roleId == 16? 'Account Manager': 'Sales')}</p>
            <p>Email: ${props.quotationRowData?.employeeEmail}| Phone: ${props.quotationRowData?.employeeNumber} </p>
            <p>Jadcup, 4 Pukekiwiriki Place, East Tamaki, Auckland 2013, New Zealand</p>
            `

            // <p>Email: ella@jadcup.co.nz| Phone: 09 282 3988</p>            
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  }, [props.visible])

  const formFinishHandler = (values: any) => {
    console.log('Success:', values)
    console.log(props.blob)

    let myFile:any
    if (!props.pdfData){
      myFile = blobToFile(props.blob, 'Invoice.pdf')
    }else{
      myFile = blobToFile(props.blob, 'PurchaseOrder.pdf')
    }

    
    const formData = new FormData()

    formData.append('File', myFile)
    formData.append('SenderName', 'Jadcup')
    formData.append('SenderAddress', values.SenderAddress)
    // formData.append('TargetName', 'Quotation')
    formData.append('TargetAddress', values.TargetAddress)
    formData.append('Subject', values.Subject)
    // formData.append('Subject', `Please find attached your Quote Summary #####`)
    formData.append('HtmlContent', draftToHtml(convertToRaw(editorState.getCurrentContent())))
    // formData.append('FileName', `quotation${moment().format('YYYY-MM-DD')}.pdf`)

    if (!props.pdfData){
      formData.append('TargetName', 'Quotation')
      formData.append('FileName', `Quotation${moment().format('YYYY-MM-DD')}.pdf`)
    }else{
      formData.append('TargetName', 'PurchaseOrder')
      formData.append('FileName', `PurchaseOrder${moment().format('YYYY-MM-DD')}.pdf`)
    }    
    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())),'sda')
    // console.log(formData)

    sendEmail(formData).then((res:any) => {
        if (res.data.isSuccessStatusCode==false){
          SweetAlertService.errorMessage("Send emal fail!");
      }      
      console.log(res)
      props.onCancel()
    })
  }

 
  const blobToFile = (theBlob: Blob, fileName:string):File => {
    const blob: any = theBlob
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    blob.lastModifiedDate = new Date()
    blob.name = fileName

    return theBlob as File
  }

  const generateFileName = () =>{
    console.log(props)
    if (props.quotationRowData)
        return  props.quotationRowData?.customerCode+"_"+props.quotationRowData?.quotationNo
    else
      if ( props.pdfData.suplier)
        return props.pdfData?.suplier?.suplierName+"_"+props.pdfData.poNo+".pdf"
      else
        return  "Purchase_"+moment().format('YYYY-MM-DD')+".pdf"
  }
  const pdfShow = () => {
    let blob,blobURL
    blob = new Blob([props.blob], {type: 'application/pdf'})

    blobURL = URL.createObjectURL(blob)
    let downloadlink  =document.createElement("a");
    downloadlink.href = blobURL;
    downloadlink.download = generateFileName()
    document.body.appendChild(downloadlink);
    downloadlink.click();
    document.body.removeChild(downloadlink);
  }

  const onEditorStateChange = (editorState12:any) => {
    setEditorState(editorState12)
  }

  const cancelHandler = () => {
    setEditorState(EditorState.createEmpty())
    props.onCancel()
  }
  

  const getTitle = ():string => {
    if (props.quotationRowData){
      const quotationNo =props.quotationRowData?.quotationNo;
      return "Please find attached your Quote Summary "+quotationNo
    }
    return "Purchase Order"
  }
  return (
    <Modal title={'Email'} centered width={1000} visible={props.visible} onOk={props.onCancel} onCancel={cancelHandler} destroyOnClose={true} maskClosable={false} footer={null}>
      <Form onFinish={formFinishHandler}>
        <Row >
          <Col span={10}>
            <Form.Item
              label="Sender"
              name="SenderAddress"
              initialValue={props.rowData?.employeeEmail}
            >
              <Input placeholder="Sender"/>
            </Form.Item>
          </Col>
          <Col span={10} offset={2} >
            <Form.Item
              label="Receiver"
              name="TargetAddress"
              initialValue={props.rowData?.customerEmail}
            >
              <Input placeholder="Sender"/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Subject"
          name="Subject"
          initialValue={getTitle()}
        >
          <Input  placeholder={getTitle()}/>
        </Form.Item>
        <Editor
          editorState={editorState}
          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
            // inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: { alt: { present: true, mandatory: true },
              defaultSize: {
                height: '200px',
                width: '100px',
              }, },
            // image: {
            //     icon: image,
            //     className: undefined,
            //     component: undefined,
            //     popupClassName: undefined,
            //     urlEnabled: true,
            //     uploadEnabled: true,
            //     alignmentEnabled: true,
            //     uploadCallback: undefined,
            //     previewImage: false,
            //     inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            //     alt: { present: false, mandatory: false },
            //     defaultSize: {
            //         height: 'auto',
            //         width: 'auto',
            //     },
            // },
          }}
          toolbarClassName="toolbarClassName"
          // wrapperClassName="wrapperClassName"
          // editorClassName="editorClassName"
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          editorStyle={{height: 400, border: '1px solid #E0E0E0'}}
          onEditorStateChange={onEditorStateChange}

        />
        <a onClick={pdfShow}>PDF Download</a>
        <Form.Item {...tailLayout} >
          <Button type="primary" htmlType="submit">
                        Send
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EmailModal1
