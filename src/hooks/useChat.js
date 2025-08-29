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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "success") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "✅ Payment successful! Your order has been confirmed. 🎉",
          isBot: true,
          time: new Date(),
        },
      ]);
    } else if (paymentStatus === "failed") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "❌ Payment failed. Type 5 to try again or choose another method.",
          isBot: true,
          time: new Date(),
        },
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageToServer = async (message) => {
    try {
      const response = await sendMessage(message);
      return response.reply;
    } catch (error) {
      console.error(error);
      return "Sorry, something went wrong. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    const replyText = await sendMessageToServer({ message: userMessage.text });
    setIsTyping(true);

    if (window.innerWidth <= 768 && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 50);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: replyText, isBot: true, time: new Date() },
      ]);
      setIsTyping(false);
      if (window.innerWidth <= 768 && textareaRef.current) {
        setTimeout(() => {
          textareaRef.current.focus();
        }, 100);
      }
    }, 1200);
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
