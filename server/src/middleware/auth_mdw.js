import jwt from  "jsonwebtoken"
import User from "../models/user_model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            console.log("Invalid token");
            return res.status(401).json({ message: "Unauthorized - Invalid Token Provided" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "User not found" });
        }

        console.log("Authenticated user:", user); // Log user details
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
