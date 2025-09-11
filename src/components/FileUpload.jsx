import { Upload, FileText } from "lucide-react";
import { useRef } from "react";

const FileUpload = ({
  onFileSelect,
  variant = "icon",
  label,
  disabled = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      onFileSelect(file);
    });
    e.target.value = "";
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {variant === "icon" ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`p-2 rounded-lg transition-colors ${
            disabled
              ? "bg-slate-600 text-gray-500 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 hover:bg-[#30c522]"
          }`}
          title="Upload file"
        >
          {disabled ? (
            <div className="w-5 h-5 bg-slate-600 border-3 border-[#30c522] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </button>
      ) : (
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={`w-full p-4 rounded-xl flex items-center space-x-3 transition-all border border-slate-700 ${
              disabled
                ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-gray-200 group"
            }`}
          >
            <FileText className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />

            <span>{label || "Upload Document"}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default FileUpload;
