import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

function LoginForm({ handleLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/token/', formData)
      .then(response => {
        console.log('Token response:', response.data);
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        axios.get('http://localhost:8000/api/users/info/')
          .then(res => {
            console.log('User info response:', res.data);
            localStorage.setItem('user_info', JSON.stringify(res.data));
            setError('');
            handleLogin(); 
            navigate('/dashboard'); 
          })
          .catch(err => {
            setError('Failed to fetch user info');
            console.error(err);
          });
      })
      .catch(error => {
        setError('Invalid username or password');
        console.error(error);
      });
  };

  return (
    <div id="login-form-container">
      <div id="sign-in-container">
        <h3>로그인</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">아이디</label>
          <input 
            type="text" 
            name="username" 
            id="username" 
            placeholder="아이디" 
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">비밀번호</label>
          <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" 
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div id="form-controls">
            <button type="submit">로그인</button>
          </div>


<p style={{ fontSize: '12px', textAlign: 'center' }}>
  <a href="/find-username" style={{ marginRight: '10px', color: '#3D6094' }}>아이디 찾기</a>
  <a href="/reset-password" style={{color: '#3D6094'}}>비밀번호 찾기</a>
</p>


          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
