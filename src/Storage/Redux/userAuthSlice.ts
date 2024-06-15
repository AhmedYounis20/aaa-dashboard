import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../../interfaces";

export const initialuserState : UserModel  = {
    fullname: "",
    email : "",
    id :"",
    role :""
};



export const userAuthSlice = createSlice({
  name: "authUser",
  initialState: initialuserState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.fullname = action.payload.fullName;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
  },
});

export const { setLoggedInUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;