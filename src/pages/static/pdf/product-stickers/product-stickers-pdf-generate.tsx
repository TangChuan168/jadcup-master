import pdfMake from 'pdfmake/build/pdfmake'
// import vfsFonts from 'pdfmake/build/vfs_fonts'
import JsBarcode from 'jsbarcode'
import moment from  'moment'
interface Data {
    barcode: string,
    productName: string,
    logoType:number,
    logoUrl:string,
    logoBase64:string,
    productCode:string,
    packaging:string,
    madeInNz:string,
    testLogo:string
    manufactureDate?:Date
}
// const JadCupImg = 'data:image/png;base64,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';
//delete
export default async (data:Data[], required:string) => {
  const vfsFonts = await import("pdfmake/build/vfs_fonts");
  const {vfs} = vfsFonts.pdfMake
  pdfMake.vfs = vfs
  // const testTable1 = tables(data)
  const testTable = contents(data)

  const documentDefinition:any = {
    pageSize: {
      width: 290,
      height: 435
    }, //设置page的长和高
    // pageOrientation: 'landscape',
    content: [
      ...testTable,
    ],
    pageMargins: [ 20, 20, 20, 10 ],
    pageBreakBefore: function(currentNode:any, followingNodesOnPage:any, nodesOnNextPage:any, previousNodesOnPage:any) {
      return currentNode.headlineLevel === 0
    },
  }

  if (required === 'print') {
    console.log(documentDefinition)
    pdfMake.createPdf(documentDefinition).print({})
  }
  if (required === 'view') {
    pdfMake.createPdf(documentDefinition).open()
  }

}

const textToBase64Barcode = (text:string) => {
  const canvas = document.createElement('canvas')
  JsBarcode(canvas, text, {displayValue: false})
  return canvas.toDataURL('image/png')
}

const getcurrntDate = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  const yyyy = today.getFullYear()
  return dd + '/' + mm + '/' + yyyy
}
const getfirstPart = (text:string) => {
  if (text.length < 40) {
    return text
  }
  const half = Math.ceil((text.length) / 2)
  let i
  for (i = half; i > 0; i--) {
    if (text.substring(i, i + 1) == ' ') {
      break
    }
  }
  return text.substring(0, i)
}
const getSecondPart = (text:string) => {
  if (text.length < 40) {
    return ''
  }
  const half = Math.ceil((text.length) / 2)
  let i
  for (i = half; i > 0; i--) {
    if (text.substring(i, i + 1) == ' ') {
      break
    }
  }
  return text.substring(i + 1, text.length)
}

const contents = (table:any) => {
  const ret:object[] = []
  table.map((item:any, index:number) => {
    ret.push(
      {
        layout: 'noBorders',
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          body: [
            [
              {
                // fit: [150, 150],
                margin: [10, 0, 0, 0],
                width: 130,
                height: 130,
                // image:item.testLog
                image: item.logoBase64
              }
              , {
                alignment: 'center',
                margin: [8, 45, 0, 0],
                fontSize: 15,
                text: 'Product Code\n' + item.productCode
              }
            ],
          ]
        }
      }
    )
    ret.push({
      alignment: 'center',
      text: item.productName,
      fontSize: 15,
      noWrap: false,
      margin: [0, 15, 0, 0],
      bold: true
    })

    ret.push({
      alignment: 'center',
      text: item.packaging,
      fontSize: 15,
      margin: [0, 25, 0, 0],
      bold: true
    })
    ret.push({
      alignment: 'center',
      image: textToBase64Barcode(item.barcode),
      margin: [0, 5, 0, 0], //barcode的margin
      width: 240,
      height: 70
    })
    ret.push({
      alignment: 'center',
      text: item.barcode,
      fontSize: 15,
      margin: [0, 0, 0, 0],
      // absolutePosition: {x:400, y:250}
    })
    let  madeDate=item.manufactureDate?
    moment.utc(item.manufactureDate).local().format('DD/MM/YYYY'):getcurrntDate();
    ret.push({
      alignment: 'center',
      text: 'Date of manufacture: ' +madeDate,
      fontSize: 12,
      margin: [0, 10, 0, 0],
      // absolutePosition: {x:400, y:250}
    })
    ret.push({
      alignment: 'center',
      text: item.madeInNz,
      fontSize: 23,
      margin: [0, 8, 0, 0],
      bold: true
      // absolutePosition: {x:400, y:250}
    })

  })
  return ret

}
const tables = (table:any) => {
  return table.map((item:any, index:number) => {
    let pageBreakNode:any = 1
    if (index >= 1) {
      pageBreakNode = 0
    }
    return {

      style: 'tableExample',
      color: '#555',
      // pageMargins: [ 0, 20, 0, 20 ],
      // margin: [0, 5, 0, 5],
      // headlineLevel: pageBreakNode,
      width: '*',
      table: {
        body: [
          [
            {
              type: 'none',
              ul: [
                {columns: [
                  {
                    alignment: 'center',
                    image: item.logoBase64,
                    width: 50,
                    height: 50,
                    // margin: [10, 5, 0, 5] //logo的margin
                  }
                ],
                columnGap: 80
                },
                // {
                //     // If no width/height/fit is used, then dimensions from the svg element is used.
                //     svg: '<svg height="60" width="300">' +
                //         '<text x="150" y="30" font-size="50" alignment-baseline="middle" text-anchor="middle" font-weight=\'bold\'\n' +
                //         '>' +
                //         'JadCup' +
                //         '</text>' +
                //         '</svg>'
                // },
                {
                  // If no width/height/fit is used, then dimensions from the svg element is used.
                  svg: '<svg height="20" width="200">' +
                                        '<text x="150" y="10" font-size="14" alignment-baseline="middle" text-anchor="middle" font-weight=\'bold\'\n' + '>' +
                                        `${getfirstPart(item.productName)}` +
                                        '</text>' +
                                        '</svg>'
                },
                {
                  // If no width/height/fit is used, then dimensions from the svg element is used.
                  svg: '<svg height="20" width="200">' +
                                        '<text x="150" y="10" font-size="14" alignment-baseline="middle" text-anchor="middle" font-weight=\'bold\'\n' + '>' +
                                        `${getSecondPart(item.productName)}` +
                                        '</text>' +
                                        '</svg>'
                },
                {
                  image: textToBase64Barcode(item.barcode),
                  margin: [60, 0, 60, 0], //barcode的margin
                  width: 180,
                  height: 80
                },
                {
                  // If no width/height/fit is used, then dimensions from the svg element is used.
                  svg: '<svg height="20" width="200">' +
                                        '<text x="150" y="10" font-size="13" alignment-baseline="middle" text-anchor="middle" font-weight=\'bold\'\n' + '>' +
                                        item.barcode +
                                        '</text>' +
                                        '</svg>'
                },
                {
                  // If no width/height/fit is used, then dimensions from the svg element is used.
                  svg: '<svg height="20" width="200">' +
                                        '<text x="150" y="10" font-size="15" alignment-baseline="middle" text-anchor="middle" font-weight=\'bold\'\n' + '>' +
                                        'Date of manufacture:' + getcurrntDate() +
                                        '</text>' +
                                        '</svg>'
                },

                {
                  // If no width/height/fit is used, then dimensions from the svg element is used.
                  svg: '<svg height="20" width="200">' +
                                        '<text x="150" y="10" font-size="17" alignment-baseline="middle" text-anchor="middle" font-weight=\'bold\'\n' + '>' +
                                        'Crafted in New Zealand' +
                                        '</text>' +
                                        '</svg>'
                },
              ]
            },
          ],
        ],
      },
    }
  })
}
