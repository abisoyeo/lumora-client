import { useEffect, useRef, useState } from "react";
import { sendMessageFree, sendMessagePremium } from "../lib/api";

export function useChat(user, currentSession, onUpdateSession) {
  const [messages, setMessages] = useState(currentSession?.messages || []);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages(currentSession?.messages || []);
  }, [currentSession?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateToken = () => Math.random().toString(36).substring(2, 10);

  const getSessionToken = (isPremium) => {
    const storageKey = isPremium ? "premiumSessionToken" : "freeSessionToken";
    let token = localStorage.getItem(storageKey);

    if (!token) {
      token = generateToken();
      localStorage.setItem(storageKey, token);
    }

    return token;
  };

  const sessionTokenRef = useRef(getSessionToken(user?.isPremium));

  const sendMessageToServer = async (messageText) => {
    try {
      const documentIds = currentSession?.documentIds || [];

      const res = user?.isPremium
        ? await sendMessagePremium({
            query: messageText,
            access_token: sessionTokenRef.current,
            document_ids: documentIds,
          })
        : await sendMessageFree({
            query: messageText,
            access_token: sessionTokenRef.current,
          });

      return res.answer ?? res.error ?? "❌ Something went wrong.";
    } catch (err) {
      console.error(err);
      return err.message ?? "❌ Something went wrong.";
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

    onUpdateSession?.({
      ...currentSession,
      messages: updatedMessages,
      documentIds: currentSession?.documentIds || [],
    });

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

    onUpdateSession?.({
      ...currentSession,
      messages: finalMessages,
      documentIds: currentSession?.documentIds || [],
    });

    setIsTyping(false);

    if (window.innerWidth <= 768 && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 50);
    }
  };

  return {
    messages,
    setMessages,
    inputText,
    setInputText,
    isTyping,
    handleSendMessage,
    messagesEndRef,
    scrollToBottom,
    textareaRef,
  };
}
