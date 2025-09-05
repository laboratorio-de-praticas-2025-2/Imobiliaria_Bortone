// components/chat/ChatModal.js
"use client";
import { useState, useRef } from "react";
import ChatMessage from "./chatMessage.js";
import { sendMessageMock } from "@/utils/chatService";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { BsEmojiSmile } from "react-icons/bs";

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "support", text: "Olá! Como posso ajudar você hoje?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef();

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: newMessage };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    const response = await sendMessageMock(newMessage);
    setMessages((prev) => [...prev, response]);
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="
    fixed z-[9999]
    inset-0 w-full h-full rounded-none
    md:inset-auto md:bottom-4 md:right-4 md:w-[90%] md:max-w-sm md:h-[70vh] md:rounded-2xl
    bg-white shadow-lg flex flex-col overflow-hidden
    animate-slideUpFade
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-[#4C62AE]">
        <div className="flex items-center gap-2">
          <RxAvatar className="w-8 h-8 md:w-10 md:h-10" color="white" />
          <h2 className="text-sm md:text-base text-white font-semibold">
            Suporte Grupo Bortone
          </h2>
        </div>

        <button onClick={onClose}>
          <IoIosCloseCircleOutline
            className="w-8 h-8 md:w-10 md:h-10 transition-transform hover:scale-110"
            color="white"
          />
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      {/* Input */}
      <div className="relative flex items-center border-t p-2 gap-2 bg-[#4C62AE]">
        {/* Emoji */}
        <div className="relative">
          <BsEmojiSmile
            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
            color="white"
            onClick={() => setShowEmojis(!showEmojis)}
          />
          {showEmojis && (
            <div
              className="absolute bottom-10 left-0 w-48 bg-white rounded-lg shadow-lg p-2 
                         flex flex-wrap gap-2 z-50 animate-emojiOpen"
            >
              {["😀", "😂", "😍", "👍", "🔥", "🎉", "🙌", "🤔", "😢", "👏"].map(
                (emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Campo texto */}
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-white rounded-3xl px-3 py-2 text-sm focus:outline-none 
                     focus:ring focus:ring-blue-300"
        />
      </div>
    </div>
  );
}
