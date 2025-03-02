# EVENTIO (movie-ticket-booking)

This project is a microservices-based backend for a movie ticket booking system. It consists of four main services: Auth Service, Booking Service, Seat Service, and an API Gateway. Each service is responsible for a specific functionality and communicates with each other to provide a seamless experience for users.

## System Overview
The movie ticket booking backend is designed to handle the booking of movie tickets for users. It supports functionalities such as user authentication, booking management, and seat reservations. The system is built using a microservices architecture to ensure scalability, maintainability, and flexibility.

## Functional Requirements
- **User Registration and Authentication:** Users should be able to register and log in to the system.
- **Movie Search:** Users should be able to search for movies by title, genre, and showtime.
- **Seat Selection:** Users should be able to view available seats and select their preferred seats.
- **Booking Confirmation:** Users should receive a confirmation of their booking.
- **Payment Processing:** Users should be able to make payments securely.
- **Booking History:** Users should be able to view their booking history.

## Non-Functional Requirements
- **Scalability:** The system should handle a large number of concurrent users.
- **Reliability:** The system should be highly available and reliable.
- **Performance:** The system should have low latency and high throughput.
- **Security:** The system should ensure secure handling of user data and payments.
- **Maintainability:** The system should be easy to maintain and extend.

## Microservices Overview

### Auth Service
The Auth Service handles user authentication and authorization. It provides endpoints for user registration, login, and token management.

### Booking Service
The Booking Service manages movie bookings. It allows users to create, update, and retrieve their bookings.

### Seat Service
The Seat Service is responsible for managing seat availability and reservations. It ensures that users can only book available seats.

### API Gateway
The API Gateway acts as a single entry point for all client requests. It routes requests to the appropriate microservices and aggregates responses.

## Project Structure

```
eventio
├── auth-service
├── booking-service
├── seat-service
└── api-gateway
```

## Getting Started

To run the entire application, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd eventio
   ```

2. **Navigate to each service directory and install dependencies:**
   ```
   cd auth-service
   npm install
   cd ../booking-service
   npm install
   cd ../seat-service
   npm install
   cd ../api-gateway
   npm install
   ```

3. **Set up your MongoDB database** and update the connection strings in each service's configuration.

4. **Start each service:**
   ```
   cd auth-service
   npm start
   cd ../booking-service
   npm start
   cd ../seat-service
   npm start
   cd ../api-gateway
   npm start
   ```

5. **Access the API Gateway** at `http://localhost:<port>` (replace `<port>` with the port number configured for the API Gateway).

## API Documentation

Refer to the individual README files in each service for detailed API usage and endpoints.

## Concurrency Handling
The system uses various techniques to handle concurrency, such as:
- **Database Transactions:** Ensuring atomicity and consistency of operations.
- **Optimistic Locking:** Preventing conflicts during concurrent updates.
- **Message Queues:** Handling asynchronous tasks and communication between microservices.

## Performance Testing & Load Efficiency

To ensure that our API meets high-performance standards under load, we implemented load testing using Artillery along with OS clustering and the Node.js Cluster module. This distributes incoming requests across multiple CPU cores, improving throughput and reducing latency.

- **Load Testing:** We simulate a high number of concurrent users to test the system’s scalability. Our load tests have shown that even under significant load, our endpoints respond efficiently.  
- **Stress Testing:** By pushing the system to its limits, we have identified and resolved potential bottlenecks.  
- **Latency & Throughput:** Our tests measure response times and the number of requests processed per second. Although some 404 responses were observed during testing, these were due to intentionally incorrect user details in test scenarios.
- **Efficiency:** The use of OS-level clustering has improved our API's performance, allowing the services to handle thousands of requests with low average latency.  
- **Monitoring:** We continuously monitor performance metrics to ensure that our services meet the required service level agreements (SLAs).

## Limitations

While our current setup meets the expected performance and scalability requirements, there are some limitations:
- **Resource Constraints:** Under extreme loads, performance may degrade if hardware resources are limited.
- **Single Point of Failure:** Although microservices reduce overall risk, the API Gateway could become a bottleneck if not scaled appropriately.
- **Future Enhancements:** Additional optimizations (e.g., caching with Redis, database indexing improvements) may be required as the number of users increases.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
````