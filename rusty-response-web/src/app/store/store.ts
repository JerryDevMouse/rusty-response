import { configureStore } from '@reduxjs/toolkit'
import countSlice from './slices/countSlice'

export const store = configureStore({
    reducer: {
        count: countSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch