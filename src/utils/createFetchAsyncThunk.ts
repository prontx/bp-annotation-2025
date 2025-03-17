// utils
import axios from "./getAxios"
import { createAsyncThunk } from "@reduxjs/toolkit"

export let thunkData: any = {}

export const createFetchAsyncThunk = <T>(prefix: string, url?: string) => {
    return createAsyncThunk(prefix, async (_, { rejectWithValue }) => {
        try {
            
            const params = new URLSearchParams(window.location.search)
            const JOB_ID = params.get('job_id')
            if (!JOB_ID){
                throw {code: 400, message: "Job id has not been provided!"}
            }

            const { data } = await axios.get<T>(url ? `${JOB_ID}/${url}` : JOB_ID)
            console.log(`${prefix}, ${url}, ${JOB_ID} - thunk - ` + JSON.stringify(data))
            return data
        } catch (err) {
            if (err instanceof Object && "message" in err && "code" in err){
                throw rejectWithValue(err)
            } else if (!(err instanceof Error && "response" in err && err.response instanceof Object && "data" in err.response)){
                throw {code: 400, message: "Unknown error."}
            }
            throw rejectWithValue(err.response.data);
        }
    })
}


