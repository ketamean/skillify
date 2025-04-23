import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import serviceRouter from "./routes/serviceRoutes";
import quizzRoutes from "./routes/quizzRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: [/^http:\/\/localhost:\d+$/],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    })
);

app.use(express.json());
app.use(cookieParser() as express.RequestHandler);

app.use("/api/quizzes", quizzRoutes);  
app.use("/api", router);  
app.use("/service", serviceRouter);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
