import React from 'react';
import { highlightText } from '../utils/textUtils';

const HighlightedText = ({ text = '', searchQuery = '' }) => {
  const createMarkup = () => {
    return { __html: highlightText(text, searchQuery) };
  };

  return <span dangerouslySetInnerHTML={createMarkup()} />;
};

export default HighlightedText;