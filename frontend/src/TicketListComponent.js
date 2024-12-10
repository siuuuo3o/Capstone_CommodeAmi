import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketListComponent.css'

const TicketListComponent = () => {
  const navigate = useNavigate();
  const [customTickets, setCustomTickets] = useState([]);
  const [isFlipped, setIsFlipped] = useState([]);
  

  useEffect(() => {
    fetchCustomTickets();
  }, []);
  // Retrieve user info from localStorage
  const storedUserInfo = JSON.parse(localStorage.getItem('user_info'));
  const userId = storedUserInfo ? storedUserInfo.id : null;

  const fetchCustomTickets = () => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }
    fetch(`http://localhost:8000/api/customticket/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCustomTickets(data);
        setIsFlipped(new Array(data.length).fill(false));
      })
      .catch((error) => {
        console.error('API request failed:', error);
      });
    
  };

  const flipCard = (index) => {
    setIsFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  const handleMouseMove = (e, index) => {
    const container = e.target.closest('.container');
    if (!container) return;
  
    const bounds = container.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
  
    if (x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height) {
      const backgroundX = (x / bounds.width) * 100;
      const backgroundY = (y / bounds.height) * 100;
  
      const overlay = container.querySelector('.overlay1');
      if (overlay) {
        // 아래에서 Vue.js 코드와 유사한 스타일 적용
        overlay.style.background = `linear-gradient(105deg, 
          transparent 40%, 
          ${customTickets[index].hologram_color1} 45%, 
          ${customTickets[index].hologram_color2} 50%, 
          transparent 54%)`;
        overlay.style.backgroundSize = '200% 200%'; // background-size 고정
        overlay.style.backgroundPosition = `${backgroundX}% ${backgroundY}%`; // 마우스 위치에 따라 변경
        overlay.style.filter = `opacity(${x / bounds.width}) brightness(1.2)`; // 동일한 filter 적용
      }
  
      const rotateY = -1 / 5 * x + 20;
      const rotateX = 4 / 30 * y - 20;
      container.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };
  

  const handleMouseOut = (e) => {
    const container = e.target.closest('.container');
    if (!container) return;

    const overlay = container.querySelector('.overlay1');
    if (overlay) {
      overlay.style.filter = 'opacity(0)';
    }

    container.style.transform = 'perspective(350px) rotateY(0deg) rotateX(0deg)';
  };


  const getHologramStyle = (color1, color2) => {
    return `linear-gradient(105deg, transparent 40%, ${color1} 45%, ${color2} 50%, transparent 54%)`;
  };
  
  

  const deleteTicket = async (customTicketId) => {
    if (!window.confirm('정말로 이 티켓을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/customticket/${customTicketId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // 이 부분이 포함되어야 합니다.
        },
      });

      if (response.ok) {
        alert('티켓이 성공적으로 삭제되었습니다.');
        fetchCustomTickets();
      } else {
        alert('티켓 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/customticket')} className="create-btn">티켓 만들기</button>
      <div className="ticket-list">
        {customTickets.map((ticket, index) => (
          <div
            key={`${ticket.customTicketId}-${index}`} // 고유한 key로 생성
            className="ticket-card"
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseOut={(e) => handleMouseOut(e, index)}
            onClick={() => flipCard(index)}
          >
          
            <div className={`flipper ${isFlipped[index] ? 'flipped' : ''}`}>
              <div className="front">
                <div className="container">
                  <div
                    className="overlay1" 
                    style={{ background: getHologramStyle(ticket.hologram_color1, ticket.hologram_color2) }}
                    // style={{
                    //   background: `linear-gradient(105deg, transparent 40%, ${ticket.hologram_color1} 45%, ${ticket.hologram_color2} 50%, transparent 54%)`}}
                  ></div>
                  <div
                    className="card-image"
                    style={{ backgroundImage: `url(${ticket.ticket_image})` }}
   
                  ></div>
                </div>
              </div>
              <div className="back">
                <div className="back-content">
                  <p>{ticket.comment || '코멘트가 없습니다. 코멘트를 추가해주세요.'}</p>
                  <div className="card-actions">
                    <div className="top-right-buttons">
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTicket(ticket.custom_ticket_id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default TicketListComponent;
