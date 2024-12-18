import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoute from "./routes/auth_route.js"
import { connectDB } from "./lib/db.js"

dotenv.config()
const app = express() 
const PORT = process.env.PORT

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRoute)

app.listen(PORT, () => {
    console.log("server is running on port : " + PORT)
    connectDB()
}) 