import { MessageCircle, Plus, Clock, FileText, File } from "lucide-react";
import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import { axiosInstance } from "../lib/axios";

const Dashboard = ({
  user,
  chatSessions,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreDocs, setHasMoreDocs] = useState(false);

  const fetchDocuments = async (page = 1) => {
    setDocumentsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/documents?page=${page}&per_page=10`
      );
      console.log(response);
      if (response.data.success) {
        const data = response.data;
        if (page === 1) {
          setDocuments(data.documents || []);
        } else {
          setDocuments((prev) => [...prev, ...(data.documents || [])]);
        }
        const totalDocs = data.total_count || 0;
        const loadedSoFar = page * 10;
        setHasMoreDocs(loadedSoFar < totalDocs);

        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileSelect = async (file) => {
    setUploading(true);
    setUploadSuccess(false);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post("/api/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchDocuments();
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleStartChatWithDocument = (document) => {
    onCreateNewSession({
      documentIds: [document.id],
      title: `Chat with ${
        document.original_filename || document.metadata?.title
      }`,
      context: `Starting chat with document: ${
        document.original_filename || document.metadata?.title
      }`,
    });
  };

  const loadMoreDocuments = () => {
    if (!documentsLoading && hasMoreDocs) {
      fetchDocuments(currentPage + 1);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await axiosInstance.delete(`/api/documents/${docId}`);

      // remove from UI
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("❌ Failed to delete document. Please try again.");
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-0">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold text-emerald-400 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-400">
          Manage your conversations and access your personalized tax assistance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Conversations</p>
              <p className="text-2xl font-bold text-emerald-400">
                {chatSessions.length}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-emerald-400">
                {
                  chatSessions.filter((s) => {
                    const thisMonth = new Date();
                    thisMonth.setDate(1);
                    return s.timestamp >= thisMonth;
                  }).length
                }
              </p>
            </div>
            <Clock className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Account Type</p>
              <p className="text-2xl font-bold text-emerald-400">Premium</p>
            </div>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-slate-900 font-bold">P</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 md:gap-y-1">
          <button
            onClick={() => onCreateNewSession()}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 p-4 rounded-xl flex items-center space-x-3 transition-all cursor-pointer group"
          >
            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Start New Chat</span>
          </button>

          <FileUpload
            onFileSelect={handleFileSelect}
            variant="button"
            label="Upload Document"
            disabled={uploading}
          />
          <div className="min-h-[20px] col-span-1 sm:col-span-2 flex justify-end">
            {uploading && (
              <p className="text-sm text-emerald-400 animate-pulse">
                Uploading document...
              </p>
            )}
            {uploadSuccess && !uploading && (
              <p className="text-sm text-emerald-400">✅ Upload successful!</p>
            )}
            {uploadError && (
              <p className="text-sm text-red-400">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="mb-4 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Your Documents
        </h2>

        {documentsLoading && documents.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-400">Loading documents...</p>
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:bg-slate-700 transition-all group flex flex-col"
                >
                  {/* Document Info */}
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-200 mb-1 text-sm md:text-base line-clamp-4">
                        {doc.original_filename || doc.metadata?.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {doc.file_type && `${doc.file_type.toUpperCase()} • `}
                        {doc.file_size_bytes &&
                          formatFileSize(doc.file_size_bytes)}
                        {doc.upload_date &&
                          ` • ${formatDate(new Date(doc.upload_date))}`}
                      </p>
                      {doc.metadata.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {doc.metadata.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleStartChatWithDocument(doc)}
                      className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm rounded-lg transition-all cursor-pointer font-medium flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Start Chat</span>
                    </button>

                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-400 text-white text-sm rounded-lg transition-all cursor-pointer font-medium"
                      title="Delete document"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreDocs && (
              <button
                onClick={loadMoreDocuments}
                disabled={documentsLoading}
                className="w-full py-3 text-emerald-400 hover:text-emerald-300 text-center border border-slate-700 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {documentsLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
                    <span>Loading more...</span>
                  </div>
                ) : (
                  "Load More Documents"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-800 rounded-xl border border-slate-700">
            <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No documents uploaded
            </h3>
            <p className="text-gray-400 mb-4">
              Upload your first document to start getting contextual assistance
            </p>
          </div>
        )}
      </div>

      {/* Recent Conversations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Recent Conversations
        </h2>
        <div className="grid gap-4">
          {chatSessions.length > 0 ? (
            chatSessions.map((session) => (
              <div
                key={session.id}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-6 text-left transition-all group flex justify-between items-start"
              >
                <button
                  onClick={() => onSelectSession(session)}
                  className="flex-1 text-left"
                >
                  <h3 className="font-semibold text-gray-200 mb-2 group-hover:text-emerald-400 transition-colors">
                    {session.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {session.lastMessage}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(session.timestamp)}
                    <span className="mx-2">•</span>
                    <span>{session.messages.length} messages</span>
                    {session.documentIds && session.documentIds.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <FileText className="w-3 h-3 mr-1" />
                        <span>
                          {session.documentIds.length} doc
                          {session.documentIds.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="ml-4 text-red-50 hover:text-red-100 cursor-pointer bg-red-500 rounded-lg flex items-center justify-center w-6 h-6"
                  title="Delete conversation"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start your first conversation to get personalized tax advice
              </p>
              <button
                onClick={() => onCreateNewSession()}
                className="px-6 py-3 bg-emerald-500 text-slate-900 rounded-lg hover:bg-emerald-400 transition-all cursor-pointer font-medium"
              >
                Start First Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
