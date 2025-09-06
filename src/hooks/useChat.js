import { useEffect, useRef, useState } from "react";
import { sendMessageFree, sendMessagePremium } from "../lib/api";

export function useChat(user, currentSession, onUpdateSession) {
  const [messages, setMessages] = useState(currentSession?.messages || []);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sessionToken =
    localStorage.getItem("sessionToken") ||
    Math.random().toString(36).substring(2, 10);
  localStorage.setItem("sessionToken", sessionToken);

  // Reset when session changes
  useEffect(() => {
    setMessages(currentSession?.messages || []);
  }, [currentSession?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendFreeMessageToServer = async (message) => {
    try {
      const response = await sendMessageFree(message);
      return (
        response.answer ??
        response.error ??
        "❌ Sorry, something went wrong. Please try again."
      );
    } catch (error) {
      console.error(error);
      return (
        error.message || "❌ Sorry, something went wrong. Please try again."
      );
    }
  };

  const sendPremiumMessageToServer = async (message) => {
    try {
      const response = await sendMessagePremium(message);
      return (
        response.answer ??
        response.error ??
        "❌ Sorry, something went wrong. Please try again."
      );
    } catch (error) {
      console.error(error);
      return (
        error.message || "❌ Sorry, something went wrong. Please try again."
      );
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    onUpdateSession?.({ ...currentSession, messages: updatedMessages });

    setInputText("");
    setIsTyping(true);

    const replyText = user?.isPremium
      ? await sendPremiumMessageToServer({
          query: userMessage.text,
          session_token: "",
        })
      : await sendFreeMessageToServer({
          query: userMessage.text,
          session_token: sessionToken,
        });

    const botMessage = {
      id: Date.now(),
      text: replyText,
      isBot: true,
      timestamp: Date.now(),
    };

    const finalMessages = [...updatedMessages, botMessage];
    setMessages(finalMessages);

    onUpdateSession?.({ ...currentSession, messages: finalMessages });

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
