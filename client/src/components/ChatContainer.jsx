import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { toast } from "react-hot-toast";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);
    const [input, setInput] = useState("");
    const scrollEnd = useRef();

    // HANDLE SENDING A MESSAGE
    const handleSendMessage = async () => {
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("");
    };

    // HANDLE SENDING AN IMAGE
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
            e.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    // GET MESSAGES WHEN SELECTED USER CHANGES
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [messages, selectedUser]);

    // SCROLL TO BOTTOM WHEN MESSAGES CHANGE
    useLayoutEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="h-full overflow-scroll relative backdrop-blur-lg">
            <div className="flex items-center gap-3 py-4 mx-4 border-b border-stone-500">

                {/* USER PROFILE PIC */}
                <img
                    src={selectedUser.profilePic || assets.avatar_icon}
                    alt=""
                    className="w-8 rounded-full"
                />

                {/* USER NAME AND ONLINE STATUS */}
                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    { selectedUser.fullName }
                    {onlineUsers.includes(selectedUser._id) ? (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    ) : null}
                </p>

                {/* BACK BUTTON */}
                <img
                    onClick={() => setSelectedUser(false)}
                    src={assets.arrow_icon}
                    alt=""
                    className=" max-w-4"
                />

                {/* HELP BUTTON */}
                <img 
                    src={assets.help_icon} 
                    alt="" 
                    className=" max-w-5" 
                />

            </div>

            <hr />

            <div className="flex flex-col overflow-y-auto p-3 pb-6 h-[calc(100%-120px)]">
                {/* RENDER MESSAGES */}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-end gap-2 justify-end ${msg?.senderId !== authUser._id && "flex-row-reverse"}`}>
                        {msg.image ? (
                            <img
                                src={msg.image}
                                alt=""
                                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                            />
                        ) : (
                            <p
                                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8  break-all bg-violet-500/30 text-white  ${msg.senderId === authUser._id ? "rounded-br-none" : "rounded-bl-none"}`}>
                                {msg.text}
                            </p>
                        )}

                        <div className=" text-center text-xs">
                            <img
                                src={
                                    msg.senderId === authUser._id
                                        ? authUser?.profilePic || assets.avatar_icon
                                        : selectedUser?.profilePic || assets.avatar_icon
                                }
                                alt=""
                                className="w-7 rounded-full"
                            />
                            <p className="text-gray-500">
                                {formatMessageTime(msg.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-center  gap-3 p-3">
                <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">

                    {/* HANDLE INPUT CHANGE AND SEND MESSAGE ON ENTER KEY */}
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage() : null}
                        type="text"
                        placeholder="Send a message"
                        className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
                    />

                    {/* IMAGE UPLOAD INPUT */}
                    <input
                        onChange={handleSendImage}
                        type="file"
                        id="image"
                        accept="image/png, image/jpeg"
                        hidden
                    />

                    {/* IMAGE UPLOAD BUTTON */}
                    <label htmlFor="image">
                        <img
                            src={assets.gallery_icon}
                            alt=""
                            className="w-5 mr-2 cursor-pointer"
                        />
                    </label>

                </div>

                {/* SEND BUTTON */}
                <img
                    onClick={handleSendMessage}
                    src={assets.send_button}
                    alt=""
                    className="w-7 cursor-pointer"
                />

            </div>
        </div>
    );
};

export default ChatContainer;
