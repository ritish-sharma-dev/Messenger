import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
    const { authUser, updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        profilePic: authUser.profilePic,
        fullName: authUser.fullName,
        bio: authUser.bio,
    });
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () =>
            setFormData((prev) => ({ ...prev, profilePic: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
            <div className="w-5/6  max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">

                    {/* FORM HEADING */}
                    <h3 className="text-lg">Profile details</h3>

                    {/* PROFILE PICTURE TO UPDATE */}
                    <label
                        htmlFor="avatar"
                        className="flex items-center gap-3 cursor-pointer">
                        <input
                            onChange={handleImageChange}
                            type="file"
                            id="avatar"
                            accept=".png,.jpg,.jpeg"
                            hidden
                        />
                        <img
                            src={ formData.profilePic ? formData.profilePic : assets.avatar_icon }
                            alt=""
                            className={`w-12 h-12 ${formData.profilePic && "rounded-full"}`}
                        />
                        Edit Profile Picture
                    </label>

                    {/* NAME INPUT FOR UPDATING EXISTING NAME */}
                    <input
                        onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                        }}
                        value={formData.fullName}
                        type="text"
                        required
                        placeholder="Your name"
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    {/* BIO INPUT FOR UPDATING EXISTING BIO */}
                    <textarea
                        onChange={(e) => {
                            setFormData({ ...formData, bio: e.target.value });
                        }}
                        value={formData.bio}
                        placeholder="write profile bio"
                        required
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    {/* SAVE BUTTON TO UPDATE */}
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-400 to-violet-600  text-white p-2 rounded-full text-lg cursor-pointer">
                        Save
                    </button>

                </form>

                {/* IMAGE THAT USER SETS */}
                <img
                    src={authUser?.profilePic || assets.logo_icon}
                    className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10  ${formData.profilePic && "rounded-full"}`}
                    alt=""
                />

            </div>
        </div>
    );
};

export default ProfilePage;
