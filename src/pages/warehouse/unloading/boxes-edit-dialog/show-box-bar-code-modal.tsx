import { BarcodeOutlined } from "@ant-design/icons";
import { Button, Modal,Row,Col } from "antd";
import React, { useEffect, useState } from "react";
import { ApiRequest } from "../../../../services/api/api";
import { emptyImg, JadCupImg } from "../../../../services/others/assets";
import productStickersPdfGenerate from "../../../static/pdf/product-stickers/product-stickers-pdf-generate";

const ShowBoxBarCodeModal = (props: {
  boxBarCodeModalVisible: boolean;
  closeModal: any;
  groupArray: any;
}) => {
  const {groupArray} = props
  const [base64, setBase64] = useState(String)  
  const [data, setData] = useState<any>()    
  const [prod, setProd] = useState<any>()  

  useEffect(() => {
      setBase64(String)
      if (!groupArray) return
      let prodid = groupArray[0]?.key?.product?.productId;
      if (!prodid) return
      // setProd();
      ApiRequest({
        url: 'Product/GetProductById?Id=' +prodid,
        method: 'get'
      }).then(res => {
        const responseData = res.data.data
        setProd(responseData);
        getImg(responseData.logoType, responseData.logoUrl)
      //  getImg(data.product.logoType, data.product.logoUrl)
      })
  }, [groupArray])  

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
  const getBase64FromUrl = (url: string) => {
    ApiRequest({
      url: 'Common/UrltoBase64?imageFile=' + url,
      method: 'get'
    }).then(res => {
      const responseData = res.data
      setBase64('data:image/png;base64,' + responseData)
    })
  }

  const ProductDetailInPdf = async () => {
    const product = prod.productName
    const logoType = prod.logoType
    const logoUrl = prod.logoUrl
    const productCode = prod.productCode
    const packaging = 'QTY:' + prod?.baseProduct?.packagingType?.sleeveQty + 'PCS X '
                    + prod?.baseProduct?.packagingType?.sleevePkt + 'PK'
    const madeInNz = (prod.logoType != 4) ? 'Made In New Zealand' : ''

    const productDetail =  props.groupArray.map((item:any) => {
      return {
        barcode: item.title.barCode,
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
  const onPrint = async () => {
    const productDetail = ProductDetailInPdf()
    productStickersPdfGenerate(await productDetail, 'view')
  }
  return (
    <Modal
      width={800}
      destroyOnClose={true}
      visible={props.boxBarCodeModalVisible}
      closable={false}
      footer={[
        <Button key="submit" type="primary" onClick={props.closeModal}>
          Close
        </Button>,
        prod && <Button key="" type="primary" onClick={onPrint}>
          Print
        </Button>
      ]}
    >
      <h3>List of Bar Code</h3>
      <div >
        <Row>
        {props.groupArray?.map((item: any) => (
          item.title.boxCode ?
            <Col span={6} key={item.title.boxCode}><BarcodeOutlined style={{ fontSize: '16px', color: '#08c' }}/>{item.title.boxCode}</Col> :
            <Col span={6} key={item.title.barCode}><BarcodeOutlined style={{ fontSize: '16px', color: '#08c' }}/>{item.title.barCode}</Col>
        ))}
        </Row>
      </div>
    </Modal>
  );
};

export default ShowBoxBarCodeModal;

