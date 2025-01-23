import TimestampDisplay from '../components/TimestampDisplay';
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import AudioUploader from '../components/AudioUploader';
import StarRating from '../components/StarRating';
import { Search, FileText, BookOpen } from 'lucide-react';
import HighlightedText from '../components/HighlightedText';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transcriptionResult, setTranscriptionResult] = useState({
    text: '',
    summary: '',
    words: [],
    audio_url: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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

  const handleTranscriptionComplete = async (result) => {
    setTranscriptionResult(result);
    if (user) {
      await saveTranscriptionToFirestore({
        text: result.text,
        summary: result.summary,
        words: result.words,
        audio_url: result.audio_url
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="main-title">Transform Audio to Text</h1>
      <p className="main-subtitle">
        Convert your audio files to text with high accuracy using SoundScribe
      </p>

      <section className="mb-12">
        <AudioUploader onTranscriptionComplete={handleTranscriptionComplete} />
      </section>

      <div className="content-grid">
        <section className="section-card transcribed-text">
          <h2 className="section-title">
            <FileText size={24} className="text-blue-500" />
            Transcribed Text
          </h2>
          <div className="section-content">
            <HighlightedText 
              text={transcriptionResult.text || 'Your transcribed text will appear here...'} 
              searchQuery={searchQuery}
            />
          </div>
        </section>

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

        <div className="timestamp-section">
          <TimestampDisplay 
            words={transcriptionResult.words} 
            searchQuery={searchQuery}
          />
        </div>

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
          />
        </section>
      </div>

      <section className="section-card text-center mb-12">
        <h2 className="section-title justify-center">Rate Your Experience</h2>
        <StarRating />
        <p className="mt-4 text-sm">Your feedback helps us improve our service</p>
      </section>
    </div>
  );
};

export default Home;