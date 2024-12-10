import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FileUploadComponent.css'; // CSS 파일 가져오기

const FileUploadComponent = ({ userInfo }) => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hologramColor1, setHologramColor1] = useState('');
  const [hologramColor2, setHologramColor2] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [backMessage, setBackMessage] = useState('');
  const containerRef = useRef(null);
  const overlayRef = useRef(null);

  const storedUserInfo = JSON.parse(localStorage.getItem('user_info'));
  const userId = storedUserInfo ? storedUserInfo.id : null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const bounds = container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
      const backgroundX = (x / bounds.width) * 100;
      const backgroundY = (y / bounds.height) * 100;

      if (overlayRef.current && hologramColor1 && hologramColor2) {
        overlayRef.current.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`;
        overlayRef.current.style.filter = `opacity(${x / bounds.width}) brightness(1.2)`;
      }

      const rotateY = -1 / 5 * x + 20;
      const rotateX = 4 / 30 * y - 20;

      container.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseOut = () => {
    if (overlayRef.current) {
      overlayRef.current.style.filter = 'opacity(0)';
    }

    if (containerRef.current) {
      containerRef.current.style.transform = 'perspective(350px) rotateY(0deg) rotateX(0deg)';
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [hologramColor1, hologramColor2]);

  const applyHologramStyle = () => {
    if (overlayRef.current && uploadedImage) {
      const backgroundPosition = overlayRef.current.style.backgroundPosition || '50% 50%';
      if (hologramColor1 && hologramColor2) {
        overlayRef.current.style.background = `linear-gradient(105deg, transparent 40%, ${hologramColor1} 45%, ${hologramColor2} 50%, transparent 54%)`;
        overlayRef.current.style.backgroundSize = '200% 200%';
        overlayRef.current.style.backgroundPosition = backgroundPosition;
      } else {
        overlayRef.current.style.background = 'none';
      }
    }
  };

  useEffect(() => {
    applyHologramStyle();
  }, [hologramColor1, hologramColor2, uploadedImage]);

  const saveCustomTicket = () => {
    if (newComment.trim() !== '') {
      setBackMessage(newComment);
      setNewComment('');
    }


    const ticketData = {
      ticket_image: uploadedImage,
      hologram_color1: hologramColor1,
      hologram_color2: hologramColor2,
      comment: newComment.trim() !== '' ? newComment.trim() : backMessage,
      user: userId, 
    };
    
    console.log('전송하는 ticketData:', ticketData);

    fetch('http://localhost:8000/api/customticket/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(ticketData),
    })
    .then((response) => {
      console.log('HTTP status code:', response.status);
      return response.json();
    })

      .then((data) => {
        console.log('Server response data:', data);
        if (data && data.custom_ticket_id) {
          alert('티켓이 성공적으로 저장되었습니다.');
          setHologramColor1('');
          setHologramColor2('');
          setUploadedImage(null);
          setBackMessage('');
          navigate('/mypage');
        } else {
          alert('티켓 저장에 실패했습니다.');
        }
      })
      .catch((error) => {
        
        console.error('티켓 저장 중 오류 발생:', error);
        alert('티켓 저장 중 오류 발생');
      });
  };

  return (
    <div className="ticket-container">
      <div className="file-upload">
        <input type="file" onChange={handleImageUpload} />
      </div>

      <div className="controls">
        <label>
          <h1>홀로그램 색상 1</h1>
          <input
            type="color"
            value={hologramColor1}
            onChange={(e) => setHologramColor1(e.target.value)}
          />
        </label>
        <label>
          <h1>홀로그램 색상 2</h1>
          <input
            type="color"
            value={hologramColor2}
            onChange={(e) => setHologramColor2(e.target.value)}
          />
        </label>
      </div>

      {uploadedImage && (
        <div className="flip-container" onClick={flipCard}>
          <div className={`flipper ${isFlipped ? 'flipped' : ''}`}>
            <div className="front">
              <div
                className="container"
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
              >
                <div className="overlay" ref={overlayRef}></div>
                <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
              </div>
            </div>
            <div className="back">
              <div className="back-content">
                <p>{backMessage || '코멘트가 없습니다. 코멘트를 추가해주세요.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadedImage && (
        <div className="comments-section">
          <h3>Comments</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="코멘트를 추가해주세요"
          ></textarea>
          <button onClick={saveCustomTicket}>저장</button>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
