import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"
import aptitudeRouter from "./routes/aptitude.route.js"

const app = express()
// Frontend URLs allowed to call this API. Set CLIENT_URL to the deployed
// frontend (comma-separate several), e.g. CLIENT_URL=https://liveprep.vercel.app
const allowedOrigins = [
    "http://localhost:5173",
    ...(process.env.CLIENT_URL || "")
        .split(",")
        .map((url) => url.trim().replace(/\/+$/, ""))
        .filter(Boolean),
]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)
app.use("/api/aptitude" , aptitudeRouter)

const PORT = process.env.PORT || 6000
app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`)
    connectDb()
})
