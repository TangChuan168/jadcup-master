const data = [
    {
        name: '777-A',
        customer: '123 cafe',
        product: 'hot cup',
        inStock: 1000,
        minimum: 2000,
        pending: 0,
        semiFinish: 2000,
        semiFinishMinimumStockLevel: 3000,
        pending2:11,
        suggestProductQty: 2000,
        productOrder:100,
        suggestSemiFinishedQty: 0,
        SemiFinishedOrder:11
    },
    {
        name: '777-B',
        customer: '123 cafe',
        product: 'hot cup',
        inStock: 2000,
        minimum: 3000,
        pending: 1000,
        semiFinish: 2000,
        semiFinishMinimumStockLevel: 2000,
        suggestProductQty: 1000,
        productOrder:100,
        suggestSemiFinishedQty: 2000,
        SemiFinishedOrder:22
    },
    {
        name: '999-0',
        customer: '123 cafe',
        product: 'hot cup',
        inStock: 2000,
        minimum: 3000,
        pending: 1000,
        semiFinish: 2000,
        semiFinishMinimumStockLevel: 2000,
        suggestProductQty: 1000,
        productOrder:0,
        suggestSemiFinishedQty: 2000,
        SemiFinishedOrder:0
    }
]

const data1 = [
    {
        name: '777-A',
        customer: '123 cafe',
        description: 'hot cup',
        product:{
            inStock: 1000,
            minimum: 2000,
            pending:3030,
            suggestProductQty: 2000,
        },
        test:{
            semiFinish: 2000,
            semiFinishMinimumStockLevel: 3000,
            pending2:11,
            suggestSemiFinishedQty: 0,
        },
        inStock: 1000,
        minimum: 2000,
        pending: 0,
        semiFinish: 2000,
        semiFinishMinimumStockLevel: 3000,
        pending2:11,
        suggestProductQty: 2000,
        productOrder:100,
        suggestSemiFinishedQty: 0,
        SemiFinishedOrder:11
    },
    {
        name: '777-B',
        customer: '123 cafe',
        description: 'hot cup',
        product:{
            inStock: 1000,
            minimum: 2000,
            pending:3030,
            suggestProductQty: 2000,
        },
        test:{
            semiFinish: 2000,
            semiFinishMinimumStockLevel: 3000,
            pending2:11,
            suggestSemiFinishedQty: 0,
        },
        inStock: 1000,
        minimum: 2000,
        pending: 0,
        semiFinish: 2000,
        semiFinishMinimumStockLevel: 3000,
        pending2:11,
        suggestProductQty: 2000,
        productOrder:100,
        suggestSemiFinishedQty: 0,
        SemiFinishedOrder:11
    }
]

export const stockMonitorDate =()=>{
    return data1.filter(g=>g)
}