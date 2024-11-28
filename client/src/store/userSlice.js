import { createSlice } from "@reduxjs/toolkit";
import { isUserPresent } from "../utils/functions";

const initialState = {
    isLoggedIn : isUserPresent(),   // called the utils function to see that in local storage user is there or not
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        setIsLoggedIn : (state, action) => {
            state.isLoggedIn = action.payload;
        }
    }
})

export const { setIsLoggedIn } = userSlice.actions;

export default userSlice.reducer;