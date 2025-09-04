import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import serversSlice from './slices/serversSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        servers: serversSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch