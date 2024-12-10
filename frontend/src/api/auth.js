import axios from 'axios';

export const fetchUserRatings = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('No access token found');
    return null;
  }

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/reviews/user/reviews/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      response.data.forEach((review) => {
        localStorage.setItem(`rating-${review.movie}`, review.rating);
        localStorage.setItem(`reviewId-${review.movie}`, review.id);
      });
    } else {
      console.error('Failed to fetch user reviews');
    }
  } catch (error) {
    console.error('Error fetching user reviews:', error);
  }
};
