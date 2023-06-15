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
1. Go to the [Google Developer Console](https://console.developers.google.com/) and sign in with your Google account.
2. Create a new project by clicking on the project dropdown menu at the top of the page and selecting "New Project".
   Enter a name for your project and click on the "Create" button.
3. Once your project is created, make sure it is selected from the project dropdown menu at the top of the page.
4. In the left sidebar or left hamburger menu, click on the "Credentials" menu option in the APIs & Services section.
5. On the Credentials page, click on the "Create Credentials" button and select "OAuth client ID" from the dropdown
   menu.
6. Click on the "Configure consent screen" button.
7. On the "OAuth consent screen" page, select "External" and click on the "Create" button.
8. Enter a name for your app.
9. Enter User support email and Developer contact information.
10. Click on the "Save and Continue" button.
11. Click on the "Add or Remove Scopes" button.
12. Select the "email" and "profile" scopes and click on the "Update" button.
13. Click on the "Save and Continue" button.
14. Under Test users, click on the "Add Users" button.
15. Enter your test user's email addresses separated by commas and click on the "Add" button. Don't add your own email
    address.
16. Click on the "Save and Continue" button.
17. Click on the "Back to Dashboard" button.
18. Click on the "Credentials" menu option in the left sidebar or left hamburger menu.
19. On the Credentials page, click on the "Create Credentials" button and select "OAuth client ID" from the dropdown
    menu.
20. Select "Web application" as the Application type.
21. Enter a name for your app.
22. Under Authorized JavaScript origins, click on the "Add URI" button.
23. Enter https://localhost:5173.
24. Under Authorized redirect URIs, click on the "Add URI" button.
25. Enter https://localhost:5173/oAuth2Login.
26. Click on the "Create" button.
27. Copy your client ID from the popup window.
28. Paste your client ID into the backend environment file (/backend/.env).

### Documentation
The API documentation is at [https://localhost:3000/docs](https://localhost:3000/docs)

### Tests
To run tests, run `npm test`