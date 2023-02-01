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
import { ApiRequest } from '../../../services/api/api'
import SweetAlertService from '../../../services/lib/utils/sweet-alert-service'
import { getCookie } from 'react-use-cookie'

const { TextArea } = Input

const tailLayout = {
  wrapperCol: { offset: 22 },
}

const EmailModals = (props:{visible:boolean, onCancel:()=>void, EmailList:any}) => {

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )
  useEffect(() => {
    ApiRequest({
      url: 'EmailTemplate/GetTemplateById?Id=' + 1,
      method: 'get',
      isShowSpinner: false,
    }).then(res => {
      const html = res.data.data.content;
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }).catch(e => {
      const html = "";
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      };
    }
    )
  }, [props.visible])

  const formFinishHandler = (values: any) => {
    console.log('Success:', values)
    
    const formData = new FormData()

    formData.append('SenderName', 'Jadcup')
    formData.append('SenderAddress', values.SenderAddress)
    // formData.append('TargetName', 'Quotation')
    formData.append('TargetAddress', values.TargetAddress)
    formData.append('Subject', values.Subject)
    formData.append('HtmlContent', draftToHtml(convertToRaw(editorState.getCurrentContent())))

    sendEmail(formData).then((res:any) => {
        if (res.data.isSuccessStatusCode==false){
          SweetAlertService.errorMessage("Send emal fail!");
      }      
      console.log(res)
      props.onCancel()
    })
  }
  const onEditorStateChange = (editorState12:any) => {
    setEditorState(editorState12)
  }

  const cancelHandler = () => {
    setEditorState(EditorState.createEmpty())
    props.onCancel()
  }

  const getTitle = ():string => {
    return "Upcomming Price Change"
  }
  const getRecieverEmail = ():string => {
    if (props.EmailList.length >0){
      console.log(props.EmailList?.join(';'));
      return props.EmailList?.join(';')
    }
    return props.EmailList
  }  
  return (
    <Modal title={'Email'} centered width={1000} visible={props.visible} onOk={props.onCancel} onCancel={cancelHandler} destroyOnClose={true} maskClosable={false} footer={null}>
      <Form onFinish={formFinishHandler}>
        <Row >
          <Col span={10}>
            <Form.Item
              label="Sender"
              name="SenderAddress"
              initialValue={getCookie('email')}
            >
              <Input placeholder="Sender" />
            </Form.Item>
          </Col>
          <Col span={10} offset={2} >
            <Form.Item
              label="Subject"
              name="Subject"
              initialValue={getTitle()}
            >
              <Input placeholder={getTitle()} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Receiver"
          name="TargetAddress"
          initialValue={getRecieverEmail()}
        >
          <TextArea showCount={true} maxLength={3000} autoSize={ true } placeholder="Sender" />
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
          }}
          toolbarClassName="toolbarClassName"
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          editorStyle={{height: 400, border: '1px solid #E0E0E0'}}
          onEditorStateChange={onEditorStateChange}

        />
        <div></div>
        <Form.Item {...tailLayout} >
          <Button type="primary" htmlType="submit">
                        Send
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EmailModals
