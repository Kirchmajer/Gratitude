/**
 * Test script to verify that the Vite proxy is correctly routing API requests
 * 
 * This script:
 * 1. Starts the Express server
 * 2. Starts the Vite dev server
 * 3. Opens a browser to the Vite dev server
 * 4. Provides instructions for testing the proxy
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Check if .env file exists in server directory
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  console.log(`${colors.fg.yellow}Warning: No .env file found in server directory.${colors.reset}`);
  console.log(`${colors.fg.yellow}You may need to create one based on .env.example${colors.reset}`);
  
  // Ask if user wants to continue
  rl.question(`${colors.fg.yellow}Continue anyway? (y/n) ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'y') {
      startServers();
    } else {
      console.log(`${colors.fg.red}Test aborted.${colors.reset}`);
      rl.close();
      process.exit(0);
    }
  });
} else {
  startServers();
}

function startServers() {
  console.log(`${colors.bright}${colors.fg.cyan}Starting proxy test...${colors.reset}`);
  
  // Start the Express server
  console.log(`${colors.fg.green}Starting Express server...${colors.reset}`);
  const serverProcess = spawn('npm', ['run', 'server'], { 
    cwd: __dirname,
    shell: true,
    stdio: 'pipe'
  });
  
  let serverStarted = false;
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`${colors.fg.green}[SERVER] ${output.trim()}${colors.reset}`);
    
    // Check if server has started
    if (output.includes('Server running on port')) {
      serverStarted = true;
      startClient();
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(`${colors.fg.red}[SERVER ERROR] ${data.toString().trim()}${colors.reset}`);
  });
  
  // Set a timeout in case the server doesn't start
  setTimeout(() => {
    if (!serverStarted) {
      console.log(`${colors.fg.yellow}Server hasn't reported startup yet, but we'll try to start the client anyway...${colors.reset}`);
      startClient();
    }
  }, 5000);
  
  function startClient() {
    // Start the Vite dev server
    console.log(`${colors.fg.blue}Starting Vite dev server...${colors.reset}`);
    const clientProcess = spawn('npm', ['run', 'client'], { 
      cwd: __dirname,
      shell: true,
      stdio: 'pipe'
    });
    
    clientProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`${colors.fg.blue}[CLIENT] ${output.trim()}${colors.reset}`);
      
      // Check if client has started and show instructions
      if (output.includes('Local:') && output.includes('http://localhost')) {
        showInstructions();
      }
    });
    
    clientProcess.stderr.on('data', (data) => {
      console.error(`${colors.fg.red}[CLIENT ERROR] ${data.toString().trim()}${colors.reset}`);
    });
  }
  
  function showInstructions() {
    console.log('\n');
    console.log(`${colors.bright}${colors.fg.magenta}=== PROXY TEST INSTRUCTIONS ===${colors.reset}`);
    console.log(`${colors.fg.white}1. Open your browser to ${colors.fg.cyan}http://localhost:3000${colors.reset}`);
    console.log(`${colors.fg.white}2. Click the ${colors.fg.cyan}"Test Mode"${colors.fg.white} button in the bottom right corner${colors.reset}`);
    console.log(`${colors.fg.white}3. Click the ${colors.fg.green}"Test Proxy"${colors.fg.white} button to run the test${colors.reset}`);
    console.log(`${colors.fg.white}4. Check the results to see if the proxy is working correctly${colors.reset}`);
    console.log('\n');
    console.log(`${colors.fg.yellow}Press Ctrl+C to stop both servers when you're done testing${colors.reset}`);
    console.log('\n');
  }
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log(`${colors.fg.yellow}Stopping servers...${colors.reset}`);
    serverProcess.kill();
    rl.close();
    process.exit(0);
  });
}
