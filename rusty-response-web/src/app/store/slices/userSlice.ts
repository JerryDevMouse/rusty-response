import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IUser } from "../../../helpers/types";

interface IState {
    currentUser: IUser | null,
    loading: boolean
}

const initialState: IState = {
    currentUser: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | null>) => {
            state.currentUser = action.payload
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    }
})

export const {setUser, setUserLoading} = userSlice.actions;

export default userSlice.reducer;