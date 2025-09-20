import React from 'react';
import './MovieList.css';

export default function MovieList({ movies, selectedMovie, onSelect }) {
  return (
    <div className="movie-list">
      <h2>Select a Movie</h2>
      <div className="movie-list-grid">
        {movies.map(movie => (
          <div
            key={movie.id}
            className={`movie-card${selectedMovie && selectedMovie.id === movie.id ? ' selected' : ''}`}
            onClick={() => onSelect(movie)}
          >
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-title">{movie.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
