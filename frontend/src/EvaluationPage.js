import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarDisplay from './StarDisplay';
import axios from 'axios';
import './EvaluationPage.css';

const EvaluationPage = () => {
    const [movies, setMovies] = useState([]);
    const [movieDetails, setMovieDetails] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 저장된 별점과 리뷰 ID 가져오기
        const ratings = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('rating-')) {
                const movieId = key.split('-')[1];
                const rating = localStorage.getItem(key);
                ratings.push({ movieId, rating: parseFloat(rating) }); 
            }
        }
    
        // 영화 목록 설정 후 기본적으로 내림차순 정렬
        const sortedRatings = ratings.sort((a, b) => b.rating - a.rating);
        setMovies(sortedRatings);
        loadMovieDetails(sortedRatings.map(movie => movie.movieId));
    }, []);

    useEffect(() => {
        // movies가 존재할 때만 정렬 적용
        if (movies.length > 0) {
            const sortedMovies = [...movies].sort((a, b) => {
                const ratingA = parseFloat(a.rating);
                const ratingB = parseFloat(b.rating);
                return sortOrder === 'desc' ? ratingB - ratingA : ratingA - ratingB;
            });
            setMovies(sortedMovies);
        }
    }, [sortOrder]);

    const loadMovieDetails = async (movieIds) => {
        try {
            const requests = movieIds.map(id => axios.get(`http://localhost:8000/api/movies/${id}/`));
            const responses = await Promise.all(requests);
            setMovieDetails(responses.map(res => res.data));
        } catch (error) {
            console.error('Failed to load movie details:', error);
        }
    };

    const handleSortClick = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        setSortOrder(newOrder);
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="evaluation-page">
            <div className="profile-sort-buttons">
                <button onClick={handleSortClick}>
                    별점순 {sortOrder === 'desc' ? '▼' : '▲'}
                </button>
            </div>
            <div className="movies-list">
                {movies.map((movie) => {
                    const details = movieDetails.find(detail => detail.id === parseInt(movie.movieId));
                    return (
                        <div 
                            key={movie.movieId} 
                            className="movie-item" 
                            onClick={() => handleMovieClick(movie.movieId)}
                            style={{ cursor: 'pointer' }}
                        >
                            {details ? (
                                <>
                                    <img src={details.poster_url} alt={details.title} />
                                    <h3>{details.title}</h3>
                                    <StarDisplay rating={parseFloat(movie.rating)} className="small-star" />
                                </>
                            ) : (
                                <h3>로딩 중...</h3>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EvaluationPage;
