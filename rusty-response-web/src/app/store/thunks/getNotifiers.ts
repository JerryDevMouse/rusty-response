import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../../helpers/apiRequest";
import { API } from "../../../helpers/constants";
import type { IResponse } from "../../../helpers/types";
import type { INotify } from "../../../types/notifiers";

export const getNotifiers = createAsyncThunk(
  'servers/getNotifiers',
  async (_, {rejectWithValue}) => {
    try {
        const responseFindTotal = await apiRequest<IResponse<INotify>>(API.notify + '?limit=10&offset=0'); // temporarily, until the API route is redesigned 
        if (responseFindTotal.total === responseFindTotal.items.length) {
            return responseFindTotal.items
        }
        const finalResponse = await apiRequest<IResponse<INotify>>(API.notify + `?limit=${responseFindTotal.total}&offset=0`);
        return finalResponse.items; 

    } catch (err: any) {
        console.error("Error fetching user data:", err);
        return rejectWithValue(err.response.data) 
    } 
  }
)