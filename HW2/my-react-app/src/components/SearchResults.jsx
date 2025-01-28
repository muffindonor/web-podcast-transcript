// src/components/SearchResults.jsx
import React from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../utils/utils';
import HighlightedText from './HighlightedText';

const SearchResults = ({ words, searchQuery }) => {
  if (!searchQuery.trim() || !words?.length) return null;

  const findMatchingSegments = () => {
    const segments = [];
    const searchWords = searchQuery.toLowerCase().trim().split(/\s+/);
    let wordIndex = 0;

    while (wordIndex < words.length) {
      const potentialMatch = words.slice(wordIndex, wordIndex + searchWords.length)
        .map(w => w.text.toLowerCase());
      
      if (potentialMatch.join(' ').includes(searchWords.join(' '))) {
        // Find some context words before and after
        const contextStart = Math.max(0, wordIndex - 3);
        const contextEnd = Math.min(words.length, wordIndex + searchWords.length + 3);
        
        segments.push({
          startTime: words[wordIndex].start,
          text: words.slice(contextStart, contextEnd)
            .map(w => w.text)
            .join(' ')
        });
        
        wordIndex += searchWords.length;
      } else {
        wordIndex++;
      }
    }
    
    return segments;
  };

  const matchingSegments = findMatchingSegments();

  if (matchingSegments.length === 0) return null;

  return (
    <div className="search-results">
      <h3 className="search-result-count text-sm font-medium">
        Found {matchingSegments.length} matches:
      </h3>
      <div className="space-y-2">
        {matchingSegments.map((segment, index) => (
          <div key={index} className="search-result-item">
            <Clock size={16} className="text-blue-500 mt-1 flex-shrink-0" />
            <span className="search-result-timestamp">
              {formatTime(Math.floor(segment.startTime / 1000))}
            </span>
            <span className="search-result-text text-sm">
              <HighlightedText 
                text={segment.text} 
                searchQuery={searchQuery}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;