import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { IUser } from "../../../helpers/types";
interface IState {
    currentUser: IUser | null,
    loading: boolean
}

function getInitialState() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: getInitialState(),
        loading: false
    } as IState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | null>) => {
            state.currentUser = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    }
})

export const {setUser, setUserLoading} = userSlice.actions;

export default userSlice.reducer;