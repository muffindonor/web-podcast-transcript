import { useState } from 'react';
import AudioUploader from '../components/AudioUploader';
import StarRating from '../components/StarRating';
import { Search, Clock, BookOpen, FileText, ListTodo } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 style={{ color: 'var(--primary-text)' }} className="text-4xl md:text-6xl font-bold text-center mb-8">
        Transform Audio to Text
      </h1>
      <p style={{ color: 'var(--secondary-text)' }} className="text-lg md:text-xl text-center mb-12 max-w-2xl mx-auto">
        Convert your audio files to text with high accuracy using SoundScribe
      </p>

      {/* Audio Upload Section */}
      <section className="mb-12">
        <AudioUploader />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Text Output Section */}
        <section className="section-card">
          <h2 className="section-title">
            <FileText size={24} className="text-blue-500" />
            Transcribed Text
          </h2>
          <div className="section-content min-h-[200px]">
            <p className="text-gray-500">Your transcribed text will appear here...</p>
          </div>
        </section>

        {/* Notes Section */}
        <section className="section-card">
          <h2 className="section-title">
            <ListTodo size={24} className="text-blue-500" />
            Notes & Topics
          </h2>
          <div className="section-content min-h-[200px]">
            <p className="text-gray-500">Your notes will appear here...</p>
          </div>
        </section>

        {/* Summary Section */}
        <section className="section-card">
          <h2 className="section-title">
            <BookOpen size={24} className="text-blue-500" />
            Summary
          </h2>
          <div className="section-content min-h-[200px] mb-4">
            <p className="text-gray-500">Summary will appear here...</p>
          </div>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
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
            <div className="timestamp-item">
              <Clock size={16} />
              <span>00:00 - Introduction</span>
            </div>
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
        <p className="mt-4 text-sm text-gray-500">
          Your feedback helps us improve our service
        </p>
      </section>
    </div>
  );
};

export default Home;