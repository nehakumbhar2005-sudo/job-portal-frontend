import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../redux/authSlice";
import { APPLICATION_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const Applicants = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${id}/applicants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setApplicants(res.data.applicants);
            }
        } catch (error) {
            toast.error("Failed to fetch applicants");
        }
    };

    const updateStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${APPLICATION_API_END_POINT}/status/${applicationId}/update`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success(`Application ${status} successfully!`);
                fetchApplicants();
            }
        } catch (error) {
            toast.error("Failed to update status");
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
                    <Link to="/recruiter/jobs" className="text-gray-600 hover:text-purple-600 font-medium">
                        ← Back to Jobs
                    </Link>
                    <span className="text-gray-600 font-medium">Hi, {user?.fullname} 👋</span>
                    <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Applicants ({applicants.length})
                </h2>

                {applicants.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No applicants yet</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Applied On</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map((application) => (
                                    <tr key={application._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {application.applicant?.fullname}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {application.applicant?.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(application.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {application.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(application._id, "accepted")}
                                                        className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm hover:bg-green-200 font-medium"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(application._id, "rejected")}
                                                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 font-medium"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {application.status !== "pending" && (
                                                <span className="text-gray-400 text-sm">Decision made</span>
                                            )}
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

export default Applicants;