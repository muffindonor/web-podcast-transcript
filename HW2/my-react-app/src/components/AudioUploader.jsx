import { useState } from 'react';
import { FileAudio } from 'lucide-react';

const AudioUploader = ({ onTranscriptionComplete }) => {
  const [file, setFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes('audio')) {
      setFile(selectedFile);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      console.log('Starting transcription process...');
      setIsTranscribing(true);

      console.log('File to upload:', file);

      // Upload the file
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': "361415b9f3e244d5abc4def7278d3005"
        },
        body: file
      });

      if (!uploadResponse.ok) {
        console.error('Upload failed:', await uploadResponse.text());
        return;
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload successful, URL:', uploadResult.upload_url);

      // Start transcription with only auto_chapters enabled
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': "361415b9f3e244d5abc4def7278d3005",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: uploadResult.upload_url,
          auto_chapters: false,
          auto_highlights: true // This will help with timestamps
        })
      });

      if (!transcriptResponse.ok) {
        console.error('Transcription request failed:', await transcriptResponse.text());
        return;
      }

      const transcriptResult = await transcriptResponse.json();
      console.log('Transcription initiated:', transcriptResult);

      // Poll for completion
      const checkCompletion = async (transcriptId) => {
        const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
        
        while (true) {
          const pollResponse = await fetch(pollingEndpoint, {
            headers: { 'Authorization': "361415b9f3e244d5abc4def7278d3005" }
          });
          
          const result = await pollResponse.json();
          console.log('Polling result:', result);
          
          if (result.status === 'completed') {
            console.log('Transcription completed. Full response:', result);
            console.log('Chapters:', result.chapters);
            onTranscriptionComplete({
              text: result.text,
              chapters: result.chapters || [],
              speakers: result.speaker_labels || [],
              summary: result.summary || ''
            });
            break;
          } else if (result.status === 'error') {
            console.error('Transcription error:', result.error);
            break;
          }
          
          // Wait for 3 seconds before polling again
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      };

      await checkCompletion(transcriptResult.id);

    } catch (error) {
      console.error('Transcription process error:', error);
    } finally {
      setIsTranscribing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label 
        htmlFor="audio-upload" 
        className={`relative block p-8 border-2 border-dashed rounded-xl cursor-pointer 
        transition-all duration-200 ease-in-out
        ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
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

      {file && (
        <div className="mt-4">
          <button
            onClick={handleTranscribe}
            disabled={isTranscribing}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium
              ${isTranscribing 
                ? 'bg-gray-400' 
                : 'bg-blue-500 hover:bg-blue-600'} 
              transition-colors`}
          >
            {isTranscribing ? 'Transcribing...' : 'Start Transcription'}
          </button>

          {isTranscribing && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioUploader;