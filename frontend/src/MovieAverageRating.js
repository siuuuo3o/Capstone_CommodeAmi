import React, { useState, useEffect } from 'react';

const MovieAverageRating = ({ movieId }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {

        const response = await fetch(`http://localhost:8000/api/reviews/movies/${movieId}/reviews`)
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const totalRatings = data.reduce((sum, review) => sum + parseFloat(review.rating), 0);

          const average = totalRatings / data.length;
          setAverageRating(average);
          setRatingCount(data.length);
        } else {
          setAverageRating(0);
          setRatingCount(0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [movieId]);

  return (
    <div>
      {averageRating !== null ? (
        <p>평균 별점: {averageRating.toFixed(1)} ({ratingCount}명)</p>
      ) : (
        <p>별점 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default MovieAverageRating;
