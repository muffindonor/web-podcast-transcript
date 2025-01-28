// utils.js
export const extractTitle = (filename) => {
  // Remove file extension
  let title = filename.replace(/\.[^/.]+$/, '');
  
  // Remove common suffixes like "(Official Video)", "(Audio)", etc.
  title = title.replace(/\((Official|HD|Audio|Video|Music|Lyric).*?\)/gi, '');
  
  // Clean up any double spaces and trim
  title = title.replace(/\s+/g, ' ').trim();
  
  return title;
};

export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const groupWordsIntoSentences = (words) => {
  if (!words || words.length === 0) return [];
  
  const sentences = [];
  let currentSentence = {
    text: '',
    start: words[0]?.start || 0,
    wordCount: 0
  };

  const MAX_WORDS_PER_SENTENCE = 12;
  const PAUSE_THRESHOLD = 1000;

  words.forEach((word, index) => {
    const nextWord = words[index + 1];
    const timeDiff = nextWord ? nextWord.start - (word.start + word.end) : 0;
    const shouldBreak = 
      currentSentence.wordCount >= MAX_WORDS_PER_SENTENCE ||
      word.text.match(/[.!?]$/) ||
      timeDiff > PAUSE_THRESHOLD;

    currentSentence.text += word.text + ' ';
    currentSentence.wordCount++;

    if (shouldBreak || index === words.length - 1) {
      sentences.push({
        text: currentSentence.text.trim(),
        start: currentSentence.start
      });
      
      if (index < words.length - 1) {
        currentSentence = {
          text: '',
          start: words[index + 1].start,
          wordCount: 0
        };
      }
    }
  });

  return sentences;
};