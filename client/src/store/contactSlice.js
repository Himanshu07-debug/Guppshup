import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedContact : undefined,
    onlineContacts : [],
}

const contactSlice = createSlice({
    name : 'contact',
    initialState,
    reducers : {
        setSelectedContact : (state, action) => {
            state.selectedContact = action.payload;
        },
        setOnlineContacts : (state, action) => {
            state.onlineContacts = action.payload;
        },
        clearContactState : (state) => {
            state.selectedContact = undefined;
            state.onlineContacts = [];
        },
    }
})

export const {setSelectedContact, setOnlineContacts, clearContactState} = contactSlice.actions;

export default contactSlice.reducer;