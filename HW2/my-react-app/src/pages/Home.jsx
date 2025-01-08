import { useState } from 'react';
import AudioUploader from '../components/AudioUploader';
import StarRating from '../components/StarRating';
import { Search, Clock, FileText, ListTodo, BookOpen } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState({
    text: '',
    chapters: [],
    speakers: [],
    summary: ''
  });

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const pad = (num) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="main-title">Transform Audio to Text</h1>
      <p className="main-subtitle">
        Convert your audio files to text with high accuracy using SoundScribe
      </p>

      <section className="mb-12">
        <AudioUploader onTranscriptionComplete={setTranscriptionResult} />
      </section>

      <div className="content-grid">
        {/* Text Output Section */}
        <section className="section-card">
          <h2 className="section-title">
            <FileText size={24} className="text-blue-500" />
            Transcribed Text
          </h2>
          <div className="section-content">
            <p>{transcriptionResult.text || 'Your transcribed text will appear here...'}</p>
          </div>
        </section>

        {/* Notes Section */}
        <section className="section-card">
          <h2 className="section-title">
            <ListTodo size={24} className="text-blue-500" />
            Notes & Topics
          </h2>
          <div className="section-content">
            <p>
              {transcriptionResult.chapters?.map((chapter, index) => (
                <div key={index} className="mb-2">
                  • {chapter.gist}
                </div>
              )) || 'Your notes will appear here...'}
            </p>
          </div>
        </section>

        {/* Summary Section */}
        <section className="section-card">
          <h2 className="section-title">
            <BookOpen size={24} className="text-blue-500" />
            Summary
          </h2>
          <div className="section-content mb-4">
            <p>{transcriptionResult.summary || 'Summary will appear here...'}</p>
          </div>
          <button 
            onClick={() => {
              if (transcriptionResult.text && !transcriptionResult.summary) {
                setTranscriptionResult(prev => ({
                  ...prev,
                  summary: 'Generating summary...'
                }));
              }
            }}
            disabled={!transcriptionResult.text || transcriptionResult.summary}
            className="generate-button"
          >
            Generate Summary
          </button>
        </section>

        {/* Timestamp Section */}
        <section className="section-card">
          <h2 className="section-title">
            <Clock size={24} className="text-blue-500" />
            Topic Timestamps
          </h2>
          <div className="section-content">
            {transcriptionResult.chapters?.length > 0 ? (
              transcriptionResult.chapters.map((chapter, index) => {
                const timeInSeconds = Math.floor(chapter.start / 1000);
                const formattedTime = formatTime(timeInSeconds);

                return (
                  <div key={index} className="timestamp-item">
                    <Clock size={16} className="text-blue-500" />
                    <span>{formattedTime} - {chapter.headline}</span>
                  </div>
                );
              })
            ) : (
              <div className="timestamp-item">
                <Clock size={16} className="text-blue-500" />
                <span>00:00 - Introduction</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Search Section */}
      <section className="section-card mb-12">
        <h2 className="section-title">
          <Search size={24} className="text-blue-500" />
          Search Text
        </h2>
        <input
          type="text"
          placeholder="Search for specific words or phrases..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      {/* Rating Section */}
      <section className="section-card text-center mb-12">
        <h2 className="section-title justify-center">Rate Your Experience</h2>
        <StarRating />
        <p className="mt-4 text-sm">Your feedback helps us improve our service</p>
      </section>
    </div>
  );
};

export default Home;