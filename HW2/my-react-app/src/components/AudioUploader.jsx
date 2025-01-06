import { useState } from 'react';
import { Upload, FileAudio } from 'lucide-react';

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes('audio')) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <label 
        htmlFor="audio-upload" 
        className={`relative block p-8 border-2 border-dashed rounded-xl cursor-pointer 
        transition-all duration-200 ease-in-out
        ${isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-blue-50">
            <FileAudio size={40} className="text-blue-500" />
          </div>
          <div className="text-center">
            <span className="font-medium text-gray-700">
              {file ? file.name : 'Upload your audio file'}
            </span>
            <p className="mt-1 text-sm text-gray-500">
              Click or drag and drop
            </p>
          </div>
        </div>
      </label>
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AudioUploader;