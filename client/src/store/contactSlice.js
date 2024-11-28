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
    }
})

export const {setSelectedContact, setOnlineContacts} = contactSlice.actions;

export default contactSlice.reducer;