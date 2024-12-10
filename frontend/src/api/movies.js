import axios from 'axios';

export const fetchBoxOfficeMovies = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/movies/');
    const filteredAndSortedMovies = response.data
      .filter((movie) => movie.box_office_rank >= 1 && movie.box_office_rank <= 10)
      .sort((a, b) => a.box_office_rank - b.box_office_rank);
    return filteredAndSortedMovies;
    
  } catch (error) {
    console.error('박스오피스 영화 데이터를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const fetchHighRatedMovies = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/movies/');
    const filteredAndSortedHighRatedMovies = response.data
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10)
      .map((movie, index) => ({ ...movie, high_rating_rank: index + 1 }));
    return filteredAndSortedHighRatedMovies;
  } catch (error) {
    console.error('평균 별점이 높은 영화 데이터를 가져오는 중 오류 발생:', error);
    throw error;
  }
};

export const fetchMovieSearchResults = async (query) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/movies/?search=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const fetchWeatherRecommendedMovies = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/recommendations/recommend/');
    const filteredAndSortedWeatherRecommendedMovies = response.data
    // .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 10)
    // .map((movie, index) => ({ ...movie, weather_rank: index + 1 }));
  return filteredAndSortedWeatherRecommendedMovies;
  } catch (error) {
    console.error('날씨 기반 추천 영화를 가져오는 중 오류 발생:', error);
    throw error;
  }
};