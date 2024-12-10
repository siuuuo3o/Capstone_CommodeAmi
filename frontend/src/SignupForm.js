import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginForm.css';
import BirthdateSelector from './BirthdateSelector';

function SignupForm({ toggleForm }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    full_name: '',
    gender: '',
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');


  useEffect(() => {
    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 아이디 중복 검사
    if (name === 'username') {
      if (value.length > 2) {
        axios.get(`http://127.0.0.1:8000/api/users/check-username/?username=${value}`)
          .then(response => {
            console.log('API 응답:', response.data);
            setUsernameAvailable(true);
          })
          .catch(error => {
            console.error('API 에러:', error.response ? error.response.data : error.message);
            setUsernameAvailable(false);
          });
      } else {
        setUsernameAvailable(null);
      }
    }
    
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    const birthdate = `${year}-${month}-${day}`;
    const updatedFormData = {
      ...formData,
      birthdate,
    };
    axios.post('http://127.0.0.1:8000/api/users/users/', updatedFormData)
      .then(response => {
        setSuccess('회원가입이 완료되었습니다.');
        setError('');
        if (toggleForm) {
          toggleForm(); // 회원가입 후 로그인 폼으로 전환
        }
      })
      .catch(error => {
        if (error.response) {
          const errorMessage = typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data);
          setError(errorMessage);
        } else if (error.request) {
          setError('서버로부터 응답이 없습니다. 다시 시도해 주세요.');
        } else {
          setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
        setSuccess('');
      });
  };

  return (
    <div id="signup-form-container">
      <div id="sign-up-container">
        <h3>회원 가입</h3>
        <h3>commode ami</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">아이디</label>
          <input type="text" name="username" id="username" placeholder="아이디" onChange={handleChange} required />
          {usernameAvailable === true && <p style={{ color: 'green', fontSize: '0.8rem', textAlign: 'left' }}>사용 가능한 아이디입니다.</p>}
          {usernameAvailable === false && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'left' }}>이미 사용 중인 아이디입니다.</p>}
          
          <label htmlFor="full_name">이름</label>
          <input type="text" name="full_name" id="full_name" placeholder="이름 입력" onChange={handleChange} required />
          
          <label htmlFor="email">이메일</label>
          <input type="email" name="email" id="email" placeholder="이메일" onChange={handleChange} required />

          <label htmlFor="password">비밀번호</label>
          <input type="password" name="password" id="password" placeholder="비밀번호" onChange={handleChange} required />
          
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input type="password" name="confirmPassword" id="confirmPassword" placeholder="비밀번호 확인" onChange={handleChange} required />
          {!passwordMatch && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'left' }}>비밀번호가 일치하지 않습니다.</p>}
          {passwordMatch && formData.confirmPassword && <p style={{ color: 'green', fontSize: '0.8rem', textAlign: 'left' }}>비밀번호가 일치합니다.</p>}

          <label htmlFor="nickname">닉네임</label>
          <input type="text" name="nickname" id="nickname" placeholder="닉네임 입력" onChange={handleChange} required />

          <label htmlFor="gender">성별</label>
          <select name="gender" id="gender" onChange={handleChange} required>
            <option value="">선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
          
          <label htmlFor="birthdate">생년월일</label>
          <BirthdateSelector
            year={year}
            month={month}
            day={day}
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
            handleDayChange={handleDayChange}
          />
          
          <div id="form-controls">
            <button type="submit">회원 가입</button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignupForm;