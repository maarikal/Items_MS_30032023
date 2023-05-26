// types.ts
import {Request} from 'express';

export interface IRequestWithSession extends Request {
    sessionId?: string;
    userId?: Int;
}