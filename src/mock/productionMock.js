const data=[
    {
        machine: 'ws1 printing',
        content:[
            {
                name:'cup1c',
                number: '2000/1000',
                status: 'completed'
            },{
                name:'cup2c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup3d',
                number: '3000/1000',
                status: 'doing'
            },{
                name:'cup2w',
                number: '3000/1000',
                status: 'waiting'
            },{
                name:'cup2t',
                number: '3000/1000',
                status: 'today'
            },{
                name:'cup2p',
                number: '3000/1000',
                status: 'pending'
            },{
                name:'cup3c',
                number: '3000/1000',
                status: 'completed'
            }
        ]
    },
    {
        machine: 'ws1 printing',
        content:[
            {
                name:'cup11c',
                number: '2000/1000',
                status: 'completed'
            },{
                name:'cup21c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup31d',
                number: '3000/1000',
                status: 'doing'
            },{
                name:'cup2w',
                number: '3000/1000',
                status: 'waiting'
            },{
                name:'cup2t',
                number: '3000/1000',
                status: 'today'
            },{
                name:'cup2p',
                number: '3000/1000',
                status: 'pending'
            },{
                name:'cup3c',
                number: '3000/1000',
                status: 'completed'
            },
            {
                name:'cup31c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup32c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup33c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup35c',
                number: '3000/1000',
                status: 'completed'
            },
            {
                name:'cup322c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup3111c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup34243c',
                number: '3000/1000',
                status: 'completed'
            },{
                name:'cup3232c',
                number: '3000/1000',
                status: 'completed'
            }
        ]
    }
]

export const productionDataMock = () =>{
    return data.filter(g =>g)
}