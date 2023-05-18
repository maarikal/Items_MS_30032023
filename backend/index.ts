import express, {Express, NextFunction, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {Error} from './types';
import * as dotenv from 'dotenv';
import usersRoutes from "./routes/usersRoutes";
import itemsRoutes from "./routes/itemsRoutes";
import cors from 'cors';
import sessionsRoute from "./routes/sessionsRoute";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load('./swagger.yaml');

app.use(cors());

// Add https support
import https from 'https';
import fs from 'fs';
const options = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};

try {
    https.createServer(options, app).listen(port, () => {
        console.log(`Running at https://localhost:${port} and docs at https://localhost:${port}/docs`);
    });
}
catch (err) {
    console.error(err);
}


// Add websocket support
import {WebSocketServer} from "ws";
const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        console.log(`Received message from client => ${data}`);
        ws.send(`Hello, you sent => ${data}`);
    });
    ws.send("Hi there, I am a WebSocket server");
}
);

console.log(`WebSocket server is listening at ws://localhost:${port}`);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return res.status(err.statusCode || 500).send(err.message || 'Internal Server Error');
});

// Middleware
app.use(express.json());
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

// Start the server
//app.listen(port, () => console.log(`Running at http://localhost:${port} and docs at http://localhost:${port}/docs`));
