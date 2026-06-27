import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import { logout } from "../redux/authSlice";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || ""
    });

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `${USER_API_END_POINT}/profile/update`,
                input,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success("Profile updated successfully!");
                setEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
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
                    <Link to="/jobs" className="text-gray-600 hover:text-purple-600 font-medium">Browse Jobs</Link>
                    <Link to="/applied-jobs" className="text-gray-600 hover:text-purple-600 font-medium">Applied Jobs</Link>
                    <span className="text-gray-600 font-medium">Hi, {user?.fullname} 👋</span>
                    <button onClick={logoutHandler} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    {/* Profile Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-600">
                                {user?.fullname?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{user?.fullname}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                                <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium capitalize">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
                        >
                            {editing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    {/* View Mode */}
                    {!editing && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Bio</h3>
                                <p className="text-gray-700">{user?.profile?.bio || "No bio added yet"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Skills</h3>
                                {user?.profile?.skills?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user?.profile?.skills?.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No skills added yet</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Edit Mode */}
                    {editing && (
                        <form onSubmit={submitHandler} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={input.fullname}
                                    onChange={changeHandler}
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Bio</label>
                                <textarea
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeHandler}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeHandler}
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;