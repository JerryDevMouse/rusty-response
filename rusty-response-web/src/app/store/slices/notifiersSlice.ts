import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { INotify } from "../../../types/notifiers";
interface IState {
    notifiers: INotify[],
    loading: boolean,
    new_notifier: INotify | {
        server_id: INotify['server_id'] | null
    }
}

const notifiersSlice = createSlice({
    name: 'notifiers',
    initialState: {
        notifiers: [],
        loading: false,
        new_notifier: {
            server_id: null
        }
    } as IState,
    reducers: {
        setNotifiers: (state, action: PayloadAction<INotify[]>) => {
            state.notifiers = action.payload
        },
        addNotifier: (state, action: PayloadAction<INotify>) => {
            state.notifiers.push(action.payload);
        },
        deleteNotifierById: (state, action: PayloadAction<INotify['id']>) => {
            state.notifiers = state.notifiers.filter(({id}) => id !== action.payload);
        },
        setNotifiersLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
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
    setNotifiers, addNotifier, deleteNotifierById, setNotifiersLoading,
    setNewNotifier, setNewNotifierServerId
} = notifiersSlice.actions;

export default notifiersSlice.reducer;