import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setAllJobs } from "../redux/jobSlice";
import { logout } from "../redux/authSlice";
import { JOB_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const Jobs = () => {
    const { allJobs } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (search = "") => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${search}`);
            if (res.data.success) {
                dispatch(setAllJobs(res.data.jobs));
            }
        } catch (error) {
            toast.error("Failed to fetch jobs");
        }
    };

    const searchHandler = (e) => {
        e.preventDefault();
        fetchJobs(keyword);
    };

    const logoutHandler = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-purple-600">
                    Job<span className="text-gray-800">Portal</span>
                </Link>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <Link to="/applied-jobs" className="text-gray-600 hover:text-purple-600 font-medium">
                                Applied Jobs
                            </Link>
                            <Link to="/profile" className="text-gray-600 hover:text-purple-600 font-medium">
                                Profile
                            </Link>
                            <span className="text-gray-600 font-medium">Hi, {user.fullname} 👋</span>
                            <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium">Login</Link>
                            <Link to="/register" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Register</Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Search Bar */}
                <form onSubmit={searchHandler} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search jobs by title or description..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                        Search
                    </button>
                </form>

                {/* Jobs List */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {allJobs.length} Jobs Found
                </h2>

                {allJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No jobs found</p>
                        <p className="text-sm mt-2">Try searching with different keywords</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allJobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                                        <p className="text-purple-600 font-medium">{job.company?.name}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        {job.jobType}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{job.description}</p>
                                <div className="flex gap-3 flex-wrap mb-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">📍 {job.location}</span>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs">💰 ₹{job.salary} LPA</span>
                                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs">🎯 {job.experienceLevel} yrs exp</span>
                                </div>
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="block text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;