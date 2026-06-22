import { createSlice } from "@reduxjs/toolkit";

let userInfo = null;

try {
  const stored = localStorage.getItem("userInfo");
  if (stored && stored !== "undefined") {
    userInfo = JSON.parse(stored);
  }
} catch (err) {
  userInfo = null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;