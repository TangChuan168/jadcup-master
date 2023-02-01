import pdfMake from 'pdfmake/build/pdfmake';
// import vfsFonts from 'pdfmake/build/vfs_fonts';

export default async  (data:any) => {
    console.log(data)
    const vfsFonts = await import("pdfmake/build/vfs_fonts");
    const {vfs} = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const subTotalPrice = subTotal(data)

    const gst = gstForSubtotal(data)

    const total = subTotalPrice + gst

    const contents = table(data)

    const documentDefinition:any = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins : [30, 30, 30, 30],

        // Page Layout

        content :[
            {

            // This table will contain ALL content
            table : {
                // Defining the top 2 rows as the "sticky" header rows
                headerRows: 2,
                // One column, full width
                widths: ['*'],
                heights: [20, 100, 50],
                body: [


                    // Header Row One
                    // An array with just one "cell"
                    [
                        // Just because I only have one cell, doesn't mean I can't have
                        // multiple columns!
                        {
                            columns : [
                                {
                                    image:'data:image/png;base64,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',
                                    width: 160, height: 40,
                                },
                                {
                                    type: 'none',
                                    ul: [
                                        { text: 'INVOICE', alignment: 'right',bold: true, fontSize:19, color: 'red'},
                                        { text: `DATE: ${data.quoteDate? data.quoteDate: ' '}`, alignment: 'right' },
                                        { text: `Quote#: ${data.quotationNo? data.quotationNo: ' '}`, alignment: 'right' },
                                        { text: `VALID DATE: ${data.validDate? data.validDate: ' '}`, alignment: 'right' },
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
                                        ' ',
                                        { text: 'JADCUP'},
                                        { text: '4 Pukekiwiriki Pl, East Tamaki, Auckland 2013,'},
                                        { text: 'New Zealand'},
                                        { text: 'info@jadcup.co.nz'},
                                        { text: '092823988'},
                                    ]
                                },

                                {
                                    type: 'none',
                                    ul: [
                                        { text: 'TO:Customer', alignment: 'right' },
                                        { text: `${data.customerName? data.customerName: ' '}`, alignment: 'right' },
                                        { text: `${data.address? data.address: ' '}`, alignment: 'right' },
                                        { text: `${data.country? data.country: ' '}`, alignment: 'right' },
                                        { text: `${data.email? data.email: ' '}`, alignment: 'right' },
                                        { text: `${data.phone? data.phone: ' '}`, alignment: 'right' },
                                    ]
                                }
                            ]
                        }
                    ],
                    [
                        {
                            style: 'tableExample',
                            table: {
                                widths: [300, '*', '*','*'],
                                body: [
                                    [{text:'DESCRIPTION', bold:true},{text:'QTY', bold:true},{text:'Unit Price', bold:true},{text:'AMOUNT', bold:true}],
                                    // ['777 SW 8oz', '777 Compostable Single Wall Hot Cup 8oz 1000/carton', 'OK?']
                                    ...contents,
                                    [{colSpan: 4, text: ' '}, '','', ''],
                                    [{colSpan: 2, text: ' '}, '','Subtotal', `$${subTotalPrice}`],
                                    [{colSpan: 2, text: ' '}, ' ', ' GST', `$${gst}`],
                                    [{colSpan: 2, text: ' '}, ' ', ' Total', `$${total}`],
                                ]
                            },
                            layout:{
                                fillColor: function (rowIndex:any){
                                    return (rowIndex === 0)?  '#CCCCCC': null
                                }
                            }
                        }
                    ],
                    [
                        {
                        table : {
                            widths: ['*'],
                            body: [
                                [{text:'Bank Details', bold:true, fillColor: '#CCCCCC'}],
                                [' '],
                                ['Bank: ANZ'],
                                ['Account Number:020-2103-32023']
                            ],
                        },
                        layout: 'noBorders',

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


        // Page Footer

        footer : function(currentPage:any, pageCount:any) {
            return {
                alignment : 'center',
                text      : currentPage.toString() + ' of ' + pageCount,
                fontSize  : 8
            }
        },


        // pageBreakBefore: function(currentNode:any, followingNodesOnPage:any, nodesOnNextPage:any, previousNodesOnPage:any) {
        //     return currentNode.headlineLevel === 0 ;
        // },
    };

    pdfMake.createPdf(documentDefinition).open();
}

const table = (data:any ) =>{
    return data.tableContent.map((res:any) =>{
        return [res.description, res.qty, `$${res.price}`, `$${res.amount}`]
    })

}

const subTotal = (data:any) =>{
    return data.tableContent.map((res:any) =>{
        return res.amount
    }).reduce((accumulator:any, currentValue:any) => {
        return accumulator + currentValue
    })
}

const gstForSubtotal = (data:any) =>{
    return data.tableContent.map((res:any) =>{
        return res.amount
    }).reduce((accumulator:any, currentValue:any) => {
        return accumulator + currentValue
    }) * 0.15
}
