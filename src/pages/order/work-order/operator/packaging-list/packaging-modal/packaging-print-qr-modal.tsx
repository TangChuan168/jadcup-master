import React, {useEffect, useState} from 'react'
import {ApiRequest} from '../../../../../../services/api/api'
import {JadCupImg, emptyImg} from '../../../../../../services/others/assets'
import {Button, Checkbox, Form, InputNumber, Modal, Row} from 'antd'
import {SuborderCommonPresentation} from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-presentation'
import { checkMachineUserName } from '../../suborder-list/suborder-modal/suborder-common-modal/suborder-common-modal'
import productStickersPdfGenerate from '../../../../../static/pdf/product-stickers/product-stickers-pdf-generate'
import SweetAlertService from '../../../../../../services/lib/utils/sweet-alert-service'

export const PackagingPrintQrModal = (props: {visible: any, onOk: any, onCancel: any, data: any, machine: any, isNotRequiredPassword: boolean}) => {
  const {visible, onOk, onCancel, data, machine} = props
  const [count, setCount] = useState<any>()
  const [isVisible, setIsVisible] = useState(false)
  const [barcodeOptions, setBarcodeOptions] = useState([])
  const [barcodeOptionsList, setBarcodeOptionsList] = useState([])
  const [allBoxData, setAllBoxData] = useState<any>([])
  const [barcodeCheckbox, setBarcodeCheckbox] = useState<any>()
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [base64, setBase64] = useState(String)

  useEffect(() => {
    if (!visible) {
      setIsVisible(false)
      return
    }
    if (props.isNotRequiredPassword && visible) {
      setIsVisible(true)
      return
    }
    if (!props.isNotRequiredPassword) {
      checkMachineUserName(visible, machine, setIsVisible, onCancel)
    }
  }, [props.visible])

  useEffect(() => {
    if (data?.suborderId) {
      setBarcodeOptions([])
      setBarcodeOptionsList([])
      setAllBoxData([])
      setBarcodeCheckbox(null)
      setIndeterminate(true)
      setCheckAll(false)
      setBase64(String)
      console.log(data)
      console.log(data.product?.baseProduct?.packagingType?.quantity)
      const calcCount = data.receivedQuantity / (data.product?.baseProduct?.packagingType?.quantity || 999999999)
      setCount(Math.ceil(calcCount))
      getBarcodeFromApi(Math.ceil(calcCount))
      getImg(data.product.logoType, data.product.logoUrl)
    }
  }, [data])

  const getBarcodeFromApi = (value?: any) => {
    if (data?.suborderId) {
      ApiRequest({
        url: 'Box/GetAllBox?suborderId=' + data.suborderId,
        method: 'get'
      }).then(res => {
        const responseData = res.data.data
        setAllBoxData(responseData)
        responseData.sort((a: any, b: any) => a.sequence - b.sequence)
        const barCodeArr: any = []
        const barcodeOptionsData = responseData.map((row: any) => {
          barCodeArr.push(row.barCode)
          return {
            value: row.barCode,
            label: row.barCode
          }
        })
        setBarcodeOptionsList(barCodeArr)
        setBarcodeOptions(barcodeOptionsData)
        if (value && !responseData.length) {
          onGenerate(value, true)
        }
      })
    }
  }

  const onGenerate = async (value?: any, notConfirm?: boolean) => {
    if (!notConfirm) {
      const result = await SweetAlertService.confirmMessage()
      if (!result) {
        return
      }
    }
    if (data.suborderId && (value || count)) {
      ApiRequest({
        url: 'Box/GenerateBarCode?suborderId=' + data.suborderId + '&count=' + (notConfirm ? value : count),
        method: 'post',
      }).then(res => {
        console.log(res)
        getBarcodeFromApi()
      })
    }
  }

  const getBase64FromUrl = (url: string) => {
    ApiRequest({
      url: 'Common/UrltoBase64?imageFile=' + url,
      method: 'get'
    }).then(res => {
      const responseData = res.data
      setBase64('data:image/png;base64,' + responseData)
    })
  }

  const getImg = (logoType:number, logoUrl:string) => {
    if (logoType == 0) {
      setBase64(JadCupImg)
    } else if (logoType == 1) {
      const imgUrl = JSON.parse(logoUrl.split('---')[0]).url
      getBase64FromUrl(imgUrl)
    } else {
      setBase64(emptyImg)
    }
  }

  const onPrint = async () => {
    const productDetail = ProductDetailInPdf()
    productStickersPdfGenerate(await productDetail, 'print')
  }

  const onDelete = async () => {
    const confirmResult = await SweetAlertService.confirmMessage()
    if (!confirmResult) {
      return
    }
    // console.log(barcodeCheckbox)
    // console.log(barcodeOptions)
    // console.log(barcodeOptionsList)
    const boxids = []
    for (const row of allBoxData) {
      if (barcodeCheckbox.includes(row.barCode)) {
        boxids.push(row.boxId)
      }
    }
    await ApiRequest({
      url: 'Box/DeleteBox',
      method: 'put',
      data: boxids
    })

    getBarcodeFromApi()
  }

  const pdfViewHandler = async () => {
    const productDetail = ProductDetailInPdf()
    productStickersPdfGenerate(await productDetail, 'view')
  }

  const ProductDetailInPdf = async () => {
    const product = data.product.productName
    const logoType = data.product.logoType
    const logoUrl = data.product.logoUrl
    const productCode = data.product.productCode
    const packaging = 'QTY:' + data.product?.baseProduct?.packagingType?.sleeveQty + 'PCS X '
                    + data.product?.baseProduct?.packagingType?.sleevePkt + 'PK'
    const madeInNz = (data.product.logoType != 4) ? 'Made In New Zealand' : ''

    const productDetail = barcodeCheckbox.map((res:string) => {
      return {
        barcode: res,
        productName: product,
        logoType: logoType,
        logoUrl: logoUrl,
        logoBase64: base64,
        productCode: productCode,
        packaging: packaging,
        madeInNz: madeInNz,
        testLog: JadCupImg,
        manufactureDate:null
      }
    })
    return productDetail
  }
  const onChangeCount = (value: any) => setCount(value)

  const onChangeBarcodeCheckbox = (list: any) => {
    setBarcodeCheckbox(list)
    setIndeterminate(!!list.length && list.length < barcodeOptionsList.length)
    setCheckAll(list.length === barcodeOptionsList.length)
  }

  const onCheckAllChange = (e: any) => {
    setBarcodeCheckbox(e.target.checked ? barcodeOptionsList : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const onCancelModal = () => {
    onCancel()
    setIsVisible(false)
  }

  const onConfirmModal = () => {
    onOk()
    setIsVisible(false)
  }

  return (
    <Modal destroyOnClose={true} title="打印条形码/Print QR" visible={isVisible} onCancel={onCancel} width={1000} footer={false}>
      <SuborderCommonPresentation data={data} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button
          onClick={onOk}
          type="primary"
        >确定/Confirm</Button>
      </div>
      <Row>
        <Form validateMessages={{required: 'required'}} id="printQrModalForm">
          <br/>
          <Form.Item label="条形码数量/BarCode Stickers Count">
            <InputNumber value={count} min={1} max={500} onChange={onChangeCount} />
            <Button type="primary" disabled={!count} style={{marginLeft: '1rem'}} onClick={onGenerate}>生成/Generate new</Button>
          </Form.Item>
          <Form.Item label="已生成/Generated Barcode">
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              全选/Check all (勾选数量：{barcodeCheckbox?.length || 0})
            </Checkbox>
            <Checkbox.Group value={barcodeCheckbox} onChange={onChangeBarcodeCheckbox} options={barcodeOptions} />
            <Button type="primary" disabled={!barcodeCheckbox?.length} style={{margin: '1rem'}} onClick={onPrint}>打印/Print</Button>
            <Button type="primary" danger disabled={!barcodeCheckbox?.length} style={{margin: '1rem'}} onClick={onDelete}>删除/Delete</Button>
          </Form.Item>
        </Form>
        {barcodeCheckbox && <a onClick={pdfViewHandler}>PDF view</a>}
      </Row>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >取消/Cancel</Button>
        <Button
          onClick={onOk}
          type="primary"
        >确定/Confirm</Button>
      </div>
    </Modal>
  )
}
