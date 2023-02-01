const user =[
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

const allData =[
    {
        machine:{
            type_id:1,
            id:0,
            name: 'print-01',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-JVXAcYSl5-Qyn5316krk6JV1mnw4zX5wJg&usqp=CAU'
        },
        user:{
            id:0,
            name: 'amy'
        },
    },
    {
        machine:{
            type_id: 1,
            id:1,
            name: 'print-02',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRXx0hTfh7QfudhVe9SyPb_DytdY_natFl0A&usqp=CAU'
        },
        user:{
            id:1,
            name: 'bill'
        },
    },
    {
        machine:{
            type_id: 2,
            id:2,
            name: 'print-03',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0RSrihBmRGHU_TwW1PU3G48qijTb_wSGC1g&usqp=CAU'

        },
        user:null,
    },
    {
        machine:{
            type_id: 3,
            id:2,
            name: 'print-04',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0RSrihBmRGHU_TwW1PU3G48qijTb_wSGC1g&usqp=CAU'

        },
        user:null,
    },
    // {
    //     id:1,
    //     machine:{
    //         id:1,
    //         name: 'print-02'
    //     },
    //     user:{
    //         id:1,
    //         name: 'bill'
    //     },
    //     img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0RSrihBmRGHU_TwW1PU3G48qijTb_wSGC1g&usqp=CAU'
    // },
    // {
    //     id:1,
    //     machine:{
    //         id:1,
    //         name: 'print-02'
    //     },
    //     user:{
    //         id:1,
    //         name: 'bill'
    //     },
    //     img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0RSrihBmRGHU_TwW1PU3G48qijTb_wSGC1g&usqp=CAU'
    // }
]
export const workArrangementData = () =>{
    return user.filter(g => g)
}

export const workArrangementAllData = () =>{
    return allData.filter(g => g)
}
const allData2 =[
    {
        machine:{
            type_id:1,
            id:0,
            name: 'print-01',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-JVXAcYSl5-Qyn5316krk6JV1mnw4zX5wJg&usqp=CAU'
        },
        user:null
    },
    {
        machine:{
            type_id: 1,
            id:1,
            name: 'print-02',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRXx0hTfh7QfudhVe9SyPb_DytdY_natFl0A&usqp=CAU'
        },
        user:{
            id:2,
            name: 'cici'
        },
    },
    {
        machine:{
            type_id: 2,
            id:2,
            name: 'print-03',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0RSrihBmRGHU_TwW1PU3G48qijTb_wSGC1g&usqp=CAU'

        },
        user:{
            id:0,
            name: 'amy'
        },
    },
    {
        machine:{
            type_id: 3,
            id:2,
            name: 'print-04',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0RSrihBmRGHU_TwW1PU3G48qijTb_wSGC1g&usqp=CAU'

        },
        user:null,
    },
]

export const workArrangementAllData1 = () =>{
    return allData2.filter(g => g)
}