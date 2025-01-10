import { useState } from 'react';
import { FileAudio } from 'lucide-react';

// AudioUploader component to handle the file upload and transcription process
const AudioUploader = ({ onTranscriptionComplete }) => {
  const [file, setFile] = useState(null);  // State to store the selected file
  const [isTranscribing, setIsTranscribing] = useState(false);  // State to track if transcription is in progress
  const [uploadProgress, setUploadProgress] = useState(0);  // State to track the upload progress
  const [error, setError] = useState(null);  // State to store any error messages

  // Handle file input change (selecting a file)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];  // Get the selected file
    if (selectedFile && selectedFile.type.includes('audio')) {  // Check if it's an audio file
      setFile(selectedFile);  // Set the selected file
      setError(null);  // Reset any error message
    }
  };

  // Handle the transcription process
  const handleTranscribe = async () => {
    if (!file) {  // If no file is selected, set an error message
      setError('No file selected');
      return;
    }

    try {
      setError(null);  // Clear any previous error
      setIsTranscribing(true);  // Start transcription process
      console.log('Starting transcription process...', file);

      // Upload the selected file to the AssemblyAI API
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': "361415b9f3e244d5abc4def7278d3005"  // Replace with your actual API key
        },
        body: file  // Send the file as the request body
      });

      if (!uploadResponse.ok) {  // Check if the upload was successful
        throw new Error('Upload failed: ' + await uploadResponse.text());
      }

      const uploadResult = await uploadResponse.json();  // Parse the response from the upload
      console.log('Upload successful, URL:', uploadResult.upload_url);

      // Request transcription from the AssemblyAI API
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': import.meta.env.VITE_ASSEMBLY_AI_KEY,  // Replace with your actual API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: uploadResult.upload_url,  // Pass the uploaded audio URL
          language_code: "en_us",  // Set the language code for transcription
          punctuate: true,  // Enable punctuation in the transcription
          format_text: true  // Format the text output
        })
      });

      if (!transcriptResponse.ok) {  // Check if the transcription request was successful
        throw new Error('Transcription request failed: ' + await transcriptResponse.text());
      }

      const transcriptResult = await transcriptResponse.json();  // Parse the transcription response
      console.log('Transcription initiated:', transcriptResult);

      // Function to poll the transcription status until it's completed
      const checkCompletion = async (transcriptId) => {
        const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
        let attempts = 0;  // Initialize the attempt counter
        const maxAttempts = 40;  // Set maximum attempts (2 minutes max polling)

        const pollInterval = setInterval(async () => {
          if (attempts >= maxAttempts) {  // If max attempts are reached, stop polling
            clearInterval(pollInterval);
            setError('Transcription timed out');
            setIsTranscribing(false);
            return;
          }

          try {
            const pollResponse = await fetch(pollingEndpoint, {
              headers: { 'Authorization': "361415b9f3e244d5abc4def7278d3005" }  // Replace with your actual API key
            });

            if (!pollResponse.ok) {  // If polling failed
              throw new Error('Polling failed');
            }

            const result = await pollResponse.json();  // Parse the polling response
            console.log('Complete API Response:', result);  // Log full response for debugging
            console.log('Available data fields:', Object.keys(result));  // Log available fields for inspection
            console.log(`Attempt ${attempts + 1}, Status: ${result.status}`);  // Log polling status

            if (result.status === 'completed') {  // If transcription is complete
              clearInterval(pollInterval);  // Stop polling
              onTranscriptionComplete({  // Call the onTranscriptionComplete callback with the results
                text: result.text || '',
                chapters: result.chapters || [],
                speakers: result.speaker_labels || [],
                summary: result.summary || ''
              });
              setIsTranscribing(false);  // Set transcription to finished
            } else if (result.status === 'error') {  // If transcription failed
              clearInterval(pollInterval);  // Stop polling
              throw new Error(result.error);  // Throw an error
            }

            attempts++;  // Increment attempt counter
          } catch (error) {  // Handle any errors during polling
            clearInterval(pollInterval);  // Stop polling on error
            console.error('Polling error:', error);
            setError(error.message);  // Set error state
            setIsTranscribing(false);  // Set transcription to finished
          }
        }, 3000);  // Poll every 3 seconds
      };

      await checkCompletion(transcriptResult.id);  // Start polling with the transcription ID

    } catch (error) {  // Handle any errors in the transcription process
      console.error('Transcription process error:', error);
      setError(error.message);  // Set error state
      setIsTranscribing(false);  // Set transcription to finished
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