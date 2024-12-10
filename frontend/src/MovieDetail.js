import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetail.css';
import StarRating from './StarRating';
import StarDisplay from './StarDisplay'; 
import BirthdateSelector from './BirthdateSelector';
import convertCountry from './convertCountry';
import MovieAverageRating from './MovieAverageRating';

function MovieDetail({ isLoggedIn, handleLogout }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false); // 여기서 상태 변수를 정의
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showAllReviewsPopup, setShowAllReviewsPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [actors, setActors] = useState([]);
  const [movieActors, setMovieActors] = useState([]);
  const [showAllStills, setShowAllStills] = useState(false);
  const [currentStill, setCurrentStill] = useState(null);
  const [showAllActorsPopup, setShowAllActorsPopup] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAllReviewVideosPopup, setShowAllReviewVideosPopup] = useState(false); 
  const navigate = useNavigate();
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [reviewStep, setReviewStep] = useState(''); 
  const [reviwId, setReviewId] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
const [ratingCount, setRatingCount] = useState(0);
const [reviewsToShow, setReviewsToShow] = useState([]);



  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/movies/${id}`);
        const movieData = response.data;

        // origin_country 필드 변환
        if (movieData.origin_country) {
          let originCountries;
          try {
            originCountries = JSON.parse(movieData.origin_country.replace(/'/g, '"'));
          } catch (e) {
            console.error('Error parsing origin_country:', e);
            originCountries = [];
          }
          movieData.origin_country = originCountries.map(convertCountry);
        }

        // 트레일러 URL에서 key 값을 추출하여 YouTube embed URL로 변환
        if (Array.isArray(movieData.trailers)) {
          movieData.trailers = movieData.trailers.map(trailer => {
            const key = extractYouTubeKey(trailer);
            return `https://www.youtube.com/embed/${key}?autoplay=0`;
          });
        }

        // 리뷰 영상 URL을 YouTube embed URL로 변환
        if (Array.isArray(movieData.review_videoes)) {
          movieData.review_videoes = movieData.review_videoes.map(video => {
            const key = extractYouTubeVideoID(video);
            return `https://www.youtube.com/embed/${key}?autoplay=0`;
          });
        }

        setMovie(movieData);

        const savedRating = localStorage.getItem(`rating-${id}`)
        const savedReviewId = localStorage.getItem(`reviewId-${id}`);
        if (savedRating) {
          setSelectedRating(parseFloat(savedRating));
        }

        if (savedReviewId) {
          // 이후 사용자가 리뷰를 추가할 때 이 ID를 사용하여 리뷰를 업데이트할 수 있습니다.
          setReviewId(savedReviewId); // reviewId를 상태에 저장
        }
        const savedDate = localStorage.getItem(`date-${id}`);
        if (savedDate) {
          const [savedYear, savedMonth, savedDay] = savedDate.split('-');
          setYear(savedYear);
          setMonth(savedMonth);
          setDay(savedDay);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/actors/`);
        setActors(response.data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    const fetchMovieActors = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/movieactors/`);
        setMovieActors(response.data);
      } catch (error) {
        console.error('Error fetching movie actors:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchMovie();
    fetchActors();
    fetchReviews();
    fetchMovieActors();
  }, [id]);

  const handleReviewClick = () => {
    if (isLoggedIn) {
      setShowReviewPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleDateClick = () => {
    if (isLoggedIn) {
      setShowDatePopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleRatingClick = () => {
    if (isLoggedIn) {
      setShowRatingPopup(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleMoreReviewsClick = () => {
    const validReviews = reviews.filter(review => review.text && review.text.trim() !== '');
    setReviewsToShow(validReviews); // 새로운 상태로 필터링된 리뷰를 관리
    setShowAllReviewsPopup(true);
};

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    setAverageRating(total / ratings.length);
    setRatingCount(ratings.length);
  };
  useEffect(() => {
    // 예시로 별점 데이터를 가져오는 부분입니다.
    const ratings = [1.0, 2.0, 3.0, 4.0, 4.5]; // 실제로는 서버에서 가져온 데이터로 대체하세요.
    calculateAverageRating(ratings);
  }, []);
    

const handleSaveRating = async () => {
    if (selectedRating > 0) {
        localStorage.setItem(`rating-${id}`, selectedRating);
        alert(`선택한 별점: ${selectedRating}`);
        setShowRatingPopup(false);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const reviewId = localStorage.getItem(`reviewId-${id}`);
            let response;

            if (reviewId) {
                // 기존 리뷰(별점) 업데이트
                response = await axios.put(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/${reviewId}/`, {
                    rating: selectedRating,
                    movie: id,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                // 새로운 리뷰(별점) 생성
                response = await axios.post(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/`, {
                    rating: selectedRating,
                    movie: id,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            if (response.status === 201 || response.status === 200) {
                localStorage.setItem(`reviewId-${id}`, response.data.id);
                alert('별점이 저장되었습니다.');
            } else {
                alert('별점 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error saving rating:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert('인증 오류: 로그인 상태를 확인하세요.');
            } else {
                alert(`별점 저장 중 오류가 발생했습니다: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
            }
        }
    } else {
        alert('별점을 선택하세요.');
    }
};

const handleReviewSubmit = async () => {
  const token = localStorage.getItem('access_token');
  const reviewId = localStorage.getItem(`reviewId-${id}`);

  if (!token) {
      alert('로그인이 필요합니다.');
      return;
  }

  if (selectedRating <= 0) {
      alert('별점을 먼저 선택하세요.');
      return;
  }

  try {
      let response;

      if (reviewId) {
          // 기존 리뷰 업데이트
          response = await axios.put(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/${reviewId}/`, {
              text: newReview,
              rating: selectedRating,
              movie: id,
          }, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });

          if (response.status === 200) {
              setReviews(prevReviews => prevReviews.map(review =>
                  review.id === reviewId ? { ...review, ...response.data } : review
              ));
              alert('리뷰가 업데이트되었습니다.');
          } else {
              alert('리뷰 업데이트에 실패했습니다.');
          }
      } else {
          // 새로운 리뷰 생성
          response = await axios.post(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/`, {
              text: newReview,
              rating: selectedRating, 
              movie: id,
          }, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });

          if (response.status === 201) {
              localStorage.setItem(`reviewId-${id}`, response.data.id);
              setReviews([...reviews, response.data]);
              alert('리뷰가 성공적으로 저장되었습니다.');
          } else {
              alert('리뷰 저장에 실패했습니다.');
          }
      }

      setShowReviewPopup(false);
      setNewReview('');

  } catch (error) {
      console.error('Error saving review:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
          alert('인증 오류: 로그인 상태를 확인하세요.');
      } else {
          alert(`리뷰 저장 중 오류가 발생했습니다: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
      }
  }
};

const handleSaveDate = async () => {
    const selectedDate = `${year}-${month}-${day}`;
    const token = localStorage.getItem('access_token');
    const reviewId = localStorage.getItem(`reviewId-${id}`);

    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    if (!selectedDate) {
        alert('날짜를 선택하세요.');
        return;
    }

    try {
        let response;

        if (reviewId) {
            // 기존 리뷰 업데이트
            response = await axios.put(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/${reviewId}/`, {
                date_watched: selectedDate,
                rating: selectedRating,
                movie: id,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('관람일자가 업데이트되었습니다.');
            } else {
                alert('관람일자 업데이트에 실패했습니다.');
            }
        } else {
            // 새로운 리뷰 생성
            response = await axios.post(`http://127.0.0.1:8000/api/reviews/movies/${id}/reviews/`, {
                date_watched: selectedDate,
                rating: selectedRating,
                movie: id,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                localStorage.setItem(`reviewId-${id}`, response.data.id);
                alert('관람일자가 저장되었습니다.');
            } else {
                alert('관람일자 저장에 실패했습니다.');
            }
        }

        setShowDatePopup(false);

    } catch (error) {
        console.error('Error saving date watched:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
            alert('인증 오류: 로그인 상태를 확인하세요.');
        } else {
            alert(`관람일자 저장 중 오류가 발생했습니다: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        }
    }
};

  const handleShowAllStills = () => {
    setShowAllStills(true);
  };

  const handleCloseAllStills = () => {
    setShowAllStills(false);
  };

  const handleStillClick = (still) => {
    setCurrentStill(still);
  };

  const handleCloseStill = () => {
    setCurrentStill(null);
  };

  const handleShowAllActors = () => {
    setShowAllActorsPopup(true);
  };

  const handleCloseAllActors = () => {
    setShowAllActorsPopup(false);
  };

  const handleSelectRating = (rating) => {
    setSelectedRating(rating);
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setSearchResults([]);
    } else {
      axios.get(`http://127.0.0.1:8000/api/movies/?search=${e.target.value}`)
        .then(response => {
          setSearchResults(response.data);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleShowAllReviewVideosPopup = () => {
    setShowAllReviewVideosPopup(true);
  };

  const handleCloseAllReviewVideosPopup = () => {
    setShowAllReviewVideosPopup(false);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  const baseURL = 'https://image.tmdb.org/t/p/original';
  const formattedDate = movie.release_date.replace(/-/g, '.');
  const formatAudience = (movie.audience_accumulate / 10000).toFixed(1) + '만 명';

  const getActorDetails = (actorId) => {
    return actors.find(actor => actor.id === actorId);
  };

  const getCharacterDetails = (actorId) => {
    return movieActors.find(ma => ma.actor === actorId && ma.movie === movie.id);
  };

  const getDepartmentTranslation = (department) => {
    if (department === 'Acting') return '배우';
    if (department === 'Directing') return '감독';
    return department;
  };

  const filteredCredits = movie.credits.filter(actorId => {
    const actor = getActorDetails(actorId);
    return actor && (actor.known_for_department === 'Acting' || actor.known_for_department === 'Directing');
  });

  return (
    <div className="movie-detail">
      
      <main>
        <section className="movie-header">
          <img src={`${baseURL}${movie.stills[0]}`} alt={movie.title} />
          <div className="movie-header-overlay">
            <h1>{movie.title}</h1>
            <p>{movie.original_title}</p>
            <p>{movie.genres.map(genre => genre.name).join(', ')} / {movie.origin_country.join(', ')}</p>
            <p>{movie.runtime}분 / {formattedDate} 개봉</p>
            {movie.audience_accumulate ? (
              <p>누적 관객 {formatAudience}</p>
            ) : null}
          </div>
        </section>

        <section className="movie-details">
          <div className="movie-details-content">
            <img src={movie.poster_url} alt={movie.title} />
            <div className="movie-info">
                <div className="movie-buttons">
                  <div className="star-display-container">
                    <StarDisplay rating={selectedRating} />
                                    {/* 평균 별점 계산 및 표시 */}
                
                <MovieAverageRating movieId={id} />

                  </div>

          
                  <button onClick={() => {
                    setReviewStep('rating');
                    handleRatingClick();
                  }}>별점</button>
                  <button onClick={() => {
                    setReviewStep('review');
                    handleReviewClick();
                  }}>리뷰</button>
                  <button onClick={() => {
                    setReviewStep('date');
                    handleDateClick();
                  }}>관람일자</button>
                </div>

              <div className={`movie-overview ${selectedRating > 0 || (year && month && day) ? 'with-score' : ''}`}>
                <h2>줄거리</h2>
                <p>{movie.description}</p>
              </div>
        <section className="movie-reviews">
    {reviews.filter(review => review.text && review.text.trim() !== '').length > 0 && (
        <>
            <h2>리뷰 {reviews.filter(review => review.text && review.text.trim() !== '').length}</h2>
            <div className="review-list">
                {reviews
                    .filter(review => review.text && review.text.trim() !== '')
                    .slice(0, 3)
                    .map(review => (
                        <div className="review-item" key={review.id}>
                            <div className="review-header">
                                <span className="review-username">{review.nickname}</span>
                                <span className="review-rating">⭐{review.rating}</span>
                            </div>
                            <p>{review.text}</p>
                        </div>
                    ))}
            </div>
            {/* {reviews.filter(review => review.text && review.text.trim() !== '').length > 3 && (
                <button className="more-button" onClick={handleMoreReviewsClick}>더보기</button>
            )} */}
{/* 더보기 안나와서 수정 */}
{reviews.filter(review => review.text && review.text.trim() !== '').length > 3 && (
    <button className="more-button" onClick={handleMoreReviewsClick}>더보기</button>
)}

        </>
    )}
</section>
            </div>
          </div>
        </section>
        <section className="movie-cast">
          <h2>출연 {filteredCredits.length}</h2>
          <div className="cast-list">
            {filteredCredits.slice(0, 8).map(actorId => {
              const actor = getActorDetails(actorId);
              const characterDetails = getCharacterDetails(actorId);

              if (!actor || !characterDetails) return null;

              return (
                <div className="cast-item" key={actor.id}>
                  <img src={actor.profile_path} alt={actor.name} />
                  <p>{actor.name}</p>
                </div>
              );
            })}
          </div>
          {filteredCredits.length > 8 && (
            <button className="more-button" onClick={handleShowAllActors}>더보기</button>
          )}
        </section>
        <section className="movie-stills">
          <h2>스틸컷 {movie.stills.length}</h2>
          <div className="still-list">
            {movie.stills.slice(0, 4).map((still, index) => (
              <img
                src={`${baseURL}${still}`}
                alt={`Still ${index + 1}`}
                key={index}
                onClick={() => handleStillClick(`${baseURL}${still}`)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          {movie.stills.length > 5 && (
            <button className="more-button" onClick={handleShowAllStills}>더보기</button>
          )}
        </section>
        <section className="movie-trailers">
          <h2>트레일러</h2>
          <div className="trailer-list">
            {Array.isArray(movie.trailers) && movie.trailers.length > 0 ? (
              movie.trailers.map((trailer, index) => (
                <iframe
                  key={index}
                  width="300"
                  height="169"
                  src={trailer}
                  title={`Movie Trailer ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ))
            ) : (
              <p>트레일러가 없습니다.</p>
            )}
          </div>
        </section>
        <section className="movie-review-videos">
          <h2>리뷰 영상</h2>
          <div className="review-video-list">
            {Array.isArray(movie.review_videoes) && movie.review_videoes.length > 0 ? (
              <>
                {movie.review_videoes.slice(0, 4).map((video, index) => (
                  <iframe
                    key={index}
                    width="300"
                    height="169"
                    src={video}
                    title={`Review Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))}
                {movie.review_videoes.length > 4 && (
                  <div className="more-button-container">
                    <button className="more-button" onClick={handleShowAllReviewVideosPopup}>더보기</button>
                  </div>
                )}
              </>
            ) : (
              <p>리뷰 영상이 없습니다.</p>
            )}
          </div>
        </section>
        {showReviewPopup && (
          <div id="review-popup" className="popup" style={{ display: 'flex' }}>
            <div className="popup-content">
              <h2>{movie.title}</h2>
              <textarea
                placeholder="리뷰를 작성하세요."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              ></textarea>
              <div className="popup-buttons">
                <button id="close-popup" onClick={() => setShowReviewPopup(false)}>취소</button>
                <button onClick={handleReviewSubmit}>확인</button>
              </div>
            </div>
          </div>
        )}
        {showDatePopup && (
          <div id="date-popup" className="popup" style={{ display: 'flex' }}>
            <div className="popup-content">
              <h2>관람 일자</h2>
              <BirthdateSelector
                year={year}
                month={month}
                day={day}
                handleYearChange={handleYearChange}
                handleMonthChange={handleMonthChange}
                handleDayChange={handleDayChange}
              />
              <div className="popup-buttons">
                <button id="close-date-popup" onClick={() => setShowDatePopup(false)}>취소</button>
                <button onClick={handleSaveDate}>확인</button>
              </div>
            </div>
          </div>
        )}
        {/* {showAllReviewsPopup && (
          <div id="all-reviews-popup" className="popup" style={{ display: 'flex' }}>
            <div className="popup-content">
              <h2>전체 리뷰</h2>
              <div className="all-reviews-list">
                {reviews.map(review => (
                  <div className="review-item" key={review.id}>
                    <div className="review-header">
                      <span className="review-username">{review.nickname}</span>
                      <span className="review-rating">⭐{review.rating}</span>
                    </div>
                    <p>{review.text}</p>
                  </div>
                ))}
              </div>
              <button id="close-all-reviews-popup" onClick={() => setShowAllReviewsPopup(false)}>닫기</button>
            </div>
          </div>
        )} */}
        {showAllReviewsPopup && (
    <div id="all-reviews-popup" className="popup" style={{ display: 'flex' }}>
        <div className="popup-content">
            <h2>전체 리뷰</h2>
            <div className="all-reviews-list">
                {reviewsToShow.map(review => (
                    <div className="review-item" key={review.id}>
                        <div className="review-header">
                            <span className="review-username">{review.nickname}</span>
                            <span className="review-rating">⭐{review.rating}</span>
                        </div>
                        <p>{review.text}</p>
                    </div>
                ))}
            </div>
            <button id="close-all-reviews-popup" onClick={() => setShowAllReviewsPopup(false)}>&times;</button>
        </div>
    </div>
)}

        {showAllActorsPopup && (
          <div id="all-actors-popup" className="popup" style={{ display: 'flex' }}>
            <div className="popup-content">
              <button className="close-button" onClick={handleCloseAllActors}>&times;</button>
              <h2>전체 배우 목록</h2>
              <div className="all-actors-list">
                {filteredCredits.map(actorId => {
                  const actor = getActorDetails(actorId);
                  const characterDetails = getCharacterDetails(actorId);

                  if (!actor || !characterDetails) return null;

                  return (
                    <div className="cast-item" key={actor.id}>
                      <img src={actor.profile_path} alt={actor.name} />
                      <p>{actor.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {showRatingPopup && (
          <div id="rating-popup" className="popup" style={{ display: 'flex' }}>
            <div className="popup-content">
              <h2>별점</h2>
              <StarRating onRatingSelect={handleSelectRating} initialRating={selectedRating} />
              <div className="popup-buttons">
                <button onClick={() => {
                  setReviewStep('');
                  setShowRatingPopup(false);
                }}>취소</button>
                <button onClick={handleSaveRating}>확인</button>
              </div>
            </div>
          </div>
        )}
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
        {showAllReviewVideosPopup && (
          <div id="all-review-videos-popup" className="popup" style={{ display: 'flex' }}>
            <div className="popup-content">
              <button className="close-button" onClick={handleCloseAllReviewVideosPopup}>&times;</button>
              <h2>리뷰 영상</h2>
              <div className="review-video-list">
                {movie.review_videoes.map((video, index) => (
                  <iframe
                    key={index}
                    width="300"
                    height="169"
                    src={video}
                    title={`Review Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <footer>
      </footer>
      {showAllStills && (
        <div className="stills-modal" onClick={handleCloseAllStills}>
          <div className="stills-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseAllStills}>&times;</button>
            <div className="stills-modal-list">
              {movie.stills.map((still, index) => (
                <img
                  src={`${baseURL}${still}`}
                  alt={`Still ${index + 1}`}
                  key={index}
                  onClick={() => handleStillClick(`${baseURL}${still}`)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {currentStill && (
        <div className="current-still-modal" onClick={handleCloseStill}>
          <div className="current-still-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseStill}>&times;</button>
            <img src={currentStill} alt="Current Still" className="current-still-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;

function extractYouTubeKey(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('v');
}

function extractYouTubeVideoID(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('v');
}
