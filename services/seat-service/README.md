# Seat Service

This is the Seat Service for the Movie Ticket Booking Backend. It is responsible for managing seat availability and reservations.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd movie-ticket-booking-backend/seat-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up MongoDB**:
   Ensure you have MongoDB installed and running. Update the connection string in the `src/app.js` file as needed.

4. **Run the service**:
   ```
   npm start
   ```

## API Usage

### Endpoints

- **GET /seats**: Retrieve a list of available seats.
- **POST /seats/reserve**: Reserve a seat.
- **DELETE /seats/cancel**: Cancel a seat reservation.

### Example Requests

- **Get Available Seats**:
  ```
  GET /seats
  ```

- **Reserve a Seat**:
  ```
  POST /seats/reserve
  {
    "seatId": "12345"
  }
  ```

- **Cancel a Reservation**:
  ```
  DELETE /seats/cancel
  {
    "reservationId": "67890"
  }
  ```

## Notes

Make sure to handle errors and edge cases in your implementation.