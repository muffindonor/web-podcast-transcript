/**
 * StarRating Component
 * 
 * An interactive 5-star rating component with hover effects.
 * Provides visual feedback for both hover and selected states.
 * 
 * Features:
 * - Interactive star rating system (1-5 stars)
 * - Hover state preview
 * - Persistent rating selection
 * - Visual feedback through color changes
 * 
 * State Management:
 * - rating: The currently selected rating value (0-5)
 * - hover: The star currently being hovered over (0-5)
 */

import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = () => {
  // Track the selected rating (0 means no rating selected)
  const [rating, setRating] = useState(0);
  // Track the currently hovered star (0 means no hover)
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {/* Generate five star buttons */}
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(rating)} // Reset hover to match rating
          aria-label={`Rate ${star} stars`} // Accessibility label
        >
          <Star
            size={24}
            // Fill star if it's less than or equal to hover value (preview)
            // or rating value (selected)
            fill={star <= (hover || rating) ? 'gold' : 'none'}
            // Match the fill color for consistency
            color={star <= (hover || rating) ? 'gold' : 'currentColor'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;