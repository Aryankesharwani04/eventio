import React from 'react';
import './SeatSelector.css';

const ROWS = 8;
const COLS = 12;

export default function SeatSelector({ selectedSeats, onSelect, bookedSeats = [] }) {
  const renderSeats = () => {
    let seats = [];
    for (let row = 0; row < ROWS; row++) {
      let rowSeats = [];
      for (let col = 0; col < COLS; col++) {
        const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        rowSeats.push(
          <button
            key={seatId}
            className={`seat${isBooked ? ' booked' : ''}${isSelected ? ' selected' : ''}`}
            disabled={isBooked}
            onClick={() => onSelect(seatId)}
          >
            {seatId}
          </button>
        );
      }
      seats.push(
        <div className="seat-row" key={row}>
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="seat-selector">
      <div className="screen">Screen</div>
      {renderSeats()}
    </div>
  );
}
