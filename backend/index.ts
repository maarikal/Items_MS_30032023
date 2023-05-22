import express, {Express, NextFunction, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {Error} from './types';
import * as dotenv from 'dotenv';
import usersRoutes from "./routes/usersRoutes";
import itemsRoutes from "./routes/itemsRoutes";
import cors from 'cors';
import sessionsRoute from "./routes/sessionsRoute";
import bodyParser from "body-parser";
import bodyParserXml from "body-parser-xml";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load('./swagger.yaml');

bodyParserXml(bodyParser); // register xml parser

app.use(cors());

// Add https support
import https from 'https';
import fs from 'fs';
const options = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};

const httpsServer = https.createServer(options, app).listen(port, () => {
    console.log(`Running at https://localhost:${port} and docs at https://localhost:${port}/docs`);
});

// Add websocket server using npm express-ws
export const expressWs = require('express-ws')(app, httpsServer);

// Get the /ws websocket route
// @ts-ignore
app.ws('/ws', async function(ws, req) {
    ws.on('message', async function(msg: any) {
        console.log(msg);
        // Send a received message to all connected clients
        ws.send(msg);

        ws.send(JSON.stringify({ "message" : "hello" }));
        // Start listening for messages
        // send message to all clients
        // @ts-ignore
        console.log('siin getWss töötab ja saadab klientidele sõnumi')
        expressWs.getWss().clients
            .forEach((client: any) => client
                .send(JSON.stringify({'message': 'helloooooo'}))
            );
    });
    // ws on close
    ws.on('close', function() {
        console.log('WebSocket was closed');
    });
    // ws on error
    ws.on('error', function() {
        console.log('WebSocket was restarted');
    });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return res.status(err.statusCode || 500).send(err.message || 'Internal Server Error');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // use url-encoded middleware
app.use(bodyParser.xml());
app.use(express.static('public'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Routes
app.use('/users', usersRoutes);
app.use('/items', itemsRoutes);
app.use('/sessions', sessionsRoute);

// Health check
app.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});