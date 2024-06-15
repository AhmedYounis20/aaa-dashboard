import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../../interfaces/UserModel";

export const initialuserState : UserModel  = {
    fullName: "",
    email : "",
    id :"",
    role :""
};



export const userAuthSlice = createSlice({
  name: "authUser",
  initialState: initialuserState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload.role;
    },
  },
});

export const { setLoggedInUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;