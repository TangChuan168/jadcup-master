import pdfMake from 'pdfmake/build/pdfmake';
// import vfsFonts from 'pdfmake/build/vfs_fonts';
import { logoImg } from '../../../../services/others/assets'
import moment from 'moment'
import { optionsArray } from '../../../order/purchase-order/purchase-order-page/purchase-order-column-model';

export default async (data:any, require:string, getBlob?:any) => {
    console.log(data)
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
    const {vfs} = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const subTotalPrice:number = subTotal(data).toFixed(2)

    const gst = (data.suplier?.currencyId==1)?(subTotalPrice*0.15).toFixed(2):0;

    const total = (data.suplier?.currencyId==1)?(subTotalPrice*1.15).toFixed(2):subTotalPrice;

    const contents = table(data);

    const currency = data.suplier?.currencyId==1?'NZD':
        (data.suplier?.currencyId==2?'RMB':'USD');

    const documentDefinition:any = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins : [30, 30, 30, 30],

        info: {
            title: data.poNo,
            author: 'Jadcup',
            subject: data.poNo,
            keywords: 'Jadcup',
          },        
        // Page Layout

        content :[
            {

            // This table will contain ALL content
            table : {
                // Defining the top 2 rows as the "sticky" header rows
                headerRows: 2,
                // One column, full width
                widths: ['*'],
                // heights: [20, 100, 50],
                body: [


                    // Header Row One
                    // An array with just one "cell"
                    [
                        // Just because I only have one cell, doesn't mean I can't have
                        // multiple columns!
                        {
                            columns : [
                                {
                                    type: 'none',
                                    fontSize:9,
                                    margin: [ 0, 0, 0, 0 ] ,                                    
                                    ul: [
                                        {
                                            image: logoImg,
                                            width: 120, height: 30,
                                            // margin: [ -10, 0, 0, 0 ] ,  
                                          },
                                          { text: 'NZ Made 2013 Limited', alignment: 'Left',bold: true, fontSize:13, margin: [ 0, 15, 0, 0 ] },
                                          { text: `4A Pukekiwiriki Place East Tamaki`, alignment: 'left', margin: [ 0, 0, 0, 0 ]  },
                                          { text: `Acukland 2013`, alignment: 'left', margin: [ 0,0, 0, 0 ]  },
                                          { text: `New Zealand`, alignment: 'left', margin: [ 0, 0, 0, 0 ]  },

                                          { text: `Phone: +64 09 282 3988`, alignment: 'left', margin: [ 0, 10, 0, 0 ]  },
                                          { text: `Email:purchase@jadcup.co.nz`, alignment: 'left', margin: [ 0, 0, 0, 0 ]  },
                                          { text: `http://www.jadcup.co.nz`, alignment: 'left', margin: [ 0, 0, 0, 0 ]  },                                                                                    
                                         
                                    ]
                                },
                                {
                                    type: 'none',
                                    fontSize:9,
                                    margin: [ 0, 5, 0, 0 ] ,                                        
                                    ul: [
                                        // {
                                        //     image:'data:image/png;base64,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',
                                        //     width: 80, height: 20,
                                        // },
                                        { text: 'PURCHASE ORDER', bold: true, fontSize:14,margin: [ 0, 5, 0, 0 ] },                                        
                                        { text: '',bold: true},
                                        { text: `Purchase Order Number:${data.poNo}`,bold: true,margin: [ 0, 10, 0, 0 ] },
                                        { text: `Date:${data.createdAt?moment.utc( data.createdAt).local().format('DD/MM/YYYY'):" "}`},
                                        { text: 'Supplier', bold: true, fontSize:14,margin: [ 0, 15, 0, 0 ] },       
                                        { text: `${data.suplier?.suplierName}` },
                                        { text: `${data.suplier?.address?.split(',')[0]??""}`},
                                        { text: `${data.suplier?.address?.split(',')[1]??""}`},
                                        { text: `${data.suplier?.address?.split(',')[2]??""}`},
                                        { text: `${data.suplier?.address?.split(',')[3]??""}`},
                                                                      
                                    ]
                                },
                            ]
                        }
                    ],

                    [
                        {
                            style: 'tableExample',
                            margin: [ 0, 5, 0, 0 ] ,  
                            fontSize:8,
                            lineHeight: 0.7,
                            table: {
                                widths: [95,230, '*','*', '*',50],
                                margin: [ 0, 6, 0, 0 ] ,  
                                body: [
                                    [{text:' Item', bold:true,color: 'white',fillColor: '#12231a',margin: [ 2, 0, 0, 0 ] ,  },
                                    {text:' Description', bold:true,color: 'white',fillColor: '#12231a'},
                                    {text:' Unit', bold:true,color: 'white',fillColor: '#12231a'},
                                    {text:' Quantity', bold:true,color: 'white',fillColor: '#12231a'},
                                    {text:'Unit Price', bold:true,color: 'white',fillColor: '#12231a'},
                                    {text:`Amount ${currency}`, bold:true,color: 'white',fillColor: '#12231a'}],
                                    // ['777 SW 8oz', '777 Compostable Single Wall Hot Cup 8oz 1000/carton', 'OK?'],
                                     ...contents,
                                     ['', '','','','',''],
                                     ['', '','','','',''],
                                     ['', '','','','',''],                                     
                                     ...getTotal(gst,subTotalPrice,total)
                                ]
                            },
                            layout:
                                'noBorders',
                                // fillColor: function (rowIndex:any){
                                //     return (rowIndex === 0)?  '#12231a': null
                                // }
                            
                        }
                    ]
                ]
            },
            layout: 'noBorders',
            margin: [ 0, 0, 0, 20 ]


            // Table Styles

            // layout: {
            //     hLineWidth: function(i, node) { return (i === 1 || i === 2) ? 1 : 0; },
            //     vLineWidth: function(i, node) { return 0; },
            //     hLineColor: function(i, node) { return (i === 1 || i === 2) ? '#eeeeee' : 'white'; },
            //     vLineColor: function(i, node) { return 'white' },
            //     paddingBottom: function(i, node) {
            //         switch (i) {
            //             case 0:
            //                 return 5;
            //             case 1:
            //                 return 2;
            //             default:
            //                 return 0;
            //         }
            //     },
            //     paddingTop: function(i, node) {
            //         switch (i) {
            //             case 0:
            //                 return 0;
            //             case 1:
            //                 return 2;
            //             default:
            //                 return 10;
            //         }
            //     }
            // }
            },
        ],
        defaultStyle:{
            font: 'weiruanyahei',
        },


        // Page Footer

        // footer : function(currentPage:any, pageCount:any) {
        //     return {
        //         alignment : 'center',
        //         text      : currentPage.toString() + ' of ' + pageCount,
        //         fontSize  : 8
        //     }
        // },
        footer: function() {
            return [
                { 
                    margin: [40, -70, 40, 0],
                    fontSize: 12,
                    // lineHeight: 4, 
                    // height: 50,              
                    text: `DELIVERY DETAILS`
                },            
                { 
                margin: [30, 2, 30, 10],
                fontSize: 8,
                // lineHeight: 4, 
                height: 40,               
                columns: [
                    {
                        type: 'none',
                        fontSize:9,
                        lineHeight: 0.9, 
                        // margin: [ 0, 10, 0, 0 ] ,                                    
                        ul: [
                            { text: `Delivery Address`, alignment: 'left',fontSize: 9,bold: true, margin: [0, 0, 0, 2]},
                            { text: `${data.deliveryAddr?data.deliveryAddr?.split(',')[0]+data.deliveryAddr?.split(',')[1]+data.deliveryAddr?.split(',')[2]:'4 Pukekiwiriki Place, East Tāmaki,Auckland 2013'}`, alignment: 'left'},
                            { text: `New Zealand`, alignment: 'left' },   
                            { text: `Attention`, alignment: 'left' },
                            { text: `Telephone: ${data.telNo??"+64 09-282 3988"}`, alignment: 'left' },                                                                                                                        
                            { text: `Delivery Date: ${data.deliveryDate1??" "}`, alignment: 'left' },      
                        ]
                    },

                    {
                        type: 'none',
                        fontSize:8,
                        // margin: [ 0, 15, 0, 0 ] ,                                        
                        ul: [

                            { text: 'Delivery Instructions',fontSize: 9,bold: true,margin: [0, 0, 0, 2]},
                            { text: `${data.deliveryInstruction??""}`},
                          ]
                    },
                  
                 ]                
            },

            {canvas: [{ type: 'line', x1: 30, y1: -95, x2: 595 - 30, y2: -95, lineWidth: 1, lineColor: 'grey' }, ]}
            ]
          },

        // pageBreakBefore: function(currentNode:any, followingNodesOnPage:any, nodesOnNextPage:any, previousNodesOnPage:any) {
        //     return currentNode.headlineLevel === 0 ;
        // },
    };

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

const table = (data:any ) =>{
    const poDetailData = data.poDetail.map((res:any) =>{
        return [
            res.suplierProductCode?.replace(/\u2011/g, '-')??res.rawMaterial?.rawMaterialCode,
            res.rawMaterial?.rawMaterialName?.replace(/\u2011/g, '-'),
            res.unit,
            res.quantity,
            res.unitPrice?.toFixed(2),
            res.price?.toFixed(2)]
    })
    const poOptionData = data.poOption.map((res: any) => {
        return [
            optionsArray.filter((fee: any) => fee.value === res?.optionId)[0]?.label, null, null, 1, res.price?.toFixed(2), res.price?.toFixed(2)
        ]
    })
    return data.poOption.length === 0 ? [...poDetailData] : [...poDetailData, ...poOptionData]
}
const getTotal = (gst:any,subTotalPrice:any,total:any) =>{
    let res=[];
    if (gst!=0){
        res.push([{colSpan: 3, text: ' '}, '','', {colSpan: 2,fontSize:8, text: 'Subtotal', border: [true, true, true, true]}, '', `${subTotalPrice}`])
        res.push([{colSpan: 3, text: ' '},  '','',{colSpan: 2,fontSize:8, text: 'GST 15%'}, '',`${gst}`])
    }
    res.push(
        ['', '','',{colSpan: 3,bold:true,fontSize:4, text: '________________________________________________________________________________'},'','']
    )
    res.push(
        [{colSpan: 3, text: ' '}, '','', {colSpan: 2,fontSize:8,text:'TOTAL', bold:true}, '', {text:`${total}`,fontSize:9, bold:true}]
    );
    return res;
} 
const subTotal = (data:any) =>{
    const poDetailTotal = data.poDetail.map((res:any) =>{
        return res.price
    }).reduce((accumulator:any, currentValue:any) => {
        return accumulator + currentValue
    })
    const poOptionTotal = data.poOption.map((res: any) => res.price).reduce((a: number, value: number) => a + value, 0)
    return data.poOption.length === 0 ? poDetailTotal : (poDetailTotal + poOptionTotal)
}

const gstForSubtotal = (data:any) =>{
    return data.poDetail.map((res:any) =>{
        return res.price
    }).reduce((accumulator:any, currentValue:any) => {
        return accumulator + currentValue
    }) * 0.15
}

