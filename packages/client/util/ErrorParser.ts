import {AxiosError} from "axios";
import {toast} from "react-toastify";

interface Error {
    location: string;
    msg: string;
    param: string;
}

export const handleAxiosErr = (err: AxiosError) => {
    if (err.response.data.errors) {
        errorParser(err.response.data.errors).forEach(msg => toast.error(msg))
    }
    toast.error(err.response.data.error)
}


export const errorParser = (errorMap: Error[]) => {
    return errorMap.map(error => `${error.param}: ${error.msg}`)
}