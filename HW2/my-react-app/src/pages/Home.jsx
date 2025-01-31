/**
 * Home.jsx
 * Main page component of SoundScribe application.
 * Handles audio file transcription, text search, and result display.
 * 
 * Key Features:
 * - Audio file upload and transcription
 * - Multi-language support (English, Hebrew, Arabic)
 * - Text search functionality
 * - Timestamp-based navigation
 * - User feedback collection
 * - Automatic transcription saving for logged-in users
 */

import TimestampDisplay from '../components/TimestampDisplay';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import AudioUploader from '../components/AudioUploader';
import StarRating from '../components/StarRating';
import { Search, FileText, BookOpen } from 'lucide-react';
import HighlightedText from '../components/HighlightedText';
import { useLanguage } from '../utils/LanguageContext';
import SearchResults from '../components/SearchResults';

const Home = () => {
  // Language context for multi-language support
  const { language } = useLanguage();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState({
    text: '',          // Transcribed text content
    summary: '',       // Summary (English only)
    words: [],         // Word-level timing data
    audio_url: '',     // Source audio file URL
    title: ''          // Transcription title
  });
  const [user, setUser] = useState(null);  // Current authenticated user

  /**
   * Firebase authentication listener
   * Updates user state when auth state changes
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();  // Cleanup on unmount
  }, []);

  /**
   * Saves transcription data to Firestore for authenticated users
   * Adds timestamp and unique ID to transcription data
   * 
   * @param {Object} transcriptionData - Transcription result to save
   * @param {string} transcriptionData.text - Transcribed text
   * @param {string} transcriptionData.summary - Summary (if available)
   * @param {Array} transcriptionData.words - Word timing data
   * @param {string} transcriptionData.audio_url - Audio file URL
   * @param {string} transcriptionData.title - Transcription title
   */
  const saveTranscriptionToFirestore = async (transcriptionData) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          transcriptions: arrayUnion({
            id: Date.now().toString(),
            ...transcriptionData,
            timestamp: new Date()
          })
        });
      }
    } catch (error) {
      console.error("Error saving transcription:", error);
    }
  };

  /**
   * Handles successful transcription completion
   * Updates local state and saves to Firestore
   * 
   * @param {Object} result - Transcription API result
   */
  const handleTranscriptionComplete = async (result) => {
    setTranscriptionResult(result);
    if (user) {
      await saveTranscriptionToFirestore({
        text: result.text,
        summary: result.summary,
        words: result.words,
        audio_url: result.audio_url,
        title: result.title
      });
    }
  };

  /**
   * Determines text direction based on selected language
   * Returns 'rtl' for Arabic/Hebrew, 'ltr' for others
   */
  const getTextDirection = () => {
    return language === 'ar' || language === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <h1 className="main-title">Transform Audio to Text</h1>
      <p className="main-subtitle">
        Convert your audio files to text with high accuracy using SoundScribe
      </p>

      {/* Audio Upload Section */}
      <section className="mb-12">
        <AudioUploader onTranscriptionComplete={handleTranscriptionComplete} />
      </section>

      {/* Results Grid */}
      <div className="content-grid">
        {/* Transcribed Text Section */}
        <section className="section-card transcribed-text">
          <h2 className="section-title">
            <FileText size={24} className="text-blue-500" />
            Transcribed Text
            {transcriptionResult.title && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                - {transcriptionResult.title}
              </span>
            )}
          </h2>
          <div className={`section-content`} dir={getTextDirection()}>
            <HighlightedText 
              text={transcriptionResult.text || 'Your transcribed text will appear here...'} 
              searchQuery={searchQuery}
            />
          </div>
        </section>

        {/* Summary Section - English Only */}
        {language === 'en_us' && (
          <section className="section-card summary-section">
            <h2 className="section-title">
              <BookOpen size={24} className="text-blue-500" />
              Summary
            </h2>
            <div className="section-content mb-4">
              <HighlightedText 
                text={transcriptionResult.summary || 'Summary will appear here...'} 
                searchQuery={searchQuery}
              />
            </div>
          </section>
        )}

        {/* Timestamp Navigation Section */}
        <div className="timestamp-section">
          <TimestampDisplay 
            words={transcriptionResult.words} 
            searchQuery={searchQuery}
          />
        </div>

        {/* Search Section */}
        <section className="section-card search-section">
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
            dir={getTextDirection()}
          />
          <SearchResults 
            words={transcriptionResult.words} 
            searchQuery={searchQuery}
          />
        </section>
      </div>

      {/* User Feedback Section */}
      <section className="section-card text-center mb-12">
        <h2 className="section-title justify-center">Rate Your Experience</h2>
        <StarRating />
        <p className="mt-4 text-sm">Your feedback helps us improve our service</p>
      </section>
    </div>
  );
};

export default Home;