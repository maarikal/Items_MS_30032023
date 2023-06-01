import express, {Request, Response} from 'express';
import fs from "fs";

const router = express.Router();

// Routes
router.get(
    '/',
    // logs get and data is in file.log
    (async (req: Request, res: Response) => {
        const data = fs.readFileSync('file.log', 'utf8');
        const logs = data
            .split('\n')
            .filter(Boolean).map((line) => {
                const parsedLine = JSON.parse(line);
                // Perform any necessary transformations on each log entry
                const transformedLog = {
                    item: parsedLine.item,
                    message: parsedLine.message.toUpperCase(),
                    timestamp: parsedLine.timestamp
                };
                return transformedLog;
            });
        console.log("logs", logs)
        res.send({logs: logs});
    })
);

export default router;

