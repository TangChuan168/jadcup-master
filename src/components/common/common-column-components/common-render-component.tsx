import React from 'react'
import { imgStringToArray } from './common-edit-image-component'
import { Upload } from 'antd'
import { nbsStr } from '../../../services/lib/utils/helpers'

interface CommonRenderComponentPropsInterface {
  formItems: any
  restFormItems?: any
}

const CommonRenderComponent = (props: CommonRenderComponentPropsInterface):any => {
  return (
    <div>
      {
        props.formItems.map((row: any, index: number) => {
          return (
            row.type === 'image' ?
              <div key={index}>
                <Upload
                  listType="picture-card"
                  fileList={[...imgStringToArray(row.value)]}
                  disabled
                >
                </Upload>
              </div>
              :
              (row?.value === 0 || row?.value) && (
                <div key={index}>
                  {row.label.replace(/\s/, '\u00a0') ? (
                    <span>
                      <b>
                        {nbsStr(row.label.replace(/\s/, '\u00a0'), row.isNotCutting)}:
                      </b>
                        &nbsp;
                    </span>
                  ) : null}
                  {nbsStr(row.value, row.isNotCutting)}
                </div>
              )
          )
        })
      }
      { props.restFormItems?.map((row: any) => row)}
    </div>
  )
}

export default CommonRenderComponent
