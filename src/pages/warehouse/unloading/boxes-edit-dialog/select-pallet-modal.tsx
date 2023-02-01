import { Button, Form, Modal } from 'antd'
import React from 'react'
import { commonFormSelect } from '../../../../components/common/common-form/common-form-select'
import { urlKey } from '../../../../services/api/api-urls'

const SelectPalletModal = (props: {
  selectPalletModalVisible: boolean
  submitModal: any
  closeModal: any
  plateOptions: any
  selectedPlate: any
  setSelectedPlate: any
  canGenerate?: any
  onNewTemporaryPlate?: any
}) => {
  return (
    <Modal
      width={800}
      destroyOnClose={true}
      closable={false}
      visible={props.selectPalletModalVisible}
      footer={[
        <Button
          type='primary' key='submit'
          disabled={!props.selectedPlate}
          onClick={props.submitModal}
        >
          Confirm
        </Button>,
        <Button type='primary' key='close' danger onClick={props.closeModal}>
          Cancel
        </Button>,
      ]}
    >
      <Form>
        <Form.Item
          style={{ width: '50%' }}
          name='plate'
          label='Batch change pallet'
        >
          {commonFormSelect(
            urlKey.Plate,
            props.plateOptions,
            ['plateCode'],
            false,
            (value: any) => {
              props.setSelectedPlate(value)
            }
          )}
        </Form.Item>
        {props.canGenerate && (
          <Form.Item><Button type="primary" style={{marginTop: '1rem'}} onClick={props.onNewTemporaryPlate}>Generate Pallet</Button></Form.Item>)}
      </Form>
    </Modal>
  )
}

export default SelectPalletModal
