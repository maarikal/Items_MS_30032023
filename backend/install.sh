#!/bin/bash

# Step 2
echo -e "\n" | openssl genrsa -out key.pem

# Step 3 - Generate CSR configuration file
cat <<EOT >> csr.conf
[req]
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn
[dn]
C=XX
ST=XX
L=XX
O=XX
OU=XX
CN=localhost
emailAddress=test@test.ee
[req_ext]
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
EOT

# Step 4 - Generate CSR using the configuration file
openssl req -new -key key.pem -out csr.pem -config csr.conf

# Step 5 - Generate self-signed certificate
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

# Remove the temporary CSR configuration file
rm csr.conf

# Rest of the steps
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm i @badeball/cypress-cucumber-preprocessor
npm i sax
npm i --save-dev @types/body-parser-xml
npm i --save-dev @types/uuid
npm run install
cd backend && npx prisma db push
npm run import:db && cd ..