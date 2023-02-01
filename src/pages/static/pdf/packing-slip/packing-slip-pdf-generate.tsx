import pdfMake from 'pdfmake/build/pdfmake'
// import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
// import vfsFonts from 'pdfmake/build/vfs_fonts'
import { logo2Img } from '../../../../services/others/assets'

export default async (data:any,require?:string, getBlob?:any,filename?:string) => {
  // console.log(data)
  const orderNo = data.packingSlipNo
  const deliveredAt = data.deliveredAt
  const deliveryName = data.customer.deliveryName
  const outstanding = data.outstanding
  const employee = data.employee?data.employee:""
  const comments = !data.customer.warehouseNote ? '' : data.customer.warehouseNote
  const vfsFonts = await import("pdfmake/build/vfs_fonts");

  
  pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    },
    weiruanyahei: {
        normal: '微软雅黑.ttf',
        bold: '微软雅黑.ttf',
        italics: '微软雅黑.ttf',
        bolditalics: '微软雅黑.ttf'
    }
  }
  const {vfs} = vfsFonts.pdfMake
  pdfMake.vfs = vfs

  const tableWidth = [100, 290,  '*', '*',30]
  const contents = table(data)
  const content2 = tableOutstanding(outstanding)
  const formatDate = (date:String) => {
    const today = date
    if (!today) return ;
    const dd = date.substr(8,2);
    const mm = date.substr(5,2);
    const yyyy = date.substring(0,4);
    return dd + '/' + mm + '/' + yyyy
  }
  const getCurDate = () => {
    const da = new Date();
    var year = da.getFullYear();
    var month = da.getMonth()+1;
    var date = da.getDate();
    return date+'/'+month+'/'+year; 
  }
  const getNumber = (data:any) => {
    let ret ; 
    const mobile = data?.customer?.customer?.mobile;
    const phone = data?.customer?.customer?.phone;
    if (mobile && !phone)
      ret = mobile;
    else if (phone &&!mobile)
      ret = phone;
    else if (phone &&mobile)
      ret =  mobile+","+ phone
    else
      ret =""
    return ret; 
  } 
  const getLine =(data:any)=>{
    if (!data || data.length == 0) return "\n\n\n"    
    if (data.length <= 160) return data+"\n\n\n"
    if (data.length <= 320) return data + "\n\n"
    return data+"\n"
  }
  // const textToBase64Qrcode = (text:string) => {
  //   const canvas = document.createElement('canvas')
  //   QRCode.toCanvas(canvas, text, function (error) {
  //     if (error) console.error(error)
  //     console.log('success!');
  //   })
  //   return canvas.toDataURL('image/png')
  // }  
  const textToBase64Barcode = (text:string) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, text, {displayValue: false})
    return canvas.toDataURL('image/png')
  }  
   const documentDefinition:any = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [30, 40, 30, 130],
    info: {
      title: 'PackingSlip: '+data.packingSlipNo,
      author: 'Jadcup',
      subject: 'PackingSlip: '+data.packingSlipNo,
      keywords: 'Jadcup',
    },
    // Page Layout

    content: [
      {
        fontSize: 10,
        // This table will contain ALL content
        table: {

          // Defining the top 2 rows as the "sticky" header rows

          headerRows: 1,
          // One column, full width
          widths: ['*'],
          heights: [80, 100, 50, 20, 80],
          layout: 'noBorders',
          // keepWithHeaderRows: true,
          body: [

            // Header Row One
            // An array with just one "cell"
            [
              // Just because I only have one cell, doesn't mean I can't have
              // multiple columns!
              {
                columns: [
                  {
                    image: logo2Img,
                    width: 96, height: 100,
                    margin: [15, -10, 0, 0]
                  },
                  {
                    columns:[
                      {
                        type: 'none',
                        ul: [
                          { text: 'Packing Slip', alignment: 'left', bold: true, fontSize: 20, color: 'black', margin: [170, 0, 0, 0]},
                          { text: 'No: '+orderNo,alignment: 'left',fontSize: 12, color: 'black', margin: [170, 5, 0, 0]},
                          { text: deliveredAt? ('Date:'+formatDate(deliveredAt)):('Date: '+getCurDate()), fontSize: 12,margin: [170, 0, 0, 0]},
                        ]
                      },
                      { 
                        image: textToBase64Barcode(orderNo),
                        width: 145, height: 60,
                      },
                    ]
                  },
                ]
              }
            ],

            // Second Header Row

            [
              {
                margin: [ 0, -23, 0, 0 ],                
                columns: [
                  {
                    type: 'none',
                    ul: [
                      { text: ' ', fontSize: 12,bold: true },
                      { text: 'Bill To: ', fontSize: 11,bold: true},
                      { text: `${data.customer.customer.company ? data.customer.customer.company : ' '}`, fontSize: 10},
                      { text: `${data.customer.customer.address1 ? data.customer.customer.address1 : ' '}`.replace(/,/, '').replace(/,/g, ',\n'), alignment: 'left', fontSize: 10},
                      // { text: `${getNumber(data)}`.replace(/,/, '').replace(/,/g, ',\n'), alignment: 'left', fontSize: 10},
                      // { text: `${data.customer.customer.email ? data.customer.customer.email : ' '}`.replace(/,/, '').replace(/,/g, ',\n'), alignment: 'left', fontSize: 10},
                    ]
                  },

                  {
                    type: 'none',
                    ul: [
                      {
                        table: {
                        widths: ['*'],
                        body: [
                          // [{text: ' ', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'}]
                          [{ text: 'Purchase Order: ' + (data.customer.custOrderNo || ''), bold: true, fontSize: 12 ,color:"white",fillColor: '#12231a'}],
                          [ { text: 'Ship To: ', alignment: 'left', fontSize: 11,bold: true,border: [true, false, true, false],lineHeight: 0.8,}],
                          [
                           
                            { text: `${deliveryName ? deliveryName : data.customer.customer.customerCode ? data.customer.customer.customerCode : ' '}\n`+
                            `${data.customer.deliveryAddress ? data.customer.deliveryAddress : ' '}`.replace(/,/, '').replace(/,/g, ',\n')
                            , alignment: 'left', fontSize: 10, border: [true, false, true, true]},
                            // { text: `${deliveryName ? deliveryName : data.customer.customer.customerCode ? data.customer.customer.customerCode : ' '}`, alignment: 'left', fontSize: 10 },
                            // { text: `${data.customer.deliveryAddress ? data.customer.deliveryAddress : ' '}`.replace(/,/, '').replace(/,/g, ',\n'), alignment: 'left', fontSize: 10 },
                          ]
                        ]}
                        }  ,

                    ]
                  }
                ]
              }
            ],
             [
              {
                 margin: [ 0, -27, 0, 0 ],
                 layout: 'noBorders',
                  fontSize: 8,
                  // lineHeight: 1.5,
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          margin: [ 3, 0, 0, 5 ],
                          // style: 'tableExample',
                          fontSize: 8,
                          // lineHeight: 1.5,
                          fillColor: '#12231a',
                          table: {
                            widths: tableWidth,
                            body: [
                              [
                                // {text: ' ', bold: true, color: 'white', fontSize: 8 ,fillColor: '#12231a'},
                                {text: 'Item Code', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                                {text: 'Product Description', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                                {text: 'Pack', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                                {text: 'Qty', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                                {text: 'Total', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                              ],
                            ],
                           
                          },
                          layout: 'headerLineOnly',
                          // border:[true,true,true,true]
                        }
                      ],
                      // [
                      //   {
                      //     margin: [ 0, 0, 0, 0 ],
                      //     // style: 'tableExample',
                      //     fontSize: 8,
                      //     lineHeight: 1.5,
                      //     // fillColor: '#12231a',
                      //     table: {
                      //       widths: tableWidth,
                      //       body: [
                      //         [
                      //           ...contents
                      //         ],
                      //       ],
                           
                      //     },
                      //     layout: 'headerLineOnly',
                      //     // border:[true,true,true,true]
                      //   }
                      // ],
                      [
                        {

                        // style: 'tableExample',
                        margin: [ 3, 0, 0, 5 ],
                        fontSize: 8,
                        lineHeight: 1.3,
                        table: {
                          widths: tableWidth,
                          body: [

                            ...contents,
                          ],
                        },
                        layout: 'headerLineOnly',
                      }]
                    ]
                  }
                }
            ],

            [
              {
                margin: [ 0, -10, 0, 0 ],
                columns: [

                  {
                    type: 'none',
                    ul: [
                      { text: " ", bold: true, fontSize: 10},
                    ]
                  },
                  {
                    type: 'none',
                    ul: [
                      { text: ' ', bold: true, fontSize: 10},
                    ]
                  },
                  {
                    type: 'none',
                    ul: [
                      { text: ' ', bold: true, fontSize: 10},
                    ]
                  },
                ]
              }
            ],
            [
              content2.length<=0?null:{
                margin: [ 0, 0, 0, 0 ],
                style: 'tableExample',
                fontSize: 8,
                lineHeight: 1.3,
                table: {
                  widths: ['*'],
                  body: [
                    [
                      content2.length<=0?null:{
                        margin: [ 0, 0, 0, 0 ],
                        columns: [
        
                          {
                            type: 'none',
                            ul: [
                              { text: "***The following table shows an outstanding item in backorder for this Purchase Order: " + (data.customer.custOrderNo || ''), bold: true, fontSize: 10},
                            ],
                            // border:[true,true,true,true]
                          }
                        ]
                      }
                    ],     
                    [
                      content2.length<=0?null:{
                        margin: [ 0, 0, 0, 0 ],
                        style: 'tableExample',
                        fontSize: 8,
                        // lineHeight: 1.5,
                        fillColor: '#12231a',
                        table: {
                          widths: tableWidth,
                          body: [
                            [
                              // {text: ' ', bold: true, color: 'white', fontSize: 8 ,fillColor: '#12231a'},
                              {text: 'Item Code', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                              {text: 'Product Description', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                              {text: 'Pack', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                              {text: 'Qty', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                              {text: 'Total', bold: true, color: 'white', fontSize: 8,fillColor: '#12231a'},
                            ],
                          ],
                         
                        },
                        layout: 'headerLineOnly',
                        // border:[true,true,true,true]
                      }
                    ],        

                    [
                      content2.length<=0?null:{
                        margin: [ 0, 0, 0, 0 ],
                        style: 'tableExample',
                        fontSize: 8,
                        lineHeight: 1.5,
                        table: {
                          widths: tableWidth,
                          body: [
                            ...content2,
                          ],
                          
                        },
                        layout: 'headerLineOnly',
                        // border:[true,true,true,true]
                      }
                    ],        
                  ],
                  border:[true,true,true,true]
              }
            }
            ]
            ,
            // [
            //   content2.length<=0?null:{canvas: [{ type: 'line', x1: 0, y1: 5, x2: 535 , y2: 5, lineWidth: 1, lineColor: 'black' }, ]}
            // ],
                 
          ]
        },
        layout: 'noBorders',
        margin: [ 0, 0, 0, 120 ]
      },
    ],
    defaultStyle:{
      // font: 'weiruanyahei',
      font:'Roboto',
  },
    footer: function() {
      return [
        {
          margin: [30, -70, 30, -80],
          fontSize: 10,
          // lineHeight: 1.5,
          columns: [
            // {text: 'Comments:\n' + comments, alignment: 'left', margin: [10, 0, 0, 0]},
            {
              // layout: 'lightHorizontalLines', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: ['*'],
        
                body: [
                  [{  text:'Please Notes:\n',fontSize: 10 ,bold: true,border: [false, false, false, false]}],
                  [
                    { text:
                    '* Please make sure the correct product and quantity is correct before you sign,and notify us immediately if there are any issues.\n'+
                    "* We will replace any merchandise received in damaged condition or as a result of a picking error.\n"+
                    "* No material will be accepted or replacements issued without prior approval to return such merchandise.\n\n"
                    ,fontSize: 9 ,border: [false, false, false, false]}
                    ],
                  [ 
                    { columns: [
                    {text:'Customer Signature: _________________________' , bold: true,border: [false, false, false, false] },
                    {text:'Date:_____________________________', bold: true, border: [false, false, false, false] }
                  ],border: [false, false, false, false]}
                  ],
                  [ {text:'Delivery Instruction:', border: [true, true, true, true],  bold: true,color:'white',fillColor: '#12231a', lineHeight: 1.3}],
                  [ {text: getLine(comments), border: [true, true, true, true] , lineHeight: 1.3}],
                ]
              }
            }
          ]
        },
        {
          margin: [0, 85, 0, 0],
          columns: [
            [
              { text: 'If you have any shipping and returns queries, please do get contact:', alignment: 'center', lineHeight: 1.3, bold: true, fontSize: 9},
              { text: 'Email: Order@jadcup.co.nz Phone: 09 282 3988 ext 805 Addr: 4 Pukekiwiriki Place, East Tamaki, Auckland(2013)', alignment: 'center', lineHeight: 1.3, fontSize: 8},
            ]
          ],

        },
        // {canvas: [{ type: 'line', x1: 30, y1: -50, x2: 595 - 30, y2: -50, lineWidth: 3, lineColor: 'black' }, ]}
      ]
    },
    pageBreakBefore: function(currentNode:any, followingNodesOnPage:any, nodesOnNextPage:any, previousNodesOnPage:any) {
      // console.log('currentNode', currentNode, 'followingNodesOnPage', followingNodesOnPage, 'previousNodesOnPage', previousNodesOnPage)
      return currentNode.headlineLevel === 'Conditions' && currentNode.startPosition.top > 720
    },
  }
  if (require==="getBlob"){
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition)
    pdfDocGenerator.getBlob((blob) => {
      console.log(blob, 'blob')
      getBlob(filename,blob)
    })
  }
  else
    pdfMake.createPdf(documentDefinition).open()
}

const table = (data:any) => {
  return data.tableContent.map((res:any) => {
    console.log(res)
    // return [' ', res.product.replace(/\u2011/g, '-'), res.description.replace(/\u2011/g, '-') + '\n', res.quantity+'pcs', 'Carton', res.carton, res.sum+'pcs']
     return [ res.product?.replace(/\u2011/g, '-'), res.description?.replace(/\u2011/g, '-') + '\n', res.quantity, res.carton, res.sum]
  })
}
const tableOutstanding = (data:any) =>{
  return data
    .filter((res:any) => {
      return res.quantity - res.dispatchedQuantity >0
    })
    .map((res:any) => {
    console.log(res)
    return [res.product.productCode?.replace(/\u2011/g, '-'), res.product.productName?.replace(/\u2011/g, '-') + '\n', 
      res.product.baseProduct.packagingType.quantity, 
      Math.ceil((res.quantity - res.dispatchedQuantity) / res.product.baseProduct.packagingType.quantity), 
      res.quantity - res.dispatchedQuantity]
  })    
}
