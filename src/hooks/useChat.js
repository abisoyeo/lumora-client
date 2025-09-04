// import { useEffect, useRef, useState } from "react";
// import { sendMessage } from "../lib/api";

// export function useChat(defaultMessage) {
//   const [messages, setMessages] = useState(() => {
//     const saved = localStorage.getItem("chatMessages");
//     return saved ? JSON.parse(saved) : [defaultMessage];
//   });
//   const [inputText, setInputText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     localStorage.setItem("chatMessages", JSON.stringify(messages));
//   }, [messages]);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const paymentStatus = params.get("payment");

//     if (paymentStatus === "success") {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           text: "✅ Payment successful! Your order has been confirmed. 🎉",
//           isBot: true,
//           time: new Date(),
//         },
//       ]);
//     } else if (paymentStatus === "failed") {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           text: "❌ Payment failed. Type 5 to try again or choose another method.",
//           isBot: true,
//           time: new Date(),
//         },
//       ]);
//     }
//   }, []);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const sendMessageToServer = async (message) => {
//     try {
//       const response = await sendMessage(message);
//       console.log(response);
//       return response.answer;
//     } catch (error) {
//       console.error(error);
//       return "Sorry, something went wrong. Please try again.";
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = {
//       id: messages.length + 1,
//       text: inputText,
//       isBot: false,
//       timestamp: Date.now(),
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputText("");

//     const replyText = await sendMessageToServer({
//       query: userMessage.text,
//       session_token: "hardcoded_string2",
//     });
//     console.log(replyText);
//     setIsTyping(true);

//     if (window.innerWidth <= 768 && textareaRef.current) {
//       setTimeout(() => {
//         textareaRef.current.focus();
//       }, 50);
//     }

//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now(),
//           text: replyText,
//           isBot: true,
//           timestamp: Date.now(),
//         },
//       ]);
//       setIsTyping(false);
//       if (window.innerWidth <= 768 && textareaRef.current) {
//         setTimeout(() => {
//           textareaRef.current.focus();
//         }, 100);
//       }
//     }, 1200);
//   };

//   return {
//     messages,
//     inputText,
//     setInputText,
//     isTyping,
//     handleSendMessage,
//     messagesEndRef,
//     scrollToBottom,
//     textareaRef,
//   };
// }
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
        session_token: "hardcoded_string22",
      },
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (!m) return m; // ✅ guard against null/undefined
            return m.id === botId ? { ...m, text: (m.text || "") + chunk } : m;
          })
        );
        scrollToBottom();
      },
      onDone: () => {
        setIsTyping(false);
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
