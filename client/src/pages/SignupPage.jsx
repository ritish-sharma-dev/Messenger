import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        bio: "",
    });
    const { signUp } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        signUp(formData);
    };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

            {/* LEFT SIDE */}
            <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

            {/* RIGHT SIDE*/}
            <form
                onSubmit={onSubmitHandler}
                className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
                {/* FORM HEADING */}
                <h2 className="flex justify-between items-center text-2xl font-medium">Sign up</h2>

                {/* FULL NAME INPUT */}
                <input
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    value={formData.fullName}
                    type="text"
                    className="p-2 border border-gray-500 rounded-md focus:outline-none"
                    placeholder="Full Name"
                    required
                />

                {/* EMAIL INPUT */}
                <input
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    value={formData.email}
                    type="email"
                    placeholder="Email Address"
                    required
                    className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* PASSWORD INPUT */}
                <input
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    value={formData.password}
                    type="password"
                    placeholder="Password"
                    required
                    className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* BIO INPUT */}
                <textarea
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    value={formData.bio}
                    rows={2}
                    className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Provide a short bio..."
                    required
                />

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
                    Create Account
                </button>

                {/* BOTTOM AREA */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600">
                        Already have an account?
                        <span
                            className="font-medium text-violet-500 cursor-pointer"
                            onClick={() => navigate("/login")} >
                            {" "} Login here
                        </span>
                    </p>
                </div>

            </form>
        </div>
    );
};

export default SignupPage;