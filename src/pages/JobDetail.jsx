import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [applied, setApplied] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchJob();
    }, []);

    const fetchJob = async () => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`);
            if (res.data.success) {
                setJob(res.data.job);
            }
        } catch (error) {
            toast.error("Failed to fetch job details");
        }
    };

    const applyHandler = async () => {
        if (!user) {
            toast.error("Please login to apply");
            navigate("/login");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success("Applied successfully!");
                setApplied(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setLoading(false);
        }
    };

    if (!job) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading job details...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-purple-600">
                    Job<span className="text-gray-800">Portal</span>
                </Link>
                <Link to="/jobs" className="text-gray-600 hover:text-purple-600 font-medium">
                    ← Back to Jobs
                </Link>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">{job.title}</h1>
                            <p className="text-purple-600 text-lg font-semibold">{job.company?.name}</p>
                        </div>
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {job.jobType}
                        </span>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-3 flex-wrap mb-6">
                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">📍 {job.location}</span>
                        <span className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm">💰 ₹{job.salary} LPA</span>
                        <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm">🎯 {job.experienceLevel} yrs exp</span>
                        <span className="px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm">👥 {job.position} positions</span>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">Job Description</h2>
                        <p className="text-gray-600 leading-relaxed">{job.description}</p>
                    </div>

                    {/* Requirements */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">Requirements</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.requirements?.map((req, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    {req}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Apply Button */}
                    {user?.role === "student" && (
                        <button
                            onClick={applyHandler}
                            disabled={applied || loading}
                            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {applied ? "✅ Already Applied" : loading ? "Applying..." : "Apply Now"}
                        </button>
                    )}

                    {!user && (
                        <Link to="/login"
                            className="block text-center w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg">
                            Login to Apply
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetail;