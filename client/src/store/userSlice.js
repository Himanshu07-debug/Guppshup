import { createSlice } from "@reduxjs/toolkit";
import { isUserPresent } from "../utils/functions";

const initialState = {
    isLoggedIn : isUserPresent(),
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