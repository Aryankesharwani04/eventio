// API utility for frontend-backend communication
const API_BASE = 'http://localhost:3000'; // Adjust if backend runs elsewhere

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`);
  return res.json();
}

export async function fetchShowtimes(movieId) {
  const res = await fetch(`${API_BASE}/movies/${movieId}/showtimes`);
  return res.json();
}

export async function fetchBookedSeats(showtimeId) {
  const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/booked-seats`);
  return res.json();
}

export async function bookSeats(showtimeId, seats) {
  const res = await fetch(`${API_BASE}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ showtimeId, seats })
  });
  return res.json();
}
