import { useEffect } from "react";
import MessageBubble from "./ChatMessage";
import { useRef } from "react";
import FileUpload from "./FileUpload";
import { Send } from "lucide-react";

export default function ChatInput({
  inputText,
  setInputText,
  onSendMessage,
  onFileSelect,
  isLoading,
}) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  return (
    <div className="border-t border-slate-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2 ">
          {/* File Upload Button */}
          <FileUpload onFileSelect={onFileSelect} />

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about Nigerian tax laws, business registration, or compliance..."
            className="w-full px-4 py-3 bg-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder-gray-400 border-none outline-none text-sm leading-6"
            rows={1}
            style={{ minHeight: "48px", maxHeight: "80px" }}
            disabled={isLoading}
          />

          {/* Send Button */}
          <button
            onClick={onSendMessage}
            disabled={(!inputText.trim() && !isLoading) || isLoading}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              inputText.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-600 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 bg-gray-300 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
