import pdfMake from 'pdfmake/build/pdfmake'
// import vfsFonts from 'pdfmake/build/vfs_fonts'
import { logoImg } from '../../../../services/others/assets'

export default async (data:any,require?:string, getBlob?:any,filename?:string) => {
  // console.log(data)
  const vfsFonts = await import("pdfmake/build/vfs_fonts");    
  const {customerName, packingSlip, creditNote, collectionAddress, collectionMethod, issueDate, reason, originalPo, claimNo} = data

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
  const {vfs} = vfsFonts.pdfMake;
  pdfMake.vfs = vfs

  const contents = table(data)
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
   const documentDefinition:any = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [30, 60, 30, 130],
    info: {
      title: 'PackingSlip:'+ data.packingSlip,
      author: 'Jadcup',
      subject: 'PackingSlip:'+ data.packingSlip,
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
                    image: logoImg,
                    width: 160, height: 40,
                  },
                  {
                    type: 'none',
                    ul: [
                      { text: 'Return Slip', alignment: 'left', bold: true, fontSize: 20, color: 'black', margin: [100, 0, 0, 0]},
                      { text: 'Claim No: ' + (claimNo ? claimNo : ' '), alignment: 'left', fontSize: 12, color: 'black', margin: [235, -15, 0, 0]},
                      { text: ''},
                    ]
                  },
                ]
              }
            ],

            // Second Header Row

            [
              {
                columns: [
                  {
                    type: 'none',
                    ul: [
                      { text: 'Credit To: ', fontSize: 11, bold: true},
                      { text: `${customerName ? customerName : ' '}`, fontSize: 10},
                      { text: ' ', fontSize: 10},
                      { text: 'Credit note number: ', fontSize: 10},
                      { text: `${creditNote ? creditNote : ' '}`, fontSize: 10},
                    ]
                  },

                  {
                    type: 'none',
                    ul: [
                      { text: 'Collection Address: ', alignment: 'left', fontSize: 11, bold: true},
                      { text: `${collectionAddress ? collectionAddress : ' '}`, fontSize: 10},
                      { text: 'Collection Method: ' + (collectionMethod ? collectionMethod : ''), fontSize: 10},
                      { text: ' ', fontSize: 10},
                      { text: 'Original PO: ' + (originalPo ? originalPo : ' '), fontSize: 10},
                    ]
                  }
                ]
              }
            ],
            [
              {
                margin: [ 0, -10, 0, 0 ],
                columns: [

                  {
                    type: 'none',
                    ul: [
                      { text: issueDate ? ('Date:' + formatDate(issueDate)) : ('Date:' + getCurDate()), bold: true, fontSize: 10},
                    ]
                  },
                  {
                    type: 'none',
                    ul: [
                      { text: 'Original Packing slip Number:' + (packingSlip || ''), bold: true, fontSize: 10},
                    ]
                  },
                ]
              }
            ],
            [
              {
                margin: [ 0, -50, 0, 0 ],
                style: 'tableExample',
                fontSize: 8,
                lineHeight: 1.5,
                table: {
                  widths: [1, 80, 260, '*', '*', '*', 40],
                  body: [
                    [
                      {text: ' ', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                      {text: 'Item Code', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                      {text: 'Product Description', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                      {text: 'Pack', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                      {text: 'Unit', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                      {text: 'Qty', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                      {text: 'Total', bold: true, color: 'white', fontSize: 8, fillColor: '#12231a'},
                    ],
                    ...contents,
                  ],
                },
                layout: 'noBorders',

              }
            ],
          ]
        },
        layout: 'noBorders',
        margin: [ 0, 0, 0, 120 ]
      },
    ],
    defaultStyle:{
      font: 'weiruanyahei',
  },
    footer: function() {
      return [
        {
          margin: [30, 0, 30, 0],
          fontSize: 12,
          lineHeight: 1.5,
          columns: [
            // {text: 'Comments:\n' + comments, alignment: 'left', margin: [10, 0, 0, 0]},
            [
              { text: 'Reason for return: ' + (reason || ' '), fontSize: 11, bold: true},
              { text: ' ', fontSize: 10},
              { text: 'Warehouse signature: ' + ' ', fontSize: 10, bold: true}
            ],
          ]
        },
        {
          margin: [30, 30, 0, 0],
          columns: [
            [
              { text: '4 Pukekiwiriki Place, East Tamaki, Auckland(2013)', alignment: 'center', lineHeight: 1.3, bold: true, fontSize: 8},
              { text: 'Phone: 0064 9 282 3988 ext 807     Email: delivery@jadcup.co.nz', alignment: 'center', lineHeight: 1.3, bold: true, fontSize: 8},
              { text: 'http://www.jadcup.co.nz', alignment: 'center', lineHeight: 1.3, bold: true, fontSize: 8},
            ]
          ],

        },
        {canvas: [{ type: 'line', x1: 30, y1: -40, x2: 595 - 30, y2: -40, lineWidth: 3, lineColor: 'black' }, ]}
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
    return [' ', res.product, res.description + '\n', res.quantity+'pcs', 'Carton', res.carton, res.sum+'pcs']
  })
}