import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(rating)}
        >
          <Star
            size={24}
            fill={star <= (hover || rating) ? 'gold' : 'none'}
            color={star <= (hover || rating) ? 'gold' : 'currentColor'}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;