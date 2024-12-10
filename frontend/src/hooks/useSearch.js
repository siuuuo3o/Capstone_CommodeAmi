import { useState } from 'react';
import { fetchMovieSearchResults } from '../api/movies';

const useSearch = (isLoggedIn) => { // 로그인 여부를 파라미터로 받음
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {

    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    } else {
      try {
        const results = await fetchMovieSearchResults(e.target.value);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }
  };

  return { searchQuery, searchResults, handleSearchChange };
};

export default useSearch;
