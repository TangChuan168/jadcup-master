import React from 'react'
import { Image } from 'antd'

const getImage = (imgSrc: any) => {
  if (imgSrc) {
    return (
      imgSrc.split('---').map((row: any, index: number) => (
        <Image
          key={index.toString()}
          style={{cursor: 'zoom-in'}}
          width={100}
          src={JSON.parse(row).url}
        />
      ))

    )
  }
  return null
}

export default getImage
