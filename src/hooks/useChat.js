import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../lib/api";

export function useChat(defaultMessage) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [defaultMessage];
  });

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageToServer = async (message) => {
    try {
      const response = await sendMessage(message);
      return response.answer;
    } catch (error) {
      console.error(error);
      return "❌ Sorry, something went wrong. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // ✅ start typing indicator before request
    setIsTyping(true);

    const replyText = await sendMessageToServer({
      query: userMessage.text,
      session_token: "hardcoded_string27",
    });

    // ✅ stop typing indicator as soon as response is back
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: replyText,
        isBot: true,
        timestamp: Date.now(),
      },
    ]);
    setIsTyping(false);

    if (window.innerWidth <= 768 && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 50);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    handleSendMessage,
    messagesEndRef,
    scrollToBottom,
    textareaRef,
  };
}
