import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    messageArr : [],
}

const messageSlice = createSlice({
    name : 'messages',
    initialState,
    reducers : {
        setMessageArr : (state, action) => {
            state.messageArr = [...action.payload];
        }
    }
})

export const { setMessageArr } = messageSlice.actions;

export default messageSlice.reducer;