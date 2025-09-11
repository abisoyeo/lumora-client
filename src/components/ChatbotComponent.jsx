import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Crown, MessageCircle, FileText } from "lucide-react";
import { useChat } from "../hooks/useChat";
import TypingIndicator from "./TypingIndicator";
import { axiosInstance } from "../lib/axios";

export default function ChatbotComponent({
  user,
  currentSession,
  onUpdateSession,
  onLogin,
}) {
  const [isUploading, setIsUploading] = useState(false);

  const {
    messages,
    setMessages,
    inputText,
    setInputText,
    isTyping,
    handleSendMessage,
    messagesEndRef,
    scrollToBottom,
  } = useChat(user, currentSession, onUpdateSession);

  const handleFileSelect = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true); // ✅ start loading

      const response = await axiosInstance.post(
        "/api/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newDocId = response.data.document_id;

      // ✅ append document id
      const updatedSession = {
        ...currentSession,
        documentIds: [...(currentSession.documentIds || []), newDocId],
      };

      // ✅ system message
      const systemMessage = {
        id: Date.now(),
        text: `📄 ${file.name} uploaded successfully. You can now start chatting with this document.`,
        isBot: true,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, systemMessage];

      setMessages(updatedMessages);

      onUpdateSession?.({
        ...updatedSession,
        messages: updatedMessages,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = {
        id: Date.now(),
        text: `❌ Upload failed: ${
          error.response?.data?.detail || "Unsupported file type."
        }`,
        isBot: true,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, errorMessage];
      setMessages(updatedMessages);

      onUpdateSession?.({
        ...currentSession,
        messages: updatedMessages,
      });
    } finally {
      setIsUploading(false); // ✅ stop loading
    }
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const hasDocumentContext =
    currentSession?.documentIds && currentSession.documentIds.length > 0;

  return (
    <div className="text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col min-h-screen sm:min-h-0">
        {messages.length === 0 && (
          <div className="flex items-center justify-center">
            <div className="text-center max-w-2xl">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-15 h-15 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                <MessageCircle className="md:w-10 md:h-10 text-slate-900" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2 md:mb-4">
                Welcome to Lumora
              </h1>
              <p className="text-l text-gray-300 mb-3 md:mb-6">
                Your intelligent assistant for Nigerian tax laws and business
                regulations
              </p>

              {/* ✅ ADDED: Show document context info if available */}
              {hasDocumentContext && (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-emerald-400 mr-2" />
                    <span className="text-emerald-400 font-medium">
                      Document Context Active
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    This chat includes context from{" "}
                    {currentSession.documentIds.length} uploaded document
                    {currentSession.documentIds.length > 1 ? "s" : ""}. Ask
                    questions about your documents for personalized assistance.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-8">
                <div className="bg-slate-800 p-3 md:p-6 rounded-xl border border-slate-700">
                  <h3 className="font-semibold text-emerald-400 mb-2">
                    Free Access
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Ask questions about Nigerian tax laws, VAT registration, and
                    business compliance
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 p-3 md:p-6 rounded-xl border border-emerald-500/30">
                  <h3 className="font-semibold text-emerald-400 mb-2 flex items-center justify-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Premium Features
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Chat history, document uploads, personalized advice, and
                    priority support
                  </p>
                  {!user && (
                    <button
                      onClick={onLogin}
                      className="w-full px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all text-sm font-medium"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 overflow-y-auto p-2 pb-30 md:p-6 md:pb-25 space-y-4 min-h-0 ">
            {hasDocumentContext && (
              <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center text-emerald-400 text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>
                    Document context active ({currentSession.documentIds.length}{" "}
                    document{currentSession.documentIds.length > 1 ? "s" : ""})
                  </span>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-slate-700 py-2 md:py-1 md:pb-2 px-4 md:px-1">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            inputText={inputText}
            setInputText={setInputText}
            onSendMessage={handleSendMessage}
            onFileSelect={handleFileSelect}
            isLoading={isTyping}
            isUploading={isUploading}
            user={user}
          />
        </div>
        <div className="mt-3 text-xs text-gray-400 text-center">
          {!user ? (
            <span>
              Login for premium features including chat history and document
              uploads
            </span>
          ) : user.isPremium ? (
            <span>Premium user - All features enabled</span>
          ) : (
            <span>Free user - Upgrade for advanced features</span>
          )}
        </div>
      </div>
    </div>
  );
}
