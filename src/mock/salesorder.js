const data =[
    {
        orderNo:0,
        customers:1,
        product:'cup1',
        qty:1,
        createdDate:2,
        ReqDate:2,
        comments:1,
        deliverDate:2,
        payment:12,
        // actions:2
    },{
        orderNo:1,
        customers:1,
        product:'cup2',
        qty:1,
        createdDate:2,
        ReqDate:2,
        comments:1,
        deliverDate:2,
        payment:12,
        // actions:2
    }
]

export const salesOrder = () =>{
    return data.filter(g=>g)
}