import axios from "axios";

const api = axios.create({
  baseURL: "https://codaily.vercel.app/api",
})

export default api