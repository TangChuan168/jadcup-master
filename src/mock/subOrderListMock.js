const subOrderListData = [
    {
        machine_id:1,
        type_id:1,
        id:0,
        name: 'print-01',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-JVXAcYSl5-Qyn5316krk6JV1mnw4zX5wJg&usqp=CAU',
        contents: [
            {
                machine_id: 1,
                product_id:1,
                orderType: 'Cup-S',
                customer:'123 cafe',
                product: 'cup1',
                originalQty: 100,
                actualQty: 98,
                reqDate: '01/11/2020',
                productDetail: 'see details',
                comments:' urgent Order',
                status: 'Processing',
                product_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEMCfDr6AM-Mo70W5HkZtWEAkrPInSEPE1qA&usqp=CAU'
            },
            {
                machine_id: 1,
                product_id:2,
                orderType: 'Cup-p',
                customer:'123 cafe',
                product: 'cup2',
                originalQty: 1000,
                actualQty: 989,
                reqDate: '01/12/2020',
                productDetail: 'see details',
                comments:'stock Order',
                status: 'Awaiting',
                product_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdFlQuQahliAOd8OwiE496SI-Elc3jGjYjDw&usqp=CAU'
            }
        ]
    },
    {
        type_id:1,
        machine_id: 2,
        id:1,
        name: 'print-02',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-JVXAcYSl5-Qyn5316krk6JV1mnw4zX5wJg&usqp=CAU',
        contents: [
            {
                machine_id: 2,
                product_id:3,
                orderType: 'Box-S',
                customer:'123 cafe',
                product: 'box1',
                originalQty: 1010,
                actualQty: 928,
                reqDate: '31/11/2020',
                productDetail: 'see details',
                comments:' Manual Order',
                status: 'Not Ready',
                product_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrTThDwmGS6gu2kWqZykE0-yAtLXEdcYDeaA&usqp=CAU'
            },
            {
                machine_id: 3,
                product_id:4,
                orderType: 'Cup-p',
                customer:'123 cafe',
                product: 'cup2',
                originalQty: 1000,
                actualQty: 989,
                reqDate: '01/12/2020',
                productDetail: 'see details',
                comments:'stock Order',
                status: 'Processing',
                product_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdFlQuQahliAOd8OwiE496SI-Elc3jGjYjDw&usqp=CAU'
            }
        ]
    },
    {
        type_id:3,
        id:2,
        name: 'food-03',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-JVXAcYSl5-Qyn5316krk6JV1mnw4zX5wJg&usqp=CAU',
        contents: null
    },
]

// const tableData = [
//     {
//         machine_id: 1,
//         orderType: 'Cup-S',
//         customer:'123 cafe',
//         product: 'cup1',
//         originalQty: 100,
//         actualQty: 98,
//         reqDate: '01/11/2020',
//         productDetail: 'see details',
//         comments:' urgent Order',
//         status: 'Processing'
//     },
//     {
//         machine_id: 1,
//         orderType: 'Cup-p',
//         customer:'123 cafe',
//         product: 'cup2',
//         originalQty: 1000,
//         actualQty: 989,
//         reqDate: '01/12/2020',
//         productDetail: 'see details',
//         comments:'stock Order',
//         status: 'awaiting'
//     },
//     {
//         machine_id: 2,
//         orderType: 'Box-S',
//         customer:'123 cafe',
//         product: 'box1',
//         originalQty: 1010,
//         actualQty: 928,
//         reqDate: '31/11/2020',
//         productDetail: 'see details',
//         comments:' Manual Order',
//         status: 'Not Ready'
//     }
// ]

export const MockData =() =>{
    return subOrderListData.filter(g => g)
}
// export const MockTableData =() =>{
//     return tableData.filter(g => g)
// }

const selectedOperator = {user_id:0, name: 'amy'}

export const selectedOperatorMockData =() =>{
    return selectedOperator
}

const materials = [
    {
        id: 0,
        name: 'MT001'
    },
    {
        id: 1,
        name: 'MB001'
    },
    {
        id: 2,
        name: 'MF001'
    }
]

export const materialsMockData =() =>{
    return materials.filter(g => g)
}