import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IServer } from "../../../types/servers";
interface IState {
    servers: IServer[],
    loading: boolean,
    offset: number,
    page: {
        current: number,
        max: number
    },
    deleteCount: number
}
const COUNT_SERVERS = 5; //on page

const serversSlice = createSlice({
    name: 'servers',
    initialState: {
        servers: [],
        loading: false,
        offset: 0,
        page: {
            current: 1,
            max: 0
        },
        deleteCount: 0
    } as IState,
    reducers: {
        setServers: (state, action: PayloadAction<IServer[]>) => {
            state.servers = action.payload
        },
        addServer: (state, action: PayloadAction<IServer>) => {
            state.servers.push(action.payload);
        },
        deleteServerById: (state, action: PayloadAction<IServer['id']>) => {
            state.servers = state.servers.filter(({id}) => id !== action.payload);
            state.deleteCount++;
        },
        setServersLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        changeServersMaxPage: (state, action: PayloadAction<number>) => {
            state.page.max = Math.ceil(action.payload / COUNT_SERVERS)
        },
        setServersCurrentPage: (state, action: PayloadAction<number>) => {
            state.page.current = action.payload;
        },
        changeServersOffset: (state, action: PayloadAction<number>) => {
            state.offset = (action.payload - 1) * COUNT_SERVERS
        },
    }
})

export const {
    setServers, addServer, deleteServerById, setServersLoading,
    changeServersMaxPage, setServersCurrentPage, changeServersOffset,
} = serversSlice.actions;

export default serversSlice.reducer;