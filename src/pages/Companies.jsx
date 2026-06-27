import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllCompanies } from "../redux/companySlice";
import { logout } from "../redux/authSlice";
import { COMPANY_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const Companies = () => {
    const { allCompanies } = useSelector((state) => state.company);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

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

    const createCompany = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error("Company name is required");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                toast.success("Company created successfully!");
                setName("");
                fetchCompanies();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create company");
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
                    <span className="text-gray-600 font-medium">Hi, {user?.fullname} 👋</span>
                    <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Companies</h2>

                {/* Create Company Form */}
                <form onSubmit={createCompany} className="bg-white rounded-xl shadow-sm p-6 mb-6 flex gap-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter company name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Company"}
                    </button>
                </form>

                {/* Companies List */}
                {allCompanies.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">No companies yet</p>
                        <p className="text-sm mt-2">Create your first company above</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {allCompanies.map((company) => (
                            <div key={company._id} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{company.name}</h3>
                                    <p className="text-gray-500 text-sm">{company.location || "Location not set"}</p>
                                </div>
                                <Link
                                    to={`/recruiter/post-job`}
                                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 font-medium text-sm"
                                >
                                    Post a Job
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;