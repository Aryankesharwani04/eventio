import React from 'react';
import './BookingSummary.css';

export default function BookingSummary({ movie, showtime, seats, onBook, loading }) {
  return (
    <div className="booking-summary">
      <h2>Booking Summary</h2>
      <div>Movie: <b>{movie ? movie.title : '-'}</b></div>
      <div>Showtime: <b>{showtime ? showtime.time : '-'}</b></div>
      <div>Seats: <b>{seats.length > 0 ? seats.join(', ') : '-'}</b></div>
      <button
        className="book-btn"
        disabled={!movie || !showtime || seats.length === 0 || loading}
        onClick={onBook}
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </div>
  );
}
