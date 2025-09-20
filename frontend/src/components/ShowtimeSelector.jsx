import React from 'react';
import './ShowtimeSelector.css';

export default function ShowtimeSelector({ showtimes, selectedShowtime, onSelect }) {
  return (
    <div className="showtime-selector">
      <h2>Select Showtime</h2>
      <div className="showtime-list">
        {showtimes.map(show => (
          <button
            key={show.id}
            className={`showtime-btn${selectedShowtime && selectedShowtime.id === show.id ? ' selected' : ''}`}
            onClick={() => onSelect(show)}
          >
            {show.time}
          </button>
        ))}
      </div>
    </div>
  );
}
