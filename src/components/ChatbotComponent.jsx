import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  Crown,
  LucideMessageCircle,
  MessageCircle,
  MessageCircleIcon,
} from "lucide-react";
import Header from "./Header";

export default function ChatbotComponent() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = [
    "That's really interesting! I'd be happy to help you explore this further.",
    "I understand what you're asking. Let me break this down for you.",
    "Thanks for sharing that with me. Here's my perspective on this topic.",
    "Great question! This is something I can definitely help you with.",
    "I see what you mean. Let me provide some insights on this.",
    "That's a thoughtful message. I appreciate you taking the time to explain.",
  ];

  const handleSendMessage = () => {
    if (!inputText.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isBot: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleFileSelect = (file) => {
    // Add file message
    const fileMessage = {
      id: Date.now(),
      text: `Uploaded: ${file.name}`,
      file: file,
      isBot: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, fileMessage]);

    // Simulate bot response to file
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: `I can see you've uploaded "${file.name}". While I can't actually process files in this demo, in a real implementation I would analyze the content and provide relevant insights!`,
        isBot: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 text-gray-100">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-slate-900" />
            </div>
            <h1 className="text-4xl font-bold text-emerald-400 mb-4">
              Welcome to Lumora
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Your intelligent assistant for Nigerian tax laws and business
              regulations
            </p>
            <div className="grid grid-cols-1 mx-auto mb-8">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                {/* <h3 className="font-semibold text-emerald-400 mb-2">Free Access</h3> */}
                <p className="text-gray-300 text-sm">
                  Ask questions about Nigerian tax laws, VAT registration, and
                  business compliance
                </p>
              </div>
              {/* <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-6 rounded-xl border border-emerald-500/30">
            <h3 className="font-semibold text-emerald-400 mb-2 flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              Premium Features
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Chat history, document uploads, personalized advice, and priority
              support
            </p>
          </div> */}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="bg-slate-800 rounded-xl shadow-lg min-h-[500px] flex flex-col">
          {" "}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-slate-900" />
                </div>
                <div className="bg-slate-700 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
          />
        </div>
        {/* Input Area */}
      </div>
    </div>
  );
}
