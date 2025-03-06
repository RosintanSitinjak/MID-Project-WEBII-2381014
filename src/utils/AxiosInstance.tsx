import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://dummyjson.com/docs",
  baseURL: "https://dummyjson.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
