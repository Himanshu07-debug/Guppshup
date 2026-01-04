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
        },
        clearMessageArr : (state) => {
            state.messageArr = [];
        }
    }
})

export const { setMessageArr, clearMessageArr } = messageSlice.actions;

export default messageSlice.reducer;