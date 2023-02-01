const selects = [
    {
        id:0,
        name: 'amy'
    },
    {
        id:1,
        name: 'bill'
    },
    {
        id:2,
        name: 'cici'
    },
    {
        id:3,
        name: 'duran'
    },
]

const dataSource1 = [
    {
        id: 0,
        product: 'select1',
        boxNumber: 30,
        productDate: '西湖区湖底公园1号',
        notes: 'abc'
    },
    {
        id: 1,
        product: 'select1.2',
        boxNumber: 31,
        productDate: '西湖区湖底公园1号',
        notes: 'efg'
    },
];

const dataSource2 = [
    {
        id: 20,
        product: 'select2',
        boxNumber: 32,
        productDate: '西湖区湖底公园1号',
        notes: 'abc'
    },
    {
        id: 30,
        product: 'select2.1',
        boxNumber: 33,
        productDate: '西湖区湖底公园1号',
        notes: 'efg'
    },
];

const dataSource3 = [
    {
        id: 40,
        product: 'test1',
        boxNumber: 34,
        productDate: '西湖区湖底公园10号',
        notes: 'abc'
    },
    {
        id: 50,
        product: 'test2',
        boxNumber: 35,
        productDate: '西湖区湖底公园11号',
        notes: 'efg'
    },
    {
        id: 60,
        product: 'test3',
        boxNumber: 36,
        productDate: '西湖区湖底公园12号',
        notes: 'hij'
    },
];

export const selectMock = ( )=>{
    return selects.filter(g => g)
}

export const data1Mock = () =>{
    return dataSource1.filter(g => g)
}

export const data2Mock = () =>{
    return dataSource2.filter(g => g)
}

export const data3Mock = () =>{
    return dataSource3.filter(g => g)
}
