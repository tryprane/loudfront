# Member Tracker Frontend

A React TypeScript application for tracking and monitoring member changes in real-time.

## Features

- Real-time member tracking with WebSocket updates
- Dashboard with overview statistics
- Member list with search functionality
- Change history with filtering options
- System and member statistics
- Dark mode UI with Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend repository)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd member-tracker-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3001
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at http://localhost:3001

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API and WebSocket services
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main application component
  └── index.tsx      # Application entry point
```

## Technologies Used

- React
- TypeScript
- Material-UI
- React Query
- React Router
- WebSocket
- Axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 