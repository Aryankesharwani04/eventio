# Auth Service

This is the Auth Service for the Movie Ticket Booking backend. It handles user authentication, registration, and session management.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd movie-ticket-booking-backend/auth-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root of the `auth-service` directory and add the following variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```

4. **Start the service**:
   ```
   npm start
   ```

## API Usage

### Endpoints

- **POST /api/auth/register**
  - Register a new user.
  
- **POST /api/auth/login**
  - Authenticate a user and return a JWT.

- **GET /api/auth/logout**
  - Log out the user.

### Example Requests

- **Register User**:
  ```
  POST /api/auth/register
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```

- **Login User**:
  ```
  POST /api/auth/login
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```

## License

This project is licensed under the MIT License.