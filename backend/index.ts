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
const port: Number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load('./swagger.yaml');

bodyParserXml(bodyParser); // register xml parser

app.use(cors());

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

// Start the server
app.listen(port, () => console.log(`Running at http://localhost:${port} and docs at http://localhost:${port}/docs`));
