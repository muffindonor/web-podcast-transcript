import { Clock } from 'lucide-react';
import { formatTime, groupWordsIntoSentences } from '../utils/utils';
import HighlightedText from './HighlightedText';

const TimestampDisplay = ({ words, searchQuery }) => {
  const sentences = groupWordsIntoSentences(words);

  return (
    <section className="section-card">
      <h2 className="section-title">
        <Clock size={24} className="text-blue-500" />
        Sentence Timestamps
      </h2>
      <div className="section-content">
        {sentences.length > 0 ? (
          sentences.map((sentence, index) => {
            const timeInSeconds = Math.floor(sentence.start / 1000);
            const formattedTime = formatTime(timeInSeconds);

            return (
              <div key={index} className="timestamp-item">
                <Clock size={16} className="text-blue-500" />
                <span>{formattedTime}</span>
                <span className="ml-2">-</span>
                <span className="ml-2">
                  <HighlightedText text={sentence.text} searchQuery={searchQuery} />
                </span>
              </div>
            );
          })
        ) : (
          <div className="timestamp-item">
            <Clock size={16} className="text-blue-500" />
            <span>00:00 - Waiting for transcription...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimestampDisplay;