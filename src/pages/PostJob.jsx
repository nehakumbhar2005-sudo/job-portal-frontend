import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllCompanies } from "../redux/companySlice";
import { logout } from "../redux/authSlice";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const PostJob = () => {
    const { user } = useSelector((state) => state.auth);
    const { allCompanies } = useSelector((state) => state.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-Time",
        experienceLevel: "",
        position: "",
        companyId: ""
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                dispatch(setAllCompanies(res.data.companies));
            }
        } catch (error) {
            toast.error("Failed to fetch companies");
        }
    };

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error("Please select a company first");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success("Job posted successfully!");
                navigate("/recruiter/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
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
                    <Link to="/recruiter/jobs" className="text-gray-600 hover:text-purple-600 font-medium">My Jobs</Link>
                    <Link to="/recruiter/companies" className="text-gray-600 hover:text-purple-600 font-medium">Companies</Link>
                    <span className="text-gray-600 font-medium">Hi, {user?.fullname} 👋</span>
                    <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h2>

                {allCompanies.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                        <p className="text-yellow-700 font-medium">You need to create a company first!</p>
                        <Link
                            to="/recruiter/companies"
                            className="mt-3 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Create Company
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={submitHandler} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Job Title</label>
                            <input type="text" name="title" value={input.title} onChange={changeHandler}
                                placeholder="e.g. Frontend Developer"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={input.description} onChange={changeHandler}
                                placeholder="Job description..."
                                rows={3}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Requirements (comma separated)</label>
                            <input type="text" name="requirements" value={input.requirements} onChange={changeHandler}
                                placeholder="e.g. React, Node.js, MongoDB"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Salary (LPA)</label>
                                <input type="number" name="salary" value={input.salary} onChange={changeHandler}
                                    placeholder="e.g. 8"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Location</label>
                                <input type="text" name="location" value={input.location} onChange={changeHandler}
                                    placeholder="e.g. Bangalore"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Job Type</label>
                                <select name="jobType" value={input.jobType} onChange={changeHandler}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option>Full-Time</option>
                                    <option>Part-Time</option>
                                    <option>Remote</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Experience (yrs)</label>
                                <input type="number" name="experienceLevel" value={input.experienceLevel} onChange={changeHandler}
                                    placeholder="e.g. 2"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Positions</label>
                                <input type="number" name="position" value={input.position} onChange={changeHandler}
                                    placeholder="e.g. 3"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Select Company</label>
                            <select name="companyId" value={input.companyId} onChange={changeHandler}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="">-- Select Company --</option>
                                {allCompanies.map((company) => (
                                    <option key={company._id} value={company._id}>{company.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50">
                            {loading ? "Posting..." : "Post Job"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PostJob;