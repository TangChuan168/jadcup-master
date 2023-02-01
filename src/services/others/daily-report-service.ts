import server from '../api/api-services';
import {baseUrl} from "../api/base-url";
import {getCurrentDateString} from "../lib/utils/helpers";

export const getAllMachineDateRequest = () =>{
    return server({
        url: baseUrl + `WorkingArrangement/GetAllWorkingArrangement?workingDate=${getCurrentDateString()}`,
        method: "GET"
    })
}

export const getAllDailyReportByDateRequest = (date: string) =>{
    return server({
        url: baseUrl + `DailyReport/GetAllDailyReport?date=${date}`,
        method: "GET",
        data:date
    })
}

export const getDailyReportByMachineIdRequest = (id:number) =>{
    return server({
        url: baseUrl + `DailyReport/GetDailyReportByMachineId?id=${id}`,
        method: "GET",
        headers:{
            isLoading: false
        }
    })
}

export const addDailyReportRequest = (data:any) =>{
    return server({
        url: baseUrl + `DailyReport/AddDailyReport`,
        method: "POST",
        data: data
    })
}

export const updateDailyReportRequest = (data:any) => {
    return server({
        url: baseUrl + `DailyReport/UpdateDailyReport`,
        method: "PUT",
        data: data
    })
}

export const DeleteDailyReportRequest = (reportId:string) =>{
    return server({
        url: baseUrl + `DailyReport/DeleteDailyReport?id=${reportId}`,
        method: "DELETE",
        data: reportId
    })
}
