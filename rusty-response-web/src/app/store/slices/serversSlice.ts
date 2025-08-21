import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IServer } from "../../../types/servers";
interface IState {
    servers: IServer[],
    loading: boolean
}

const serversSlice = createSlice({
    name: 'servers',
    initialState: {
        servers: [],
        loading: false
    } as IState,
    reducers: {
        setServers: (state, action: PayloadAction<IServer[]>) => {
            state.servers = action.payload
        },
        setServersLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    }
})

export const {setServers, setServersLoading} = serversSlice.actions;

export default serversSlice.reducer;