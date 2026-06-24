import React from "react";
import assets from "../assets/assets";

const NoChatSelected = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2  text-gray-500 bg-white/10 max-md:hidden">
            <img src={assets.logo_icon} alt="" className="max-w-16" />
            <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
        </div>
    );
};

export default NoChatSelected;
