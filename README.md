## Items

Items Repository is a simple express app that allows you to create a simple repository.

### Description

This is a web application for managing a list of items. Users can view a list of items, view details about individual
items, add new items (if signed in), and delete existing items (if signed in).

### Installation

1. Clone the repo
2. Run `openssl genrsa -out key.pem` to generate a private key for self-signed SSL
3. Run `openssl req -new -key key.pem -out csr.pem` to generate a certificate signing request
4. Run `openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem` to generate a self-signed certificate
3. Run `cp backend/.env.example backend/.env` to create the backend environment file
4. Run `cp frontend/.env.example frontend/.env` to create the frontend environment file
5. Run `npm run install` to install the dependencies for both the frontend and the backend
6. Run `cd backend && npx prisma db push` to create the database tables
7. Run `npm run import:db && cd ..` to import sample data into the database
8. Run `npm run dev` from the project root directory to start the frontend and the backend servers at the same time
9. Go to `localhost:5173` to see the app

### Documentation

The API documentation is at [http://localhost:3000/docs](http://localhost:3000/docs)

### Tests

To run tests, run `npm test`

