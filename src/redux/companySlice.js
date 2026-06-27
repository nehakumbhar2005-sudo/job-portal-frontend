import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        allCompanies: [],
        singleCompany: null,
    },
    reducers: {
        setAllCompanies: (state, action) => {
            state.allCompanies = action.payload;
        },
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
    },
});

export const { setAllCompanies, setSingleCompany } = companySlice.actions;
export default companySlice.reducer;