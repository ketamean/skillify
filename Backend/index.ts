import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import serviceRouter from "./routes/serviceRoutes";
// import courseRoutes from "./routes/courseRoutes";
// import couponRoutes from "./routes/couponRoutes";
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

// app.use("/api/courses", courseRoutes);
app.use("/api", router);
app.use("/service", serviceRouter);
// app.use('/api/coupons', couponRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
