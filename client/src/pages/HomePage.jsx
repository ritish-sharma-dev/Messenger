import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSidebar";
import { ChatContext } from "../context/ChatContext";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
    const { selectedUser } = useContext(ChatContext);

    return (
        <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
            <div className={`grid grid-cols-1 backdrop-blur-xl border-2 border-gray-600 h-[100%] rounded-2xl relative overflow-hidden ${selectedUser ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols=[1fr_2fr_1fr]" : "md:grid-cols-2"}`}>
                <Sidebar />
                {selectedUser ? <ChatContainer /> : <NoChatSelected />}
                {selectedUser && <RightSideBar />}
            </div>
        </div>
    );
};

export default HomePage;