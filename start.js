const { exec } = require('child_process');
const path = require('path');

// Define the commands to start your backend and frontend servers
const backendDirectory = __dirname; // Replace with your backend directory path
const frontendDirectory = path.join(__dirname, 'frontend');

const command = 'npm start';

// Function to start the backend server
const startBackendServer = () => {
  const startBackend = exec(command);

  startBackend.stdout.on('data', (data) => {
    console.log(`[Backend]: ${data}`);
  });

  startBackend.stderr.on('data', (data) => {
    console.error(`[Backend Error]: ${data}`);
  });

  startBackend.on('exit', (code) => {
    console.log(`[Backend]: Child process exited with code ${code}`);
    startFrontendServer(); // Start the frontend server after the backend exits
  });
};

// Function to start the frontend server
const startFrontendServer = () => {
  const startFrontend = exec(command);

  startFrontend.stdout.on('data', (data) => {
    console.log(`[Frontend]: ${data}`);
  });

  startFrontend.stderr.on('data', (data) => {
    console.error(`[Frontend Error]: ${data}`);
  });

  startFrontend.on('exit', (code) => {
    console.log(`[Frontend]: Child process exited with code ${code}`);
  });
};

// Start the backend server first
startBackendServer();
