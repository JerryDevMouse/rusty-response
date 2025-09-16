import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import serversSlice from './slices/serversSlice'
import modalSlice from './slices/modalSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        servers: serversSlice,
        modal: modalSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch