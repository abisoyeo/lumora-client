import { Upload } from "lucide-react";
import { useRef } from "react";

const FileUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      onFileSelect(file);
    });
    // Clear input for re-upload of same file
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
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Upload file"
      >
        <Upload className="w-5 h-5" />
      </button>
    </>
  );
};

export default FileUpload;
