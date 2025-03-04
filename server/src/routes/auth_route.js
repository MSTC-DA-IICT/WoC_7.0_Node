import express from "express"
import { adminLogin, adminSignup, login, logout, signup } from "../controllers/auth_controller.js"
import { protectRoute } from "../middleware/auth_mdw.js"
// import { updateProfile } from "../controllers/auth_controller.js"
import { checkAuth } from "../controllers/auth_controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.post("/adminsignup", adminSignup)
router.post("/adminlogin", adminLogin)

// router.put("/updateP rofile", protectRoute, updateProfile) // Ig put for pass through multiple middleware and it send the response gained from function to the next function 
router.get("/check", protectRoute, checkAuth)  

export default router;