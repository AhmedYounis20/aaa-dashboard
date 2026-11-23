import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

const THEME_STORAGE_KEY = "aaa-theme-mode";

function readStoredMode(): PaletteMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // ignore storage access errors (private mode, SSR)
  }
  return "light";
}

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = {
  mode: readStoredMode(),
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.mode);
      } catch {
        // ignore
      }
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
