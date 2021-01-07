import axios from "axios";

let axiosInstance;

const getAxios = () => {
    if (!axiosInstance) {
        axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                authorization: window.localStorage.getItem("token")
            }
        })
    }
    return axiosInstance
}


export default getAxios;