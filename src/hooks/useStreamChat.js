import { useEffect, useRef, useState } from "react";
import { streamChat } from "../lib/streamChat";

export function useChat(defaultMessage) {
  // ✅ ensure messages starts as [] if nothing in localStorage or defaultMessage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) return JSON.parse(saved);
    return defaultMessage ? [defaultMessage] : [];
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // 1) Push user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // 2) Create a stable bot placeholder
    const botId = `${userMessage.id}-bot`;
    setMessages((prev) => [
      ...prev,
      { id: botId, text: "", isBot: true, timestamp: Date.now() },
    ]);
    scrollToBottom();

    // 3) Stream from backend
    const controller = new AbortController();

    await streamChat({
      body: {
        query: userMessage.text,
        session_token: "hardcoded_string25",
      },
      // useChat.js
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, text: (m.text || "") + chunk, isDone: false }
              : m
          )
        );
        scrollToBottom();
      },
      onDone: () => {
        setIsTyping(false);
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, isDone: true } : m))
        );
        if (window.innerWidth <= 768 && textareaRef.current) {
          setTimeout(() => textareaRef.current?.focus(), 50);
        }
      },

      onError: (err) => {
        console.error("SSE error:", err);
        setIsTyping(false);
        setMessages((prev) =>
          prev.map((m) =>
            m && m.id === botId
              ? {
                  ...m,
                  text:
                    m.text ||
                    "Sorry, something went wrong while streaming the reply.",
                }
              : m
          )
        );
      },
      signal: controller.signal,
    });

    return () => controller.abort();
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
