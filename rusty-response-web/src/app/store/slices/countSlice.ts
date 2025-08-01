import { createSlice, type PayloadAction} from "@reduxjs/toolkit";

const countSlice = createSlice({
    name: 'count',
    initialState: {
        count: 0,
        string: ''
    },
    reducers: {
        addCount: (state) => {
            state.count++;
        },
        setString: (state, action: PayloadAction<string>) => {
            state.string = action.payload
        }
    }
})

export const {addCount, setString} = countSlice.actions;

export default countSlice.reducer;