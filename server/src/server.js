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
import bodyParser from "body-parser"
import {app, server} from "./lib/socket.js"
import path,{dirname} from "path";
import { fileURLToPath } from 'url';

dotenv.config()
const PORT = process.env.PORT

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))
app.use(express.json())
console.log("server.js")
app.use(bodyParser.json({ limit: "20mb" })); // Adjust size as needed
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }));
app.use("/api/auth", authRoute)
app.use("/api/sharedlib", libRoute)
app.use("/api/mail", mailRoute)
app.use("/api/qna", qNaRoute)
app.use("/api/lnf", lNfRoute)

server.listen(PORT, () => {
    console.log("server is running on port : " + PORT)
    connectDB()
}) 