import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRoute from "./routes/auth_route.js"
import libRoute from "./routes/sharedlib_route.js"
import { connectDB } from "./lib/db.js"
import fileUpload from "express-fileupload";
import mailRoute from "./routes/email_route.js"
import qNaRoute from "./routes/qna_route.js"
import lNfRoute from "./routes/lnf_route.js"

dotenv.config()
const app = express() 
const PORT = process.env.PORT

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }));
app.use("/auth", authRoute)
app.use("/sharedlib", libRoute)
app.use("/mail", mailRoute)
app.use("/qna", qNaRoute)
app.use("/lnf", lNfRoute)

app.listen(PORT, () => {
    console.log("server is running on port : " + PORT)
    connectDB()
}) 