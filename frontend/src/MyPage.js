import React, { useState, useEffect } from 'react';
import './MyPage.css';
import axios from 'axios';
import EvaluationPage from './EvaluationPage';
import TicketListComponent from './TicketListComponent';
import ReviewsPage from './ReviewsPage';

const MyPage = ({ isLoggedIn, handleLogout }) => {
    const [movies, setMovies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [customTickets, setCustomTickets] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        loadUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            loadReviews();
            fetchCustomTickets();
        }
    }, [userInfo]);

    const loadUserInfo = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('http://localhost:8000/api/users/info/')
                .then(response => {
                    localStorage.setItem('user_info', JSON.stringify(response.data));
                    setUserInfo(response.data);
                })
                .catch(error => {
                    console.error('Failed to load user info', error);
                });
        } else {
            const storedUserInfo = localStorage.getItem('user_info');
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
            }
        }
    };

    const loadReviews = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('http://localhost:8000/api/reviews/user/reviews/')
                .then(response => {
                    setReviews(response.data);
                    const movieIds = response.data.map(review => review.movie).filter(id => id !== undefined && id !== null);
                    // console.log('Movie IDs:', movieIds);
                    loadMovies(movieIds, response.data);
                })
                .catch(error => {
                    console.error('Failed to load reviews', error);
                });
        }
    };

    const fetchCustomTickets = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`http://localhost:8000/api/customticket/user/${userInfo.id}`)
                .then(response => {
                    setCustomTickets(response.data);
                })
                .catch(error => {
                    console.error('Failed to load custom tickets', error);
                });
        }
    };

    const loadMovies = (movieIds, reviewsData) => {
        const token = localStorage.getItem('access_token');


        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            Promise.all(movieIds.map(movieId => 
                axios.get(`http://localhost:8000/api/movies/${movieId}/`)
                
                    .then(response => response.data)
     
            ))
            .then(moviesData => {
                const moviesWithReviews = moviesData.map(movie => ({
                    ...movie,
                    review: reviewsData.find(review => review.movie_id === movie.id)
                }));
                setMovies(moviesWithReviews);
            })
            .catch(error => {
                console.error('Failed to load movies', error);
            });
        }
    };

    if (!userInfo) {
        return <p>Loading...</p>;
    }

    

    return (
        <div className="mypage">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-info">
                        <span className="text-bg">{userInfo.nickname}님의 마이페이지</span>
                    </div>
                </div>
                <div className="profile-content">
                    <h3>평가</h3>
                    <EvaluationPage movies={movies} />
                    <ReviewsPage movies={movies} reviews={reviews} />
                
                    <h3>티켓</h3>
                    <div className="ticket-list">
                        <TicketListComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
