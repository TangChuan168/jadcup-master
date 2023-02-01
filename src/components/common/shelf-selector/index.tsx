import React, {useEffect, useState} from 'react'
import {getAllZoneRequest} from "../../../services/others/relocate-boxex-services";

const ShelfSelector = (props:{productValue?:number,materialValue?:number, data:any,getProductsDetailByShelf?:any,getMaterialsDetailByShelf?:any,getPlatesDetailByShelf?:any,filterString?:any}) =>{
    const [selectedCell, setSelectedCell] =useState()

    const backgroundStyleChang = (count:number,k?:string) =>{
        const styleOfShelf = {height:30, width:50,border:'1px solid black',marginBottom:10, backgroundColor: 'white'}
        if(count === 0){
            styleOfShelf.backgroundColor = '#FF9999'
        }
        if(count <= 2){
            styleOfShelf.backgroundColor = '#FFCC99'
        }

        if(count > 2 && count <= 4){
            styleOfShelf.backgroundColor = '#FFFF99'
        }

        if(count > 4 ){
            styleOfShelf.backgroundColor = '#CCFF99'
        }

        if(k){ styleOfShelf.backgroundColor = 'red'
            return styleOfShelf
        }

        return styleOfShelf

    }

    const onClick = (code:string,isProduct:boolean,isMaterial:boolean) =>{
        if (isProduct || isMaterial) {
            if(isProduct) {
                props.getProductsDetailByShelf(code)
            }
            if(isMaterial){
                props.getMaterialsDetailByShelf(code)
            }
        } else {
            props.getPlatesDetailByShelf(code)
        }
    }

    const onClickHandler = (shelfCode:string,Id:any) =>{
        props.filterString(shelfCode)
        setSelectedCell(Id)
     }
    return(
        <div>
            {
                props.data.map((zone:any,index:number) => {
                    return(
                        <div style={{display:'flex', flexDirection:'row'}} key={index}>
                            <div style={{height:30, width:50,border:'1px solid black',marginBottom:10,textAlign:'center'}}>
                                {zone.zoneCode}
                            </div>
                            <div style={{display:'flex', flexDirection:'row', textAlign: 'center'}}>
                                {
                                    zone.shelf.map((shelf:any,index2:number) =>{
                                        let productFromInner
                                        let isProductShow = false
                                        let materialFromInner
                                        let isMaterialShow = false
                                        let numsOfSelectedProduct = 0
                                        let numsOfSelectedMaterial = 0
                                        return(
                                            <div style={selectedCell === shelf.shelfId? backgroundStyleChang(shelf.availableCellCount,'selected'):backgroundStyleChang(shelf.availableCellCount)} key={index2} onClick={props.filterString? ()=>onClickHandler(shelf.shelfCode,shelf.shelfId):()=>onClick(shelf.shelfCode,isProductShow,isMaterialShow)}>
                                                {/*{shelf.shelfId}*/}
                                                {shelf.cell.filter((res:any)=> res.plate !== null).map((cell:any,index:number) => {
                                                    return(
                                                        <React.Fragment key={index} >
                                                            {
                                                                cell.plate?.box.map((box:any) =>{
                                                                    // console.log(box.product,zone.zoneCode,'box')
                                                                    // console.log(box)
                                                                    if(box.product.productId === props.productValue){
                                                                        productFromInner = box.product.productName
                                                                        isProductShow = true
                                                                        numsOfSelectedProduct +=1
                                                                    }
                                                                    return
                                                                })
                                                            }
                                                            {
                                                                cell.plate?.rawMaterialBox.map((material:any,index:number) =>{
                                                                    // console.log(material, zone,index)
                                                                    if(material.rawMaterial.rawMaterialId === props.materialValue){
                                                                        materialFromInner = material.rawMaterial.rawMaterialCode
                                                                        isMaterialShow = true
                                                                        numsOfSelectedMaterial +=1
                                                                    }
                                                                    return
                                                                })
                                                            }
                                                        </React.Fragment>
                                                    )
                                                })}
                                                {isProductShow && <span style={{cursor:'pointer'}}>{numsOfSelectedProduct}</span>}
                                                {isMaterialShow &&<span style={{cursor:'pointer'}}>{numsOfSelectedMaterial}</span> }
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}

export default ShelfSelector
