import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../../redux/authSlice";
import { USER_API_END_POINT } from "../../utils/constant";
import toast from "react-hot-toast";

const Login = () => {
    const [input, setInput] = useState({ email: "", password: "", role: "student" });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input);
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                dispatch(setToken(res.data.token));
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Job<span className="text-purple-600">Portal</span>
                </h1>
                <p className="text-center text-gray-500 mb-6">Login to your account</p>

                <form onSubmit={submitHandler} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeHandler}
                            placeholder="Enter your email"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeHandler}
                            placeholder="Enter your password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="role" value="student"
                                checked={input.role === "student"}
                                onChange={changeHandler}
                                className="accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">Student</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="role" value="recruiter"
                                checked={input.role === "recruiter"}
                                onChange={changeHandler}
                                className="accent-purple-600"
                            />
                            <span className="text-sm text-gray-700">Recruiter</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;