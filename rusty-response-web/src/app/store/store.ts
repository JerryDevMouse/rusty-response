import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import serversSlice from './slices/serversSlice'
import notifiersSlice from './slices/notifiersSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        servers: serversSlice,
        notifiers: notifiersSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch