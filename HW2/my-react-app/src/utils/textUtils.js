// Escape special characters in search query for regex
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  export const highlightText = (text = '', searchQuery = '') => {
    if (!searchQuery?.trim() || !text) return text || '';
    
    const escapedSearchQuery = escapeRegExp(searchQuery.trim());
    const parts = text.split(new RegExp(`(${escapedSearchQuery})`, 'gi'));
    
    return parts.map((part) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        return `<mark class="highlight">${part}</mark>`;
      }
      return part;
    }).join('');
  };