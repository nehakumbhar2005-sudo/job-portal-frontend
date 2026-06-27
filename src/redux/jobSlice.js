import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singleJob: null,
        recruiterJobs: [],
        searchQuery: "",
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setRecruiterJobs: (state, action) => {
            state.recruiterJobs = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { setAllJobs, setSingleJob, setRecruiterJobs, setSearchQuery } = jobSlice.actions;
export default jobSlice.reducer;