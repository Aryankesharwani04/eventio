# Booking Service

This is the Booking Service for the Movie Ticket Booking Backend. It is responsible for managing user bookings, including creating, updating, and retrieving booking information.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd movie-ticket-booking-backend/booking-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root of the `booking-service` directory and add the following variables:
   ```
   MONGODB_URI=<your-mongodb-uri>
   PORT=3001
   ```

4. **Run the service**:
   ```
   npm start
   ```

## API Usage

### Endpoints

- **Create Booking**
  - `POST /bookings`
  - Request Body: `{ userId, seatId, showTime }`
  
- **Get Booking**
  - `GET /bookings/:id`
  
- **Update Booking**
  - `PUT /bookings/:id`
  - Request Body: `{ seatId, showTime }`
  
- **Delete Booking**
  - `DELETE /bookings/:id`

## Technologies Used

- Node.js
- Express
- MongoDB

## License

This project is licensed under the MIT License.