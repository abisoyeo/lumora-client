import { useEffect, useRef, useState } from "react";
import { sendMessageFree, sendMessagePremium } from "../lib/api";

export function useChat(user, currentSession, onUpdateSession) {
  const [messages, setMessages] = useState(currentSession?.messages || []);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sessionTokenRef = useRef(
    user?.isPremium
      ? currentSession?.sessionToken ||
          Math.random().toString(36).substring(2, 10)
      : localStorage.getItem("sessionToken") ||
          Math.random().toString(36).substring(2, 10)
  );

  // store it for premium users
  if (user?.isPremium && currentSession && !currentSession.sessionToken) {
    currentSession.sessionToken = sessionTokenRef.current;
  }

  // store it for free/anonymous users
  if (!user?.isPremium) {
    localStorage.setItem("sessionToken", sessionTokenRef.current);
  }

  // Reset messages when session changes
  useEffect(() => {
    setMessages(currentSession?.messages || []);
  }, [currentSession?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageToServer = async (messageText) => {
    if (user?.isPremium) {
      try {
        const res = await sendMessagePremium({
          query: messageText,
          session_token: sessionTokenRef.current,
        });
        return res.answer ?? res.error ?? "❌ Something went wrong.";
      } catch (err) {
        console.error(err);
        return err.message ?? "❌ Something went wrong.";
      }
    } else {
      try {
        const res = await sendMessageFree({
          query: messageText,
          session_token: sessionTokenRef.current,
        });
        return res.answer ?? res.error ?? "❌ Something went wrong.";
      } catch (err) {
        console.error(err);
        return err.message ?? "❌ Something went wrong.";
      }
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

    // Update session immediately with user's message
    onUpdateSession?.({ ...currentSession, messages: updatedMessages });

    setInputText("");
    setIsTyping(true);

    const botReply = await sendMessageToServer(userMessage.text);

    const botMessage = {
      id: Date.now(),
      text: botReply,
      isBot: true,
      timestamp: Date.now(),
    };

    const finalMessages = [...updatedMessages, botMessage];
    setMessages(finalMessages);

    // Final session update
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
