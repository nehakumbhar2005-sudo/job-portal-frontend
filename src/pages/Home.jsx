import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import toast from "react-hot-toast";

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-600">
                    Job<span className="text-gray-800">Portal</span>
                </h1>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <span className="text-gray-600 font-medium">
                                Hi, {user.fullname} 👋
                            </span>
                            <button
                                onClick={logoutHandler}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center py-24 px-4">
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                    No. 1 Job Hunt Website
                </span>
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    Search, Apply & <br />
                    Get Your <span className="text-purple-600">Dream Job</span>
                </h1>
                <p className="text-gray-500 text-lg mb-8 max-w-xl">
                    Find the best job opportunities from top companies around the world.
                    Your next career move starts here.
                </p>
                <div className="flex gap-4">
                    {!user && (
                        <Link to="/register" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg">
                            Get Started
                        </Link>
                    )}
                    {user?.role === "student" && (
                        <Link to="/jobs" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg">
                            Browse Jobs
                        </Link>
                    )}
                    {user?.role === "recruiter" && (
                        <Link to="/recruiter/jobs" className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg">
                            Post a Job
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Section */}
            <div className="flex justify-center gap-16 py-12 bg-white">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-purple-600">1200+</h2>
                    <p className="text-gray-500 mt-1">Live Jobs</p>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-purple-600">500+</h2>
                    <p className="text-gray-500 mt-1">Companies</p>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-purple-600">10k+</h2>
                    <p className="text-gray-500 mt-1">Users</p>
                </div>
            </div>
        </div>
    );
};

export default Home;