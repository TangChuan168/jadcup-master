import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'

interface CommonDialogPropsInterface {
	open: boolean
	onDialogClose: any
	dialogContent: any
	title: any
  width?:string
}

const CommonDialog = (props: CommonDialogPropsInterface) => {
  const [open, setOpen] = useState(props.open)

  useEffect(() => {
	  setOpen(props.open)
  }, [props.open])

  const onClose = () => {
	  props.onDialogClose(false)
  }

  return (
	  <Modal
      title={props.title || ''}
      centered={true}
      width={props.width?props.width:"98%"}
      style={{marginTop: '1rem', maxWidth: '1800px'}}
      visible={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      closeIcon={<CloseCircleOutlined style={{fontSize: '1.5rem', marginRight: '2rem'}} />}
	  >
      {props.dialogContent}
	  </Modal>
  )
}

export default CommonDialog
