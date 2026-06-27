import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Requires login
export const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (!user) return <Navigate to="/login" />;
    return children;
};

// Only for students
export const StudentRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (!user) return <Navigate to="/login" />;
    if (user.role !== "student") return <Navigate to="/" />;
    return children;
};

// Only for recruiters
export const RecruiterRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (!user) return <Navigate to="/login" />;
    if (user.role !== "recruiter") return <Navigate to="/" />;
    return children;
};

// Redirect to home if already logged in
export const AuthRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    if (user) return <Navigate to="/" />;
    return children;
};