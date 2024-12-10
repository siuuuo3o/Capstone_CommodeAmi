import React from 'react';
import { Link } from 'react-router-dom';
import './MovieSection.css';

const MovieSection = ({ title, scrollable, sectionId, movies }) => {
  return (
    <section className="movie-section">
      <h2>{title}</h2>
      {scrollable ? (
        <div className="scroll-container">
          <div className="movie-list-wrapper" id={`${sectionId}-wrapper`}>
            <div className="movie-list" id={sectionId}>
              {movies.map(movie => (
                <div key={movie.id} className="movie-card-wrapper">
                  <div className="movie-card">
                    {(movie.box_office_rank || movie.high_rating_rank || movie.weather_rank) && (
                      <div className="rank-label">{movie.box_office_rank || movie.high_rating_rank || movie.weather_rank}</div>
                    )}
                    <Link to={`/movie/${movie.id}/`}>
                      <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
                    </Link>
                    <div className="movie-info">
                      <h4>{movie.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card-wrapper">
              <div className="movie-card">
                {(movie.box_office_rank || movie.high_rating_rank || movie.weather_rank) && (
                  <div className="rank-label">{movie.box_office_rank || movie.high_rating_rank || movie.weather_rank}</div>
                )}
                <Link to={`/movie/${movie.id}/`}>
                  <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
                </Link>
                <div className="movie-info">
                  <h4>{movie.title}</h4>
                  <p>{movie.release_date}</p>
                  <p>관객 수: {movie.audience_accumulate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieSection;
