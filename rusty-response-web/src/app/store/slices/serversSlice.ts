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
    deleteCount: number,
    notifiersLoading: boolean,
    new_notifier: INotify | {
        server_id: INotify['server_id'] | null
    }
}

const serversSlice = createSlice({
    name: 'servers',
    initialState: {
        servers: {
            list: [],
            loading: false,
        },
        offset: 0,
        page: {
            current: 1,
            max: 0
        },
        deleteCount: 0,
        notifiersLoading: false,
        new_notifier: {
            server_id: null
        },
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
            state.servers.list.push({...action.payload, notifiers: []});
        },
        deleteServerById: (state, action: PayloadAction<IServer['id']>) => {
            state.servers.list = state.servers.list.filter(({id}) => id !== action.payload);
            state.deleteCount++;
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
        setNewNotifier: (state, action: PayloadAction<INotify>) => {
            state.new_notifier = action.payload
        },
        setNewNotifierServerId: (state, action: PayloadAction<INotify['server_id']>) => {
            state.new_notifier.server_id = action.payload
        }
    }
})

export const {
    setServers, setNotifiers, addServer, deleteServerById, setServersLoading,
    changeServersMaxPage, setServersCurrentPage, changeServersOffset,
    setNewNotifier, setNewNotifierServerId, setNotifiersLoading
} = serversSlice.actions;

export default serversSlice.reducer;