import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IServer } from "../../../types/servers";
import type { INotify } from "../../../types/notifiers";
const COUNT_SERVERS = 5; //on page
export interface IStateServer extends IServer {
    notifiers: INotify[]
}

interface IState {
    servers: {
        list: IStateServer[],
        loading: boolean,
    },
    offset: number,
    page: {
        current: number,
        max: number
    },
    newServerId: IServer['id'] | null,
    deleteCount: number,
    notifiersLoading: boolean,
    newNotifierServerId: IServer['id'] | null
}

const serversSlice = createSlice({
    name: 'servers',
    initialState: {
        servers: {
            list: [],
            loading: true,
        },
        offset: 0,
        page: {
            current: 1,
            max: 0
        },
        deleteCount: 0,
        newServerId: null,
        notifiersLoading: false,
        newNotifierServerId: null
    } as IState,
    reducers: {
        setServers: (state, action: PayloadAction<IServer[]>) => {
            const serversWithNotifiers = action.payload.map(s => ({...s, notifiers: []}))
            state.servers.list = serversWithNotifiers;
        },
        setNotifiers: (state, action: PayloadAction<INotify[]>) => {
            action.payload.map(notify => {
                const serverIndex = state.servers.list.findIndex(s => s.id === notify.server_id);
                state.servers.list[serverIndex].notifiers.push(notify)
            })
        },
        addServer: (state, action: PayloadAction<IServer>) => {
            if (state.servers.list.length < 5) {
                state.servers.list.push({...action.payload, notifiers: []});
            } else {
                state.deleteCount--;
            }
        },
        deleteServerById: (state, action: PayloadAction<IServer['id']>) => {
            state.servers.list = state.servers.list.filter(({id}) => id !== action.payload);
            if (
                state.servers.list.length === 0 && 
                state.page.current !== 1 && 
                state.page.current === state.page.max
            ) {
                state.page.current--;
                state.page.max--;
            } else {
                state.deleteCount++;
            }
        },
        setServersLoading: (state, action: PayloadAction<boolean>) => {
            state.servers.loading = action.payload
        },
        setNotifiersLoading: (state, action: PayloadAction<boolean>) => {
            state.servers.loading = action.payload
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
        setNewNotifierServerId: (state, action: PayloadAction<INotify['server_id']>) => {
            state.newNotifierServerId = action.payload
        },
        setNewServerId: (state, action: PayloadAction<IServer['id']>) => {
            state.newServerId = action.payload
        },
    }
})

export const {
    setServers, setNotifiers, addServer, deleteServerById, setServersLoading,
    changeServersMaxPage, setServersCurrentPage, changeServersOffset,
    setNewNotifierServerId, setNotifiersLoading, setNewServerId
} = serversSlice.actions;

export default serversSlice.reducer;