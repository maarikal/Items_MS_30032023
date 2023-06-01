## Items
Items Repository is a simple express app that allows you to create a simple repository.

### Description
This is a web application for managing a list of items. Users can view a list of items, view details about individual
items, add new items (if signed in), and delete existing items (if signed in).

### Installation
1. Run `./install.sh` (Use Git Bash on Windows)
2. Copy your client ID into the backend environment file (see below for instructions on how to create a client ID)
3. Run `npm run dev` from the project root directory to start the frontend and the backend servers at the same time
4. Go to `https://localhost:3000` and accept the self-signed certificate
5. Go to `https://localhost:5173` to see the app

### Manual Installation
1. Run `openssl genrsa -out key.pem` to generate a private key for self-signed SSL
2. Run `openssl req -new -key key.pem -out csr.pem` to generate a certificate signing request
3. Run `openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem` to generate a self-signed certificate
4. Run `cp backend/.env.example backend/.env` to create the backend environment file
5. Run `cp frontend/.env.example frontend/.env` to create the frontend environment file
6. Run `npm i @badeball/cypress-cucumber-preprocessor` to install the Badeball Cypress Cucumber Preprocessor
7. Run `npm i --save-dev @types/uuid` to install uuid types
8. Run `npm i --save-dev @types/body-parser-xml` to install xml body parser types
9. Run `npm i sax` to install the sax XML parser
10. Run `npm run install` to install the dependencies for both the frontend and the backend
11. Run `cd backend && npx prisma db push` to create the database tables
12. Run `npm run import:db && cd ..` to import sample data into the database
13. Copy your client ID into the backend environment file (see below for instructions on how to create a client ID)
14. Run `npm run dev` from the project root directory to start the frontend and the backend servers at the same time
15. Go to `https://localhost:3000` and accept the self-signed certificate
16. Go to `https://localhost:5173` to see the app

### For oAuth2
1. Create a new app in the [Google Developer Console](https://console.developers.google.com/)
2. Create a new OAuth 2.0 Client ID
3. Add `https://localhost:5173/oAuth2Login` as an authorized redirect URI
4. Add `https://localhost:5173` as an authorized JavaScript origin
5. Copy your client ID into the backend environment file

### Documentation
The API documentation is at [https://localhost:3000/docs](https://localhost:3000/docs)

### Tests
To run tests, run `npm test`

