import { NextFunction, Request, Response } from "express";

import supabase from "../config/database/supabase";
import { User } from "@supabase/supabase-js";

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

export async function checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: Token missing' });
        return
    }

    try {
        // verify the token + get user
        const { data: { user }, error } = await supabase.auth.getUser(token);
    
        if (error) {
            console.error('Supabase token verification error:', error.message);
            res.status(401).json({ error: `Unauthorized: ${error.message}` });
            return
        }
    
        if (!user) {
            // valid token but no user found
            res.status(401).json({ error: 'Unauthorized: User not found for this token' });
            return
        }
    
        // archive the user
        req.user = user;
    
        return next();
    
    } catch (error) {
        console.error('Unexpected error during authentication:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
        return
    }
}