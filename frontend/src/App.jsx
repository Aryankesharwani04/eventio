import React, { useState } from 'react';
import './App.css';
import MovieList from './components/MovieList';
import ShowtimeSelector from './components/ShowtimeSelector';
import SeatSelector from './components/SeatSelector';
import BookingSummary from './components/BookingSummary';

// Default mock data
const defaultMovies = [
  { id: '1', title: 'Inception', poster: 'https://m.media-amazon.com/images/I/51s+6kQw2lL._AC_SY679_.jpg' },
  { id: '2', title: 'Interstellar', poster: 'https://m.media-amazon.com/images/I/71n58vYzQzL._AC_SY679_.jpg' },
  { id: '3', title: 'The Dark Knight', poster: 'https://m.media-amazon.com/images/I/51EbJjlLw-L._AC_SY679_.jpg' }
];
const defaultShowtimes = [
  { id: 'a', time: '10:00 AM' },
  { id: 'b', time: '1:00 PM' },
  { id: 'c', time: '4:00 PM' },
  { id: 'd', time: '7:00 PM' }
];
const defaultBookedSeats = ['A1', 'A2', 'B5', 'C7', 'D10'];

function App() {
  const [movies] = useState(defaultMovies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimes] = useState(defaultShowtimes);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookedSeats] = useState(defaultBookedSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBook = () => {
    setLoading(true);
    setTimeout(() => {
      setMessage('Booking successful!');
      setSelectedSeats([]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="app-container">
      <h1>Movie Ticket Booking</h1>
      <MovieList
        movies={movies}
        selectedMovie={selectedMovie}
        onSelect={setSelectedMovie}
      />
      {selectedMovie && (
        <ShowtimeSelector
          showtimes={showtimes}
          selectedShowtime={selectedShowtime}
          onSelect={setSelectedShowtime}
        />
      )}
      {selectedShowtime && (
        <SeatSelector
          selectedSeats={selectedSeats}
          onSelect={handleSeatSelect}
          bookedSeats={bookedSeats}
        />
      )}
      <BookingSummary
        movie={selectedMovie}
        showtime={selectedShowtime}
        seats={selectedSeats}
        onBook={handleBook}
        loading={loading}
      />
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
