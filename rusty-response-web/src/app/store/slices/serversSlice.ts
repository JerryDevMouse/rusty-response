import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IServer } from "../../../types/servers";
interface IState {
    servers: IServer[],
    loading: boolean
}

const serversSlice = createSlice({
    name: 'servers',
    initialState: {
        servers: [
            {
                id: 1,
                user_id: 4,
                name: 'RustyResponse',
                url: 'https://www.rusty-response.com/',
                timeout: 10,
                interval: 60,
                last_seen_status_code: 200,
                last_seen_reason: 405,
                is_turned_on: true,
                created_at: 'Today',
                updated_at: '1 minute ago'
            },
            {
                id: 2,
                user_id: 4,
                name: 'Google',
                url: 'https://www.google.com/',
                timeout: 10,
                interval: 60,
                last_seen_status_code: 500,
                last_seen_reason: 401,
                is_turned_on: true,
                created_at: 'Day ago',
                updated_at: 'Just now'
            },
            {
                id: 3,
                user_id: 4,
                name: 'BoostClock',
                url: 'https://boost-clock.vercel.com/',
                timeout: 10,
                interval: 60,
                last_seen_status_code: 200,
                last_seen_reason: null,
                is_turned_on: false,
                created_at: 'Month ago',
                updated_at: 'Yesterday'
            }
        ],
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