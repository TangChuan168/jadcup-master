import React, {useEffect, useState} from 'react'
import { Button, Checkbox, Form, InputNumber, Modal, Row } from 'antd'
import SweetAlertService from '../../../../services/lib/utils/sweet-alert-service'
import productStickersPdfGenerate from '../../../static/pdf/product-stickers/product-stickers-pdf-generate'
import { ApiRequest } from '../../../../services/api/api'
import { commonFormSelect, getSelectOptions } from '../../../../components/common/common-form/common-form-select'
import { urlKey } from '../../../../services/api/api-urls'
import CommonForm, { ItemElementPropsInterface } from '../../../../components/common/common-form/common-form'
import { getUserId } from '../../../../services/lib/utils/auth.utils'
import {JadCupImg, emptyImg} from '../../../../services/others/assets'

export const AddToStockPrintQrModal = (props: {visible: any, onOk: any, onCancel: any}) => {
  const {onCancel, onOk} = props
  const [count, setCount] = useState<any>()
  const [isVisible, setIsVisible] = useState(false)
  const [barcodeOptions, setBarcodeOptions] = useState([])
  const [barcodeOptionsList, setBarcodeOptionsList] = useState([])
  const [barcodeCheckbox, setBarcodeCheckbox] = useState<any>()
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)
  const [base64, setBase64] = useState(String)
  const [productsOptions, setProductsOptions] = useState([])
  const [qtyPerPack, setQtyPerPack] = useState<any>()
  const [selectedProduct, setSelectedProduct] = useState<any>()
  const [data, setData] = useState<any>()

  const [initFormValues, setInitFormValues] = useState<any>()
  const [formRef, setFormRef] = useState<any>()
  const [formRef2, setFormRef2] = useState<any>()
  const [boxOptions, setBoxOptions] = useState([])
  const [plateOptions, setPlateOptions] = useState([])

  useEffect(() => {
    setIsVisible(props.visible)
  }, [props.visible])

  useEffect(() => {
    getSelectOptions('', 'Product/GetAllProduct?withOutStock=true').then(res => setProductsOptions(res))
  }, [])

  useEffect(() => {
    if (data) {
      getImg(data.product.logoType, data.product.logoUrl)
      ApiRequest({
        url: 'Plate/GetAvailablePlate',
        method: 'get',
        isShowSpinner: true
      }).then(resPlate => {
        setPlateOptions(resPlate.data.data.filter((row: any) => row.plateTypeId === data?.product?.plateTypeId))
      })
    }
  }, [data])

  const onGenerate = () => {
    if (count && qtyPerPack && selectedProduct) {
      ApiRequest({
        url: 'Box/GenerateBox?productId=' + selectedProduct + '&QtyPerPack=' + qtyPerPack + '&boxQty=' + count,
        method: 'post',
      }).then(res => {
        console.log(res)
        setCount(null)
        const responseData = res.data.data
        responseData.sort((a: any, b: any) => a.sequence - b.sequence)
        const barCodeArr: any = []
        setData({product: responseData[0].product})
        const barcodeOptionsData = responseData.map((row: any) => {
          barCodeArr.push(row.barCode)
          return {
            value: row.barCode,
            label: row.barCode
          }
        })
        setBarcodeOptionsList(barCodeArr)
        setBarcodeOptions(barcodeOptionsData)

        const formValues: any = []
        responseData.map((row: any) => {
          formValues.push({
            boxId: row.boxId,
            barCode: row.barCode,
            quantity: row.quantity,
            plateId: null
          })
        })
        console.log(formValues)
        setInitFormValues({
          plateBox: formValues
        })
        setBoxOptions(responseData)
      })
    } else {
      SweetAlertService.errorMessage('Please fill Count, Qty Per Package and Product.')
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
    if (logoType === 0) {
      setBase64(JadCupImg)
    } else if (logoType === 1 && logoUrl) {
        let imgUrl = JSON.parse(logoUrl.split('---')[0]).url
        getBase64FromUrl(imgUrl)
    } else {
      setBase64(emptyImg)
    }
  }

  const onPrint = async () => {
    const productDetail = ProductDetailInPdf()
    productStickersPdfGenerate(await productDetail, 'print')
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
    const madeInNz = (data.product.logoType !== 4) ? 'Made In New Zealand' : ''

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

      }
    })
    return productDetail
  }

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

  const onSubmit = async () => {
    if (!formRef) {
      return
    }
    formRef.submit()
    const formValues = await formRef.validateFields()
    if (formValues) {
      const plateBox = formValues.plateBox || []
      if (plateBox.filter((row: any) => !row.plateId && !row.isDelete).length) {
        SweetAlertService.errorMessage('Please assign all pallets.')
        return
      }
      console.log(plateBox)
      if (!plateBox.length) {
        SweetAlertService.errorMessage('Please add boxes firstly.')
        return
      }
      ApiRequest({
        url: 'PlateBox/AddAndUpdatePlateBoxAndBoxQuantity',
        method: 'put',
        data: {
          addList: [],
          updateList: plateBox,
          deleteBoxIdList: []
        }
      }).then(async _ => {
        const plateIds: any = []
        for (const plateBoxItem of plateBox) {
          if (!plateIds.includes(plateBoxItem.plateId)) {
            plateIds.push(plateBoxItem.plateId)
          }
        }
        // for (const plateId of plateIds) {
        //   await ApiRequest({
        //     url: 'TempZone/AddTempZoneOnlyId?plateId=' + plateId + '&employeeId=' + getUserId(),
        //     method: 'post',
        //     isShowSpinner: false
        //   })
        // }
        setQtyPerPack(null)
        setSelectedProduct(null)
        setBarcodeOptions([])
        setInitFormValues(null)
        onOk()
      })
    }
  }

  const formItems: ItemElementPropsInterface[] | any = [
    [
      {name: ['plateBox', 'boxId'], isNotEditable: true, label: 'Box Barcode', inputElement: commonFormSelect(urlKey.Box, boxOptions, ['barCode'], true)},
      {name: ['plateBox', 'plateId'], isNotEditable: true, label: 'Pallet', inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'], false)},
    ]
  ]

  const formItems2: any = [
    [
      {name: ['configurePlateBox', 'quantity'], span: 8, label: 'Configure Qty', rules: [{type: 'number', min: 0}], inputElement: <InputNumber />},
      {name: ['configurePlateBox', 'plateId'], label: 'Pallet', inputElement: commonFormSelect(urlKey.Plate, plateOptions, ['plateCode'])},
    ]
  ]

  const onFormChange = (changedValues: any, newValues: any, form: any) => null

  const onFormChange2 = (changedValues: any, newValues: any, form: any) => null

  const onFormBlur = (form: any) => {
    setFormRef(form)
  }

  const onFormBlur2 = (form: any) => {
    setFormRef2(form)
  }

  return (
    <Modal destroyOnClose={true} title="Add to stock" visible={isVisible} onCancel={onCancel} width={1000} footer={false}>
      <Row>
        <Form  >
          <Form.Item
            required={true} 
            label="Select Product" 
            wrapperCol={{ span: 24 }}
          >
            {commonFormSelect(urlKey.Product, productsOptions, ['productCode','productName'], false, (value: any) => setSelectedProduct(value))}
          </Form.Item>
          <Form.Item
            required={true}
            label="Qty Per Package"
          >
            <InputNumber value={qtyPerPack} onChange={(value: any) => setQtyPerPack(value)} />
          </Form.Item>
          <Form.Item
            required={true}
            label="BarCode Stickers Count"
          >
            <InputNumber value={count} min={1} max={500} onChange={(value: any) => setCount(value)} />
            <Button type="primary" disabled={!count || !selectedProduct || !qtyPerPack} style={{marginLeft: '1rem'}} onClick={onGenerate}>Generate new</Button>
          </Form.Item>
        </Form>
      </Row>
      <Row>
        <Form validateMessages={{required: 'required'}} id="printQrModalForm">
          <br/>
          <Form.Item label="Generated Barcode">
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              Check all (Checked Qty：{barcodeCheckbox?.length || 0})
            </Checkbox>
            <Checkbox.Group value={barcodeCheckbox} onChange={onChangeBarcodeCheckbox} options={barcodeOptions} />
            <Button type="primary" disabled={!barcodeCheckbox?.length} style={{margin: '1rem'}} onClick={onPrint}>Print</Button>
          </Form.Item>
        </Form>
        {barcodeCheckbox && <a onClick={pdfViewHandler}>PDF view</a>}
      </Row>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
        <Button
          onClick={onSubmit}
          type="primary"
        >Submit</Button>
      </div>
      <CommonForm items={formItems2} onFormChange={onFormChange2} onFormBlur={onFormBlur2} />
      <div style={{margin: '1rem 0'}}>
        <Button
          type="primary"
          onClick={() => {
            if (!formRef || !formRef2) {
              SweetAlertService.errorMessage('No form.')
              return
            }
            const plateBox = formRef.getFieldsValue()?.plateBox || []
            const configurePlateBox = formRef2.getFieldsValue()?.configurePlateBox || []
            const newConfigurePlateBox: any = []
            let index = 0
            for (const configurePlateBoxItem of configurePlateBox) {
              for (let i = 0; i < configurePlateBoxItem.quantity; i++) {
                newConfigurePlateBox.push({
                  i: index,
                  plateId: configurePlateBoxItem.plateId
                })
                index++
              }
            }
            const newPlateBox = plateBox.map((row: any, i: any) => {
              if (i < newConfigurePlateBox.length) {
                return {
                  ...row,
                  plateId: newConfigurePlateBox[i].plateId
                }
              }
              return row
            })
            formRef.setFieldsValue({
              plateBox: newPlateBox
            })
          }}
        >Confirm Pallet Configure</Button>
      </div>
      <CommonForm items={formItems} onFormChange={onFormChange} onFormBlur={onFormBlur} initFormValues={initFormValues} />
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
        <Button
          onClick={onCancel}
          style={{marginRight: '2rem'}}
        >Cancel</Button>
        <Button
          onClick={onSubmit}
          type="primary"
        >Submit</Button>
      </div>
    </Modal>
  )
}
