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
    // Update session token when session changes
    sessionTokenRef.current = getSessionToken(currentSession, user?.isPremium);
  }, [currentSession?.id, user?.isPremium]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateToken = () => Math.random().toString(36).substring(2, 10);

  const getSessionToken = (session, isPremium) => {
    // For premium users, generate a new token per session
    // For free users, use a single token stored in localStorage
    if (isPremium) {
      // Check if session already has a token stored
      if (session?.sessionToken) {
        return session.sessionToken;
      }
      // Generate new token for this session
      return generateToken();
    } else {
      // Free users still use persistent token
      const storageKey = "freeSessionToken";
      let token = localStorage.getItem(storageKey);
      if (!token) {
        token = generateToken();
        localStorage.setItem(storageKey, token);
      }
      return token;
    }
  };

  const sessionTokenRef = useRef(getSessionToken(currentSession, user?.isPremium));

  const sendMessageToServer = async (messageText) => {
    try {
      const documentIds = currentSession?.documentIds || [];

      // For premium users, ensure the session token is saved to the session
      if (user?.isPremium && currentSession && !currentSession.sessionToken) {
        // Update the session with the token through the callback
        onUpdateSession?.({
          ...currentSession,
          sessionToken: sessionTokenRef.current,
        });
      }

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
      sessionToken: user?.isPremium ? sessionTokenRef.current : undefined,
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
      sessionToken: user?.isPremium ? sessionTokenRef.current : undefined,
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
