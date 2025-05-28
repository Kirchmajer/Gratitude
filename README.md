# Gratitude App

A full-stack application for practicing daily gratitude. This app helps users articulate and save their gratitude statements, making it easier to maintain a regular gratitude practice.

## Features

- **Sentence Builder**: Helps users refine their gratitude statements
- **Clarifying Questions**: Coaxes more detail from vague inputs
- **Multiple Suggestion Styles**: Offers concise, poetic, and conversational options
- **History View**: Allows users to review past gratitude entries
- **Fallback Mechanisms**: Ensures the app works even when the LLM API is unavailable

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: SQLite
- **LLM Integration**: OpenRouter API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```
   This will install dependencies for the root project, server, and client.

### Running the Application

To start both the server and client concurrently:

```
npm start
```

This will start:
- The server on http://localhost:5000
- The client on http://localhost:3000

### Individual Commands

If you prefer to run the server and client separately:

- Start the server:
  ```
  npm run server
  ```

- Start the client:
  ```
  npm run client
  ```

## Environment Variables

The server requires the following environment variables in a `.env` file in the server directory:

```
PORT=5000
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Usage

1. **New Entry**: Enter what you're grateful for (from a single word to a full sentence)
2. **Clarifying Questions**: If your input is vague, the app will ask questions to help you elaborate
3. **Choose a Suggestion**: Select from three refined gratitude statements
4. **View History**: Switch to the History tab to see all your saved entries
5. **Delete Entries**: Remove any entries you no longer want to keep

## Project Structure

```
gratitude-app/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React components and logic
│       ├── components/     # UI components
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       ├── styles/         # CSS files
│       └── utils/          # Utility functions
├── server/                 # Express backend
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database setup and data
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
└── package.json            # Root package.json for running both client and server
