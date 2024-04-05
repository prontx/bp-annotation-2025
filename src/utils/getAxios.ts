import axios from "axios"
import { API_KEY } from "../testing/test.config";


const instance = axios.create({
    baseURL: "https://api.spokendata.com/v2/jobs",
    headers: {
        'X-API-KEY': API_KEY,
        'Accept': "application/json",
    }
})

export default instance
