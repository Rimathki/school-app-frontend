import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_REST_API}/api/`;

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.defaults.withCredentials = true;
export default instance;
