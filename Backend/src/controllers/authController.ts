import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error || !data.session) throw new Error(error?.message || "Login failed.");

            const user = data.user;

            res.cookie("session_token", data.session.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            });

            res.json({
                message: "Login successful!",
                user: {
                    id: user.id,
                    email: user.email,
                }
            });

        } catch (err: any) {
            res.status(401).json({ error: err.message });
        }
    }

    static async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie("session_token");
        res.json({ message: "Logged out successfully" });
    }
}

export default AuthController;