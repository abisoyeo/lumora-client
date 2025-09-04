import { MessageCircle, User } from "lucide-react";
import FileDisplay from "./FileDisplay.jsx";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-start space-x-3 ${
        message?.isBot ? "" : "justify-end"
      }`}
    >
      {message?.isBot && (
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-4 h-4 text-slate-900" />
        </div>
      )}

      <div
        className={`max-w-xs sm:max-w-md lg:max-w-lg ${
          message?.isBot ? "order-2" : "order-1"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            message?.isBot
              ? "bg-slate-700 text-gray-100"
              : "bg-emerald-500 text-slate-900 ml-auto"
          }`}
        >
          {/* <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message?.text}
          </p> */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown>{message?.text || ""}</ReactMarkdown>
          </div>
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${
            message?.isBot ? "text-left" : "text-right"
          }`}
        >
          {formatTime(message?.timestamp)}
        </div>
      </div>

      {/* {message.file && <FileDisplay file={message.file} />} */}
      {!message?.isBot && (
        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 order-3">
          <User className="w-4 h-4 text-gray-300" />
        </div>
      )}
    </div>
  );
}
