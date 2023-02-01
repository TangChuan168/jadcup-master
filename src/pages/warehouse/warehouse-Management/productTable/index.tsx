import React, {useState} from "react";
import {Popconfirm, Space, Table} from "antd";
import {deleteObsoleteBox, updateStockQuantityRequest} from "../../../../services/others/warehouse-management-services";
import SweetAlertService from "../../../../services/lib/utils/sweet-alert-service";
import {data} from "../../../../mock/dashboard-mock";
import moment from "moment";
const ProductTable = (props:{data:any, productData:any, productDelete:(data:any)=>void}) =>{

    const [dataToTable, setDataToTale] = useState(props.data)
    const columns:any =[
        {
            title: 'Product Name',
            dataIndex: ['product', 'productName'],
            key: 'productName',
        },
        {
            title: 'BarCode',
            dataIndex: 'barCode',
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
            render: (rowData: any) =>{
                return moment.utc( rowData).local().format('DD/MM/YYYY')
            },
        },
        {
            title: 'Description',
            dataIndex: ['product','description'],
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text:any, record:any) => {
                // console.log(text,record)
                return (
                    <Space size="middle">
                        <div onClick={() =>quantityChangeHandler(text.boxId)}><a>change Quantity </a></div>
                        <Popconfirm title="Sure to delete?" onConfirm={() => deleteHandler(text.boxId)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ]

    console.log(props.data)

    const quantityChangeHandler = async (boxId:string) =>{
        console.log(boxId)
        const result = await SweetAlertService.inputConfirm({type:'number', title:'Update Quantity', placeholder:'qty'})
        if(result !== null){
            if(!result){
                await SweetAlertService.errorMessage('Please type in quantity before submitting')
                return
            }else{
                console.log(typeof result,'true')
                updateStockQuantityRequest(boxId, result).then(_ => {
                    const array = [...dataToTable]
                    const index = array.findIndex((res:any) => res.boxId === boxId)
                    // console.log(index)
                    array[index].quantity = parseInt(result)
                    // console.log(array)
                    setDataToTale(array)
                })
            }
        }
    }

    const deleteHandler = async (boxId:string) =>{
        console.log('delete',boxId )
        // console.log(props.productData)
        const newData = dataToTable.filter((res:any) => res.boxId !== boxId)
        setDataToTale(newData)
        await deleteObsoleteBox(boxId).then((res:any)=>console.log(res))
        // console.log(newData)
        props.productDelete(newData)

    }

    return(
        <Table columns={columns} dataSource={dataToTable}/>
    )
}

export default ProductTable
