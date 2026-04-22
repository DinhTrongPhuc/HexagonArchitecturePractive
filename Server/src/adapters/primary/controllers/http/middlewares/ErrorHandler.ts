import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(`[Error] ${err.message}`);
    
    // Customize your error handling logic here
    const status = err.status || 400;
    res.status(status).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
}
