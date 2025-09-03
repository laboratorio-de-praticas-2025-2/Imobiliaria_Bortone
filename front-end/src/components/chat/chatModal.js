// components/chat/ChatModal.js
"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ChatMessage from "./chatMessage.js";
import { sendMessageMock } from "@/utils/chatService";
import MicrophoneButton from "./microfoneButton.js";

export default function ChatModal({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "support", text: "Olá! Como posso ajudar você hoje?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const inputRef = useRef();
  const recordingInterval = useRef(null);

  // Contador de gravação
  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingInterval.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingInterval.current);
  }, [isRecording]);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-full h-full md:w-full md:h-[80%] md:max-w-md rounded-none md:rounded-2xl shadow-lg flex flex-col overflow-hidden animate-slideUp">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#4C62AE]">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src="/images/icons/avatar.png"
                alt="Avatar do suporte"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h2 className="text-lg md:text-xl text-white pt-2">
              Suporte Grupo Bortone
            </h2>
          </div>

          <button
            onClick={onClose}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full 
                       flex items-center justify-center transform transition-all duration-200
                       hover:scale-110 hover:shadow-2xl"
          >
            <Image
              src="/images/icons/close.png"
              alt="Fechar chat"
              fill
              className="object-contain p-2"
            />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
          ))}
        </div>

        {/* Input */}
        <div className="relative flex items-center border-t p-3 gap-3 bg-[#4C62AE]">
          {/* Botão Emoji */}
          <div className="relative">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                         transform transition-all duration-200 hover:scale-110 hover:shadow-2xl"
            >
              <Image
                src="/images/icons/emoji.png"
                alt="Emoji"
                fill
                className="object-contain p-2"
              />
            </button>

            {showEmojis && (
              <div className="absolute bottom-12 left-0 w-48 bg-white rounded-lg shadow-lg p-2 flex flex-wrap gap-2 z-50
                              transform scale-95 opacity-0 animate-emojiOpen">
                {["😀", "😂", "😍", "👍", "🔥", "🎉", "🙌", "🤔", "😢", "👏"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:scale-125 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input de texto */}
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white rounded-3xl px-3 py-2 text-sm focus:outline-none 
                       focus:ring focus:ring-blue-300"
          />

        </div>
      </div>
    </div>
  );
}
