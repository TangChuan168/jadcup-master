import React from "react";
import {Space, Table} from "antd";
import moment from "moment";

const MaterialTableOfShelf = (props:{data:any}) =>{
    console.log(props.data)
    const columns:any =[
        {
            title: 'Material Name',
            dataIndex: ['rawMaterial', 'rawMaterialName'],
            key: 'productName',
        },
        {
            title: 'Material Code',
            dataIndex: ['rawMaterial','rawMaterialCode'],
            key: 'barCode',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Pallet',
            dataIndex: 'palletNo',
            key: 'palletNo',
        },            
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (rowData: any) =>moment.utc( rowData.createdAt).local().format('DD/MM/YYYY'),
        },
       
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (text:any, record:any) => {
        //         console.log(text,record)
        //         return(
        //             <Space size="middle">
        //                 {/*<a>Invite {record.name}</a>*/}
        //                 <a>Delete</a>
        //             </Space>
        //         )
        //     },
        // },
    ]
    return <Table columns={columns} dataSource={props.data}/>
}

export default MaterialTableOfShelf