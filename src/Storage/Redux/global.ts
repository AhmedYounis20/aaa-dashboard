import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
    mode: string
}

const initialState: ThemeState = {
    mode: "light"
};

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: { 
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        }
    }
});

export const {setMode} = globalSlice.actions;

export default globalSlice.reducer 