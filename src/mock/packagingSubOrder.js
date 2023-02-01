const data =[
    {
        product_id:1,
        orderType: 'Cup-p',
        customer:'123 cafe',
        product: 'cup',
        originalQty: 1000,
        actualQty: 989,
        createDate: '01/12/2020',
        productDetail: 'see details',
        packagingDetail:'stock Order',
        status: 'Awaiting',
        product_img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEMCfDr6AM-Mo70W5HkZtWEAkrPInSEPE1qA&usqp=CAU'
    },
    {
        product_id:2,
        orderType: 'Cup-m',
        customer:'123 cafe',
        product: 'cups no.2',
        originalQty: 2000,
        actualQty: 989,
        createDate: '01/12/2020',
        productDetail: 'see details',
        packagingDetail:'stock Order',
        status: 'Awaiting',
        product_img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdFlQuQahliAOd8OwiE496SI-Elc3jGjYjDw&usqp=CAU'
    },
    {
        product_id:3,
        orderType: 'box-m',
        customer:'Q cafe',
        product: 'box no.1',
        originalQty: 2000,
        actualQty: 989,
        createDate: '01/12/2020',
        productDetail: 'see details',
        packagingDetail:'stock Order',
        status: 'Awaiting',
        product_img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrTThDwmGS6gu2kWqZykE0-yAtLXEdcYDeaA&usqp=CAU'
    }
]

export const packagingSubOrderDataMock =()=>{
    return data.filter(g=>g)
}