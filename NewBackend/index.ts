import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: [/^http:\/\/localhost:\d+$/],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        sameSite: "strict",
    })
);

app.use(express.json());
app.use(cookieParser() as express.RequestHandler);

app.use("/api", authRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});