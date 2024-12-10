import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchMovieSearchResults } from './api/movies';
import './SearchResults.css'; 

function SearchResults({ isLoggedIn }) { 
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const query = searchParams.get('query'); 
  const navigate = useNavigate();

  useEffect(() => {
    console.log('isLoggedIn 상태:', isLoggedIn); 
    const fetchResults = async () => {
      if (!isLoggedIn) { 
        alert('로그인이 필요합니다.');
        return;
      }

      if (query) {
        try {
          const data = await fetchMovieSearchResults(query);
          setResults(data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchResults();
  }, [query, isLoggedIn]); 

return (
  <div className="search-results">
    <h2>검색 결과: "{query}"</h2>
    {results.length === 0 ? (
      <p>검색 결과가 없습니다.</p>
    ) : (
      <div className="movie-grid">
        {results.map((movie) => (
          <div className="movie-card" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
            <img src={movie.poster_url} alt={movie.title} />
            <p>{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
export default SearchResults;
