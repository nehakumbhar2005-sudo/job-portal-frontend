import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setRecruiterJobs } from "../redux/jobSlice";
import { logout } from "../redux/authSlice";
import { JOB_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const RecruiterJobs = () => {
    const { recruiterJobs } = useSelector((state) => state.job);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecruiterJobs();
    }, []);

    const fetchRecruiterJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${JOB_API_END_POINT}/getrecruiterjobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                dispatch(setRecruiterJobs(res.data.jobs));
            }
        } catch (error) {
            toast.error("Failed to fetch jobs");
        }
    };

    const deleteJob = async (jobId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success("Job deleted successfully");
                fetchRecruiterJobs();
            }
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-purple-600">
                    Job<span className="text-gray-800">Portal</span>
                </Link>
                <div className="flex gap-4 items-center">
                    <Link to="/recruiter/companies" className="text-gray-600 hover:text-purple-600 font-medium">Companies</Link>
                    <span className="text-gray-600 font-medium">Hi, {user?.fullname} 👋</span>
                    <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Posted Jobs</h2>
                    <Link
                        to="/recruiter/post-job"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                    >
                        + Post New Job
                    </Link>
                </div>

                {recruiterJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No jobs posted yet</p>
                        <Link to="/recruiter/post-job" className="text-purple-600 hover:underline mt-2 block">
                            Post your first job
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Title</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Company</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Location</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Applicants</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recruiterJobs.map((job) => (
                                    <tr key={job._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{job.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{job.company?.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{job.location}</td>
                                        <td className="px-6 py-4 text-gray-600">{job.applications?.length || 0}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Link
                                                to={`/recruiter/applicants/${job._id}`}
                                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200"
                                            >
                                                Applicants
                                            </Link>
                                            <button
                                                onClick={() => deleteJob(job._id)}
                                                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterJobs;