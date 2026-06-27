import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        token: localStorage.getItem("token") || null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem("token", action.payload);
            } else {
                localStorage.removeItem("token");
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
    },
});

export const { setLoading, setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;