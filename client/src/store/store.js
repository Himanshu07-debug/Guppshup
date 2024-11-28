import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import contactSlice from './contactSlice';
import messageSlice from './messageSlice';

const store = configureStore({
    reducer : {
        user : userSlice,
        contact : contactSlice,
        messages : messageSlice
    }
})

export default store;