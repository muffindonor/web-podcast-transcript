// AudioUploader.jsx
import { useState } from 'react';
import { FileAudio } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { extractTitle } from '../utils/utils';

const AudioUploader = ({ onTranscriptionComplete }) => {
  const { language } = useLanguage();
  const [file, setFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes('audio')) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const getTranscriptionBody = (language, uploadResult) => {
    switch (language) {
      case 'he':
      case 'ar':
        return {
          audio_url: uploadResult.upload_url,
          language_code: language,
          speech_model: "nano",
          punctuate: true,
          format_text: true
        };
      case 'en_us':
        return {
          audio_url: uploadResult.upload_url,
          language_code: language,
          punctuate: true,
          format_text: true,
          summarization: true,
          summary_model: "informative",
          summary_type: "bullets"
        };
      default:
        throw new Error('Unsupported language');
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    try {
      setError(null);
      setIsTranscribing(true);

      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': "361415b9f3e244d5abc4def7278d3005"
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed: ' + await uploadResponse.text());
      }

      const uploadResult = await uploadResponse.json();

      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': '361415b9f3e244d5abc4def7278d3005',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(getTranscriptionBody(language, uploadResult))
      });

      if (!transcriptResponse.ok) {
        const errorText = await transcriptResponse.text();
        console.log('Error details:', errorText);
        throw new Error('Transcription request failed: ' + errorText);
      }

      const transcriptResult = await transcriptResponse.json();

      const checkCompletion = async (transcriptId) => {
        const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
        let attempts = 0;
        const maxAttempts = 40;

        const pollInterval = setInterval(async () => {
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setError('Transcription timed out');
            setIsTranscribing(false);
            return;
          }

          try {
            const pollResponse = await fetch(pollingEndpoint, {
              headers: { 'Authorization': "361415b9f3e244d5abc4def7278d3005" }
            });

            if (!pollResponse.ok) {
              throw new Error('Polling failed');
            }

            const result = await pollResponse.json();

            if (result.status === 'completed') {
              clearInterval(pollInterval);
              onTranscriptionComplete({
                text: result.text || '',
                summary: language === 'en_us' ? (result.summary || '') : '',
                words: result.words || [],
                audio_url: uploadResult.upload_url,
                title: extractTitle(file.name)
              });
              setIsTranscribing(false);
            } else if (result.status === 'error') {
              clearInterval(pollInterval);
              throw new Error(result.error);
            }

            attempts++;
          } catch (error) {
            clearInterval(pollInterval);
            setError(error.message);
            setIsTranscribing(false);
          }
        }, 3000);
      };

      await checkCompletion(transcriptResult.id);

    } catch (error) {
      setError(error.message);
      setIsTranscribing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <LanguageSelector />
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

      {error && (
        <div className="mt-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

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