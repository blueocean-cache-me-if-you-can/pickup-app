# PickUp App

## Setup

Follow these steps to get the project running locally:

1. **Install Dependencies**
   Inside the root directory of the app (`path/to/pickup-app`), open your terminal and run:
   ```bash
   npm install
   ```

2. **Start the Development Server**
   After installing dependencies, run:
   ```bash
   npm run server-dev
   ```

   then run:
   ```bash
   npm run client-dev
   ```

3. **Open in Browser**
   By default, the app will be available at:
   ```
   http://localhost:3000/
   ```

## Codebase Overview

### Tech Stack
- **Frontend**: React 19, Mantine UI, Phosphor Icons
- **Backend**: Express.js, Node.js
- **Build Tools**: Webpack, Babel
- **Development**: ESLint (Airbnb config), Nodemon

### Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API

### Routing
- **Client Routes**: All frontend routes are served from `/` (root)
- **Server Routes**: All API endpoints are prefixed with `/api/`

### Best Practices
For development guidelines, coding standards, and Git workflows, check the `guidelines/` folder.

### Environment
Copy `sample.env` to `.env` and configure your environment variables as needed.