## Items
Items Repository is a simple express app that allows you to create a simple repository.

### Description
This is a web application for managing a list of items. Users can view a list of items, view details about individual
items, add new items (if signed in), and delete existing items (if signed in).

### Prerequisites
- Node.js v16 (v16.14.2 is he latest supported Node), won't work with v18
- npm v7
- Git
- OpenSSL
- Google Chrome

### Using Node.js and nvm data sources
- [https://nodejs.org/en/download/]
- [https://www.freecodecamp.org/news/nvm-for-windows-how-to-download-and-install-node-version-manager-in-windows-10/]
- [https://github.com/coreybutler/nvm-windows/releases]
- [https://blog.logrocket.com/switching-between-node-versions-during-development/]

### Installation
#### Getting and using Node Version Manager (NVM)
##### For Windows
0. Uninstall any pre-existing Node installations!!
   0.1 Run `node -v` to check if Node is installed. Iy you see a version number, then Node is installed. If you see an
   error message, then Node is not installed.
1. Go to [https://github.com/coreybutler/nvm-windows/releases]
2. Click on the "nvm-setup.exe" link to download the NVM setup file.
3. Run the setup file.
5. Follow the instructions in the setup wizard.
6. Open PowerShell window as an Administrator and move to C:/Users/your-user-name
7. Run `nvm -v` to check if NVM is installed. If you see a version number, then NVM is installed. If you see an error message, then NVM is not installed.
8. To use the latest lts version of Node.js, run `nvm use lts` in PowerShell window as an Administrator in Windows\System32 directory.
   PS C:\Users\kasutaja> cd ..
   PS C:\Users> cd ..
   PS C:\> cd .\Windows\
   PS C:\Windows> cd .\System32\
   PS C:\Windows\System32> nvm install lts
9. Run `nvm install 16.14.2` to install Node.js v16.14.2.
10. Run `nvm use 16.14.2` to use Node.js v16.14.2.
11. Move to Installation section if you do not want to install the latest Node as-well.
12. Install latest Node.js version by running `nvm install latest` in PowerShell window as an Administrator.
13. Setup node location in idea by going to File -> Settings -> Languages & Frameworks -> Node.js
14. Restart idea
15. Run `node -v` to check Node version

##### For Mac
0. Uninstall any pre-existing Node installations!!
1. Run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash` to install NVM.
2. Run `nvm install 16.14.2` to install Node.js v16.14.2.
3. Run `nvm use 16.14.2` to use Node.js v16.14.2.
4. Move to Installation section if you do not want to install the latest Node as-well.
5. Run `nvm install latest` to install the latest version of Node.js.
6. Run `nvm use latest` to use the latest version of Node.js.

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

### For Unit Tests with Jest
To run unit tests, run `npm run test:unit`