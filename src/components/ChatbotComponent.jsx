// import { useEffect } from "react";
// import ChatMessage from "./ChatMessage";
// import ChatInput from "./ChatInput";
// import { Crown, MessageCircle } from "lucide-react";
// import { useChat } from "../hooks/useChat";

// export default function ChatbotComponent() {
//   const {
//     messages,
//     inputText,
//     setInputText,
//     isTyping,
//     handleSendMessage,
//     messagesEndRef,
//     scrollToBottom,
//   } = useChat();

//   const handleFileSelect = (file) => {
//     const fileMessage = {
//       id: Date.now(),
//       text: `Uploaded: ${file.name}`,
//       file: file,
//       isBot: false,
//       timestamp: Date.now(),
//     };
//     // handle file message if needed
//   };

//   useEffect(() => {
//     if (messages.length > 0) scrollToBottom();
//   }, [messages]);

//   return (
//     <div className="text-gray-100 flex flex-col min-h-screen">
//       {/* Messages / Empty state */}
//       <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center flex-grow p-6">
//             <div className="text-center max-w-2xl">
//               <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <MessageCircle className="w-10 h-10 text-slate-900" />
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-4">
//                 Welcome to Lumora
//               </h1>
//               <p className="text-lg text-gray-300 mb-6">
//                 Your intelligent assistant for Nigerian tax laws and business
//                 regulations
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
//                   <h3 className="font-semibold text-emerald-400 mb-2">
//                     Free Access
//                   </h3>
//                   <p className="text-gray-300 text-sm">
//                     Ask questions about Nigerian tax laws, VAT registration, and
//                     business compliance
//                   </p>
//                 </div>
//                 <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-6 rounded-xl border border-emerald-500/30">
//                   <h3 className="font-semibold text-emerald-400 mb-2 flex items-center">
//                     <Crown className="w-4 h-4 mr-2" /> Premium Features
//                   </h3>
//                   <p className="text-gray-300 text-sm mb-3">
//                     Chat history, document uploads, personalized advice, and
//                     priority support
//                   </p>
//                   <button className="w-full px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all text-sm font-medium">
//                     Upgrade to Premium
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="p-6 space-y-4" style={{ overflowY: 'auto' }}>
//             {messages.map((message) => (
//               <ChatMessage key={message.id} message={message} />
//             ))}

//             {isTyping && (
//               <div className="flex items-start space-x-3">
//                 <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
//                   <MessageCircle className="w-4 h-4 text-slate-900" />
//                 </div>
//                 <div className="bg-slate-700 rounded-2xl px-4 py-3 max-w-xs">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Input fixed at bottom */}
//       <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 py-1 md:pb-2 px-4 sm:px-0">
//         <div className="max-w-4xl mx-auto">
//           <ChatInput
//             inputText={inputText}
//             setInputText={setInputText}
//             onSendMessage={handleSendMessage}
//             onFileSelect={handleFileSelect}
//             isLoading={isTyping}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

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
import { useChat } from "../hooks/useChat";

export default function ChatbotComponent() {
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    handleSendMessage,
    messagesEndRef,
    scrollToBottom,
  } = useChat();

  const handleFileSelect = (file) => {
    const fileMessage = {
      id: Date.now(),
      text: `Uploaded: ${file.name}`,
      file: file,
      isBot: false,
      timestamp: Date.now(),
    };
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col min-h-0">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-2 md:p-6">
            <div className="text-center max-w-2xl">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-15 h-15 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <MessageCircle className="md:w-10 md:h-10 text-slate-900" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-4">
                Welcome to Lumora
              </h1>
              <p className="text-l text-gray-300 mb-6">
                Your intelligent assistant for Nigerian tax laws and business
                regulations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <h3 className="font-semibold text-emerald-400 mb-2">
                    Free Access
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Ask questions about Nigerian tax laws, VAT registration, and
                    business compliance
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-6 rounded-xl border border-emerald-500/30">
                  <h3 className="font-semibold text-emerald-400 mb-2 flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Premium Features
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Chat history, document uploads, personalized advice, and
                    priority support
                  </p>
                  {/* {!user && ( */}
                  <button
                    // onClick={onLogin}
                    className="w-full px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all text-sm font-medium"
                  >
                    Upgrade to Premium
                  </button>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-2 md:p-6 space-y-4 min-h-0  pb-15">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
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
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-slate-700 py-1 md:pb-2 px-4 sm:px-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            onFileSelect={handleFileSelect}
            isLoading={isTyping}
          />
        </div>
      </div>
    </div>
  );
}
