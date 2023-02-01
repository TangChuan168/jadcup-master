import pdfMake from 'pdfmake/build/pdfmake'
// import vfsFonts from 'pdfmake/build/vfs_fonts'
import { quotaImg } from '../../../../services/others/assets'
import  moment  from 'moment'

export default async (data:any, require:string, getBlob:any) => {
  console.log(data)
  const vfsFonts = await import("pdfmake/build/vfs_fonts");  
  const {vfs} = vfsFonts.pdfMake
  pdfMake.vfs = vfs

  const tableArrRender = () => {
    return Object.keys(data.tableContent).map((row: any) => (
      [
        {
          fontSize: 7,
          lineHeight: 2,
          layout: 'lightHorizontalLines',
          fillColor: '#e1efdb',
          table: {
            bold: false,
            widths: [1, 45, 225, 110, 40, 40, 40, 40, 40,1],
            body: [
              [
                {text: '', fillColor: '#335627'},
                {text: row, bold: true, colSpan: 8, fontSize: 12, alignment: 'center', color: 'white', lineHeight: 1, fillColor: '#335627'},
                {text: '', fillColor: '#335627'},
                {text: '', fillColor: '#335627'},
                {text: '', fillColor: '#335627'},
                {text: '', fillColor: '#335627'},
                {text: '', fillColor: '#335627'},
                {text: '', fillColor: '#335627'},
                {text: '', fillColor: '#335627'},                
                {text: '', fillColor: '#335627'},
              ],
              [
                {text: '', bold: true, fontSize: 8},
                {text: 'Item Code', bold: true, fontSize: 8},
                {text: 'Product Description', bold: true, fontSize: 8},
                {text: 'Raw Material', bold: true, fontSize: 8},
                {text: 'Sleeve/Pkt', bold: true, fontSize: 8},
                {text: 'Sleeve Qty', bold: true, fontSize: 8},
                {text: 'Carton Qty', bold: true, fontSize: 8},
                {text: 'MOQ', bold: true, fontSize: 8,alignment: 'center'},
                {text: 'Price\n Per Carton', bold: true, fontSize: 8, lineHeight: 1, alignment: 'center'},
                {text: '', bold: true, fontSize: 8},
              ],
              ...table(data.tableContent[row]),
            ]
          },
        }
      ]
    ))
  }

  const optionContent = options(data)

  //for test data
  // const data1 = table1(20)
  // const formattedData = _format(data1)

  const documentDefinition:any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [60, 60, 60, 60],
    info: {
      title: data.tradingName+'_'+data.quotationNo,
      author: 'Jadcup',
      subject: data.tradingName+'_'+data.quotationNo,
      keywords: 'Jadcup',
    },  
    // Page Layout

    content: {

      // This table will contain ALL content
      table: {
        // Defining the top 2 rows as the "sticky" header rows
        headerRows: 0,
        // One column, full width
        widths: ['*'],
        // heights: [80, 100, 60],
        body: [

          // Header Row One
          // An array with just one "cell"
          [
            // Just because I only have one cell, doesn't mean I can't have
            // multiple columns!
            {
              fontSize: 7,
              columns: [

                {
                  type: 'none',
                  ul: [
                    { text: ' ', alignment: 'left', bold: true, fontSize: 19},
                    { text: 'Prepared for ' + data.tradingName, alignment: 'left', bold: true, fontSize: 19},
                    { text: `Date: ${data.quoteDate ?  moment.utc(data.quoteDate).local().format('DD/MM/YYYY')  : ' '}`, alignment: 'left' },
                    { text: `Quote No: ${data.quotationNo ? data.quotationNo : ' '}`, alignment: 'left' },
                    { text: `Valid Date: ${data.validDate ? moment.utc(data.validDate).local().format('DD/MM/YYYY') : ' '}`, alignment: 'left' },
                    { text: ' ', alignment: 'left', bold: true, fontSize: 26},
                  ]
                },
                {
                  image: quotaImg,
                  width: 300,
                  // height: 40,
                },
              ]
            }
          ],
          ...tableArrRender(),

          [
            {
              type: 'none',
              ul: [
                { text: ' ', fontSize: 13},
                { text: 'Note: ', fontSize: 7},
                ...optionContent
              ]
            },
          ]

        ]
      },
      layout: 'noBorders'
    },

    // Page Footer

    footer: function(currentPage:any, pageCount:any) {
      if (currentPage === pageCount) {
        return {
          alignment: 'center',
          lineHeight: 1.2,
          text: 'Email: ' + data.employee.email + '       Phone: +64 9 282 3988        www.jadcup.co.nz \nAdd: 4 Pukekiwiriki Pl, East Tamaki, Auckland 2013, New Zealand',
          fontSize: 8
        }
      }
    },

    // pageBreakBefore: function(currentNode:any, followingNodesOnPage:any, nodesOnNextPage:any, previousNodesOnPage:any) {
    //     return currentNode.headlineLevel === 0 ;
    // },
  }

  if (require === 'getBlob') {
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition)
    pdfDocGenerator.getBlob((blob) => {
      console.log(blob, 'blob')
      getBlob(blob)
    })
  }
  if (require === 'print') {
    pdfMake.createPdf(documentDefinition).open()
  }
}

const table = (data:any) => {
  console.log(data)
  return data.map((res:any) => {
    // console.log(res)
    if (res.baseProduct) {
      return [
        '',
        res.baseProduct.productCode,
        `${res.productName} ${res.description ? res.description : ''}`,
        // res.productName || res.baseProductName,
        // res.description,
        res.baseProduct.rawmaterialDesc,
        {text: res.baseProduct.packagingType.sleevePkt, alignment: 'center'},
        {text: res.baseProduct.packagingType.sleeveQty, alignment: 'center'},
        {text: res.baseProduct.packagingType.quantity, alignment: 'center'},
        {text: res.baseProduct.notes2, alignment: 'center'},
        {text: `$${res.price}`, alignment: 'center'},
        '',
      ]
    }

    return [
      '',
      res.productCode,
      `${res.itemDesc ? res.itemDesc : ''} ${res.baseProductName}`,
      // res.productName || res.baseProductName,
      // res.description,
      res.rawmaterialDesc,
      {text: res.packagingType?.sleeveQty, alignment: 'center'},
      {text: res.packagingType?.sleevePkt, alignment: 'center'},
      {text: res.packagingType?.quantity, alignment: 'center'},
      {text: res.notes2, alignment: 'center'},
      {text: `$${res.price}`, alignment: 'center'},
      ''
    ]
  })
}

const options = (data:any) => {
  return data.options.map((res:any) => {
    return { text: res, fontSize: 7}
  })
}

//for test
// const table1 = (data:any) => {
//   const io = []
//   for (let i = 0; i < data; i++) {
//     io.push({product: `inini${i}`, description: `adsdada${i}`, carton: `${i}`, quantity: `${i}`, a: `${i}`, b: `${i}`, c: `${i}`, d: `${i}`})
//   }
//   // console.log(io)
//   return io
//
// }
//
// const _format = (data:any) => {
//   console.log(data)
//   return data.map((item:any) => {
//     return [item.product,
//       item.description,
//       item.carton,
//       item.quantity,
//       item.a,
//       item.b,
//       ' ',
//       item.c
//     ]
//   })
// }
