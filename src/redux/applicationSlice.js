import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        appliedJobs: [],
    },
    reducers: {
        setAppliedJobs: (state, action) => {
            state.appliedJobs = action.payload;
        },
    },
});

export const { setAppliedJobs } = applicationSlice.actions;
export default applicationSlice.reducer;