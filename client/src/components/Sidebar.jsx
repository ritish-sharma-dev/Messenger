import React, { useContext, useEffect, useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
    const { logout, onlineUsers } = useContext(AuthContext);
    const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
    const [input, setInput] = useState("");
    const filteredUsers = input ? users.filter((user) => 
        user.fullName.toLowerCase().includes(input.toLowerCase())
    ) : users;
    const navigate = useNavigate();

    useEffect(() => {
        getUsers();
    }, [onlineUsers]);

    return (
        <div
            className={` h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className="pb-5">

                {/* HEADER SECTION WITH LOGO AND MENU */}
                <div className="flex justify-between items-center">

                    {/* LOGO */}
                    <img 
                        src={assets.logo} 
                        alt="logo" 
                        className="max-w-40" 
                    />

                    {/* MENU */}
                    <div className="relative py-2 group">
                        {/* MENU ICON AND DROPDOWN */}

                        <img
                            src={assets.menu_icon}
                            alt="Menu"
                            className="max-h-5 cursor-pointer"
                        />

                        <div className="w-32 p-5 absolute top-full right-0 z-20 bg-[#282142] border border-gray-600 rounded-md text-gray-100 hidden group-hover:block">
                            <p
                                onClick={() => {
                                    navigate("/profile");
                                }}
                                className="cursor-pointer text-sm">
                                Edit Profile
                            </p>
                            <hr className="my-2 border-t border-gray-500" />
                            <p
                                onClick={() => logout()}
                                className="cursor-pointer text-sm">
                                Logout
                            </p>
                        </div>

                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="flex items-center gap-2  rounded-full bg-[#282142] py-3 px-4 mt-5">


                    {/* SEARCH ICON */}
                    <img 
                        src={assets.search_icon} 
                        alt="search" 
                        className="w-3" 
                    />

                    {/* SEARCH INPUT  */}
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
                        placeholder="Search User..."
                    />

                </div>
            </div>

            <div className="flex flex-col">
                {/* RENDERING ALL THE USERS */}
                {filteredUsers.map((user, index) => (
                    <div
                        key={index}
                        className={`relative flex items-center gap-2  p-2  pl-4 rounded cursor-pointer max:sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}
                        onClick={() => {
                            setSelectedUser(user);
                            setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
                        }}>
                        <img
                            src={user?.profilePic || assets.avatar_icon}
                            className="w-[35px] aspect-[1/1] rounded-full"
                        />
                        <div className="flex flex-col leading-5">
                            <p>{user.fullName}</p>
                            {onlineUsers.includes(user._id) ? (
                                <span className="text-green-400 text-xs">Online</span>
                            ) : (
                                <span className="text-neutral-400 text-xm">Offline</span>
                            )}
                        </div>
                        {(unseenMessages[user._id] || 0) > 0 && (
                            <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                                {unseenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
