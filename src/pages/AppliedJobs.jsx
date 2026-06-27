import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAppliedJobs } from "../redux/applicationSlice";
import { logout } from "../redux/authSlice";
import { APPLICATION_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const AppliedJobs = () => {
    const { appliedJobs } = useSelector((state) => state.application);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppliedJobs();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                dispatch(setAppliedJobs(res.data.applications));
            }
        } catch (error) {
            toast.error("Failed to fetch applications");
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    const getStatusColor = (status) => {
        if (status === "accepted") return "bg-green-100 text-green-600";
        if (status === "rejected") return "bg-red-100 text-red-600";
        return "bg-yellow-100 text-yellow-600";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-purple-600">
                    Job<span className="text-gray-800">Portal</span>
                </Link>
                <div className="flex gap-4 items-center">
                    <Link to="/jobs" className="text-gray-600 hover:text-purple-600 font-medium">Browse Jobs</Link>
                    <span className="text-gray-600 font-medium">Hi, {user?.fullname} 👋</span>
                    <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>

                {appliedJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No applications yet</p>
                        <Link to="/jobs" className="text-purple-600 hover:underline mt-2 block">
                            Browse jobs and apply
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Job Title</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Company</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Location</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Applied On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appliedJobs.map((application) => (
                                    <tr key={application._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{application.job?.title}</td>
                                        <td className="px-6 py-4 text-gray-600">{application.job?.company?.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{application.job?.location}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(application.createdAt).toLocaleDateString()}
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

export default AppliedJobs;