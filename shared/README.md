# Eventio Shared Module

Common utilities, middleware, and constants shared across all Eventio microservices.

## Contents

### Logger (`logger/`)
Centralized logging utility with support for different log levels (info, error, warn, debug).

### Middleware (`middleware/`)
- **errorHandler.js**: Global error handling middleware
- **requestId.js**: Request ID generation for distributed tracing

### Constants (`constants/`)
Shared constants including HTTP status codes, service ports, and service names.

### Utils (`utils/`)
- **responseFormatter.js**: Standard API response formatting utilities

## Usage

To use the shared module in a service:

```javascript
const logger = require('../../shared/logger');
const { HTTP_STATUS } = require('../../shared/constants');
const responseFormatter = require('../../shared/utils/responseFormatter');

logger.info('Service started');
```

## Installation

```bash
cd shared
npm install
```
