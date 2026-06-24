import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        login(formData);
    };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

            {/* LEFT SIDE */}
            <img src={assets.logo_big} alt="Logo" className="w-[min(30vw,250px)]" />

            {/* RIGHT SIDE */}
            <form
                onSubmit={onSubmitHandler}
                className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">

                {/* FORM HEADING */}
                <h2 className="flex justify-between items-center text-2xl font-medium">Login</h2>

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

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
                    Login now
                </button>

                {/* BOTTOM AREA */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600">
                        Create an account
                        <span
                            className="font-medium text-violet-500 cursor-pointer"
                            onClick={() => navigate("/signup")}>
                            {" "}
                            Click here
                        </span>
                    </p>
                </div>

            </form>
        </div>
    );
};

export default LoginPage;