import axios from "axios";
import { AxiosInstance } from "axios";

let axiosInstance: AxiosInstance;

const getAxios = () => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });

    axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response.data?.error === "Not logged in.") {
            window.location.href = "/login"
            return;
        }
        throw err;
      }
    );
  }
  return axiosInstance;
};

export default getAxios;
