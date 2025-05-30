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

The server requires environment variables to be set in a `.env` file in the server directory. A sample file `.env.example` is provided as a template:

1. Copy the example file:
   ```
   cp server/.env.example server/.env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual values:
   ```
   PORT=5000
   NODE_ENV=development
   OPENROUTER_API_KEY=your_actual_openrouter_api_key
   ```

3. You'll need to obtain an API key from [OpenRouter](https://openrouter.ai/) to use the LLM features.

### API Key Security

⚠️ **IMPORTANT: Never commit your `.env` file to version control!** ⚠️

The `.env` file contains sensitive information, including your API keys. The repository is configured to ignore this file via `.gitignore`, but you should always verify that your API keys and other secrets are not being committed.

If you accidentally commit your API key:

1. Remove the file from Git tracking (without deleting it locally):
   ```
   git rm --cached server/.env
   ```

2. Commit this change:
   ```
   git commit -m "Remove .env file with API key"
   ```

3. Revoke the exposed API key and generate a new one at [OpenRouter](https://openrouter.ai/keys)

4. Update your local `.env` file with the new API key

## Database Setup

The application uses SQLite for data storage. The database file is automatically created when the server starts for the first time.

- The database schema is defined in `server/db/init.sql`
- The database file is stored in `server/db/data/gratitude.db`
- The database file is excluded from version control via `.gitignore`

When a new developer clones the repository, the database will be automatically initialized with the correct schema when they start the server for the first time.

## LLM Integration Architecture

The application uses a modular approach to integrate with Large Language Models:

### Centralized Prompts

All prompts used for LLM interactions are centralized in `server/utils/prompts.js`. This ensures:

- Consistency between the main application and testing components
- Single source of truth for prompt engineering
- Easier maintenance and updates to prompts

### Centralized LLM Configuration

LLM configuration parameters are centralized in `server/utils/llmConfig.js`, including:

- Token limits for different prompt types
- Temperature settings for different use cases
- Default model selection
- API endpoint configuration
- Header configuration

This architecture makes it easy to:
- Adjust token limits for different prompt types
- Fine-tune temperature settings for different use cases
- Switch between different LLM providers or models
- Maintain consistency between the main application and testing components

## Usage

1. **New Entry**: Enter what you're grateful for (from a single word to a full sentence)
2. **Clarifying Questions**: If your input is vague, the app will ask questions to help you elaborate
3. **Choose a Suggestion**: Select from three refined gratitude statements
4. **View History**: Switch to the History tab to see all your saved entries
5. **Delete Entries**: Remove any entries you no longer want to keep
6. **Test Mode**: Access testing tools via the "Test Mode" button in the bottom right corner

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
│       ├── prompts.js      # Centralized LLM prompts
│       └── llmConfig.js    # LLM configuration parameters
└── package.json            # Root package.json for running both client and server
