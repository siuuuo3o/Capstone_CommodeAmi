import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import useSearch from '../hooks/useSearch'; 

function Header({isLoggedIn, handleLogout}) {
  const { searchQuery, handleSearchChange } = useSearch();
  const navigate = useNavigate(); 


    // 검색 제출 처리 함수
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
        handleSearchChange({ target: { value: '' } });
        return;
      }
      if (searchQuery.trim()) {
        navigate(`/search?query=${searchQuery.trim()}`); 
      }
    };

  return (
    <header>
      <div className="logo">
        {/* 로그인  상태일 떄는 dashboard로 로그인 안되어있으면 현재 로그인 안된 페이지 */} 
        <Link to={isLoggedIn ? "/dashboard" : "/"}> 
          <h1>commode ami</h1>
        </Link>
      </div>
      <div className="search-bar">
      <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery} 
            onChange={handleSearchChange}
          />
        </form>
      </div>
      <div className="auth-buttons">
        {/* 로그인이 안 되어있으면 로그인&회원 가입 버튼을, 로그인 되어있으면 마이페이지&로그아웃 버튼  */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="link-button">
              <button>로그인</button>
            </Link>
            <Link to="/signup" className="link-button">
              <button>회원가입</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/mypage" className="link-button">
              <button>마이페이지</button>
            </Link>
            <div className="logout-button">
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;