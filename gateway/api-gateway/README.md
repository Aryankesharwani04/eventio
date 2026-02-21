# Movie Ticket Booking Backend - API Gateway

This is the API Gateway for the Movie Ticket Booking Backend project. The API Gateway acts as a single entry point for all client requests and routes them to the appropriate microservices.

## Overview

The API Gateway is responsible for:

- Routing requests to the Auth Service, Booking Service, and Seat Service.
- Aggregating responses from multiple services if necessary.
- Handling authentication and authorization for incoming requests.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd movie-ticket-booking-backend/api-gateway
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Ensure you have the necessary environment variables set up for connecting to the microservices. You may need to configure the following:
   - `AUTH_SERVICE_URL`
   - `BOOKING_SERVICE_URL`
   - `SEAT_SERVICE_URL`

4. **Run the API Gateway**
   ```bash
   npm start
   ```

## API Usage

The API Gateway exposes the following endpoints:

- **Authentication**
  - `POST /auth/register` - Register a new user.
  - `POST /auth/login` - Log in an existing user.

- **Booking**
  - `POST /bookings` - Create a new booking.
  - `GET /bookings/:id` - Retrieve a booking by ID.

- **Seat Management**
  - `GET /seats` - Get available seats.
  - `POST /seats/reserve` - Reserve a seat.

## Notes

- Ensure that all microservices are running before making requests to the API Gateway.
- For detailed API documentation for each microservice, refer to their respective README files.