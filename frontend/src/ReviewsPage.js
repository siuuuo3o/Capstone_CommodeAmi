import React from 'react';
import './ReviewsPage.css';
const ReviewsPage = ({ reviews, movies }) => {

  
  const filteredReviews = reviews.map(review => {
    const movie = movies.find(movie => Number(movie.id) === Number(review.movie));
    return {
        ...review,
        movie 
    };
}).filter(review => review.text && review.text.trim() !== '' && review.movie); 

return (
  <div>
    <h3>리뷰</h3>
    <div className="profile-review-container">
      {filteredReviews.map((review, index) => (
        <div key={index} className="profile-review-item">
  <div className="review-header">
    <h4>{review.movie.title}</h4>
    <p className="date-watched">{review.date_watched ? `관람일자: ${review.date_watched}` : '관람일자 없음'}</p>
  </div>
  <p>{review.text}</p>
</div>
      ))}
    </div>
  </div>
);
};

export default ReviewsPage;