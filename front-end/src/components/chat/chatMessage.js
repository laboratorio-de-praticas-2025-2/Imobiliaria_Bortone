// components/chat/ChatMessage.js
export default function ChatMessage({ sender, text }) {
  return (
    <div
      className={`max-w-[70%] p-2 rounded-lg text-sm ${
        sender === "user"
          ? "ml-auto bg-[#4C62AE] text-white"
          : "mr-auto bg-[#4C62AE]  text-white"
      }`}
    >
      {text}
    </div>
  );
}
