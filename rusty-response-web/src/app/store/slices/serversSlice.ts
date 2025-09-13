import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IServer } from "../../../types/servers";
import type { INotify } from "../../../types/notifiers";
import { initialNotifier } from "../../../constants/notifiers";
const COUNT_SERVERS = 5; //on page
export interface IStateServer extends IServer {
    notifiers: INotify[]
}

interface IState {
    servers: {
        list: IStateServer[],
        loading: boolean,
        lastUpdate: number,
    },
    offset: number,
    page: {
        current: number,
        max: number
    },
    separateServer: {
        server: IStateServer | null,
        loading: boolean
    }
    newServerId: IServer['id'] | null,
    deleteCount: number,
    notifiersLoading: boolean,
    separateNotifier: {
        notifier: INotify,
        loading: boolean
    },
}

const serversSlice = createSlice({
    name: 'servers',
    initialState: {
        servers: {
            list: [],
            loading: true,
            lastUpdate: 0
        },
        offset: 0,
        page: {
            current: 1,
            max: 0
        },
        separateServer: {
            server: null, 
            loading: true
        },
        deleteCount: 0,
        newServerId: null,
        notifiersLoading: false,
        separateNotifier: {
            notifier: initialNotifier,
            loading: true
        }
    } as IState,
    reducers: {
        setServers: (state, action: PayloadAction<IServer[]>) => {
            const serversWithNotifiers = action.payload.map(s => ({...s, notifiers: []}))
            state.servers.list = serversWithNotifiers;
            state.servers.lastUpdate = Date.now();
        },
        setNotifiers: (state, action: PayloadAction<INotify[]>) => {
            action.payload.map(notify => {
                const serverIndex = state.servers.list.findIndex(s => s.id === notify.server_id);
                if (serverIndex !== -1) {
                    state.servers.list[serverIndex].notifiers.push(notify)
                }
            })
        },
        addServer: (state, action: PayloadAction<IServer>) => {
            if (state.servers.list.length < 5) {
                state.servers.list.push({...action.payload, notifiers: []});
            } else {
                state.deleteCount--;
            }
        },
        editServer: (state, action: PayloadAction<IServer>) => {
            const serverIndex = state.servers.list.findIndex(s => s.id === action.payload.id);
            if (serverIndex !== -1) {
                state.servers.list[serverIndex] = {...action.payload, notifiers: []}
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
                state.offset -= 5;
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
        setSeparateNotifier: (state, action: PayloadAction<INotify>) => {
            state.separateNotifier.notifier = action.payload
        },
        setNewServerId: (state, action: PayloadAction<IServer['id']>) => {
            state.newServerId = action.payload
        },
        setSeparateServer: (state, action: PayloadAction<IStateServer | null>) => {
            state.separateServer.server = action.payload
        },
        setSeparateServerNotifiers: (state, action: PayloadAction<INotify[] | []>) => {
            state.separateServer.server!.notifiers = action.payload
        },
        setSeparateServerLoading: (state, action: PayloadAction<boolean>) => {
            state.separateServer.loading = action.payload
        }
    }
})

export const {
    setServers, setNotifiers, addServer, editServer, deleteServerById, setServersLoading,
    changeServersMaxPage, setServersCurrentPage, changeServersOffset,
    setSeparateNotifier, setNotifiersLoading, setNewServerId,
    setSeparateServer, setSeparateServerNotifiers, setSeparateServerLoading
} = serversSlice.actions;

export default serversSlice.reducer;