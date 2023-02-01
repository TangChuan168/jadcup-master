import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import React from 'react'
import {baseUrl} from '../../../services/api/base-url'

export const imgStringToArray = (str:any) => {
  if (!str || !str.includes('url')) {
    return []
  }

  return str.split('---').map((row:any) => JSON.parse(row))
}

export const imgArrayToString = (arr:any) => {
  return arr.map((row:any) => JSON.stringify(row)).join('---')
}

interface CommonEditImageComponentPropsInterface {
  formItems: any,
  propsFn: any
}

const CommonEditImageComponent:React.FC<CommonEditImageComponentPropsInterface> = (props:any) => {

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
  }

  return (
    <>
      <Upload
        action= {baseUrl + 'Common/UploadImage'}
        name="imageFile"
        multiple
        listType="picture"
        defaultFileList={[...imgStringToArray(props.formItems.value)]}
        onChange={onUploadChange}
        onRemove={(file:any) => {
          if (!file.response && file.url) {
            const imgUrls = imgStringToArray(props.formItems.value)
            const resultImgUrls = imgUrls.filter((row:any) => row.url !== file.url)
            props.propsFn.onChange(imgArrayToString(resultImgUrls))
          }
        }}
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </>
  )
}

export default CommonEditImageComponent
