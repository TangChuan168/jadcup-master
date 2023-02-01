import server from "../api/api-services";
import {baseUrl} from "../api/base-url";

export const getAllZoneRequest = () =>{
    return server({
        url: baseUrl + 'Zone/GetAllZone?active=1&zoneType=1',
        method: "GET",
        headers: {
            isLoading:false
        }
    })
}

export const getBoxByPlateIdRequest = (plateId:number) =>{
    return server({
        url: baseUrl + `Plate/GetBoxByPlateId?plateId=${plateId}`,
        method: "GET",
        headers: {
            isLoading:false
        }
    })
}
export const getRawMaterialBoxByPlateIdRequest = (plateId:number) =>{
    return server({
        url: baseUrl + `Plate/GetRawMaterialBoxByPlateId?plateId=${plateId}`,
        method: "GET"
    })
}
export const moveBoxRequest = (data:any) =>{
    return server({
        url: baseUrl + 'PlateBox/MoveBox',
        method: "PUT",
        data:data
    })
}

export const getInUsingPlateRequest = () =>{
    return server({
        // url: baseUrl + 'Plate/GetAllPlate?plateTypeId=1',
        url :baseUrl + 'Plate/GetInUsingPallet',
        method: "GET",
    })
}

export const getAllZoneRequestForRefresh = () =>{
    return server({
        url: baseUrl + 'Zone/GetAllZone?active=1&zoneType=1',
        method: "GET",
        headers: {
            isLoading:false
        }
    })
}
