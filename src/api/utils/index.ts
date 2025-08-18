import { Response } from 'express';

export function sendJson<K extends string, V>(res: Response, key: K, value: V, { message, error }: { message: unknown; error?: boolean }): void {
    res.json({
        success: error ? false : true,
        message: message,
        [key]: value
    });
}


