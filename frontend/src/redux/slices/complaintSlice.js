import { createSlice } from "@reduxjs/toolkit";

const complaintSlice = createSlice({
  name: "complaints",

  initialState: {
    complaints: [],
    loading: false,
  },

  reducers: {
    setComplaints: (
      state,
      action
    ) => {
      state.complaints =
        action.payload;
    },
  },
});

export const {
  setComplaints,
} = complaintSlice.actions;

export default complaintSlice.reducer;
