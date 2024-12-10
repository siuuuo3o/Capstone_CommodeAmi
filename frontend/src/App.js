import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { scrollLeft, scrollRight, handleScroll } from './utils/scroll';

import { fetchUserRatings } from './api/auth';
import { fetchBoxOfficeMovies } from './api/movies';
import './App.css';
import Header from './header/Header';
import MovieSection from './MovieSection';
import DashBoard from './DashBoard';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import MovieDetail from './MovieDetail';
import MyPage from './MyPage';
import EvaluationPage from './EvaluationPage';
import SearchResults from './SearchResults';
import FileUploadComponent from './FileUploadComponent';
import TicketListComponent from './TicketListComponent';

function App() {
  const [boxOfficeMovies, setBoxOfficeMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movies = await fetchBoxOfficeMovies();
        setBoxOfficeMovies(movies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };

    getMovies();
  }, []);

  const handleLogin = async () => {
    setIsLoggedIn(true);
    await fetchUserRatings();
    console.log('User reviews fetched and stored in local storage');
    setIsLoggedIn(!!localStorage.getItem('access_token')); // 동기화 보장
  };
  
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsLoggedIn(!!localStorage.getItem('access_token')); // 동기화 보장
    window.location.href = '/';
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

return (
<Router>
  <div className="app">
    <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Navigate to="/DashBoard" />} />
          <Route path="/DashBoard/*" element={<DashBoard handleLogout={handleLogout} />} />
          <Route path="/search" element={<SearchResults isLoggedIn={isLoggedIn} />} />
          <Route path="/customticket" element={<FileUploadComponent />} />
          <Route path="/customtickets" element={<TicketListComponent />} />
          <Route path="/mypage/*" element={<MyPage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
          <Route path="/mypage/evaluation" element={<EvaluationPage />} />
        </>
      ) : (
        <>
          <Route path="/" element={
            <MovieSection 
              title="박스오피스 순위" 
              movies={boxOfficeMovies} 
              scrollable 
              sectionId="box-office"
              scrollLeft={scrollLeft}
              scrollRight={scrollRight}
              handleScroll={handleScroll}
            />
          } />
          <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/search" element={<Navigate to="/login" />} />
        </>
      )}

      {/* 모든 사용자가 접근 가능한 공통 경로 */}
      <Route path="/movie/:id" element={<MovieDetail isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
    </Routes>

    {showLoginPopup && (
      <div id="login-popup" className="popup" style={{ display: 'flex' }}>
        <div className="popup-content">
          <h2>로그인 필요</h2>
          <p>로그인 후 이용해 주세요.</p>
          <div className="popup-buttons">
            <button onClick={handleCloseLoginPopup}>확인</button>
          </div>
        </div>
      </div>
    )}
  </div>
</Router>
);
}

export default App;