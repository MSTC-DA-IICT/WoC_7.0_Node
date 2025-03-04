import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user_model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body
    try {

        if(!fullName || !email || !password){
            return res.status(400).json({message : "All fields are required"})
        }

        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters"})
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message : "Email already exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName : fullName,
            email : email,
            password : hashedPwd,
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
                isAdmin : false,
            })
            
        } else {
            if(user) return res.status(400).json({message : "Invalid user data"})         
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({message : "Internal server error "})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "Invalid credentials"})
        } 
        const isCorrect = await bcrypt.compare(password, user.password);
        if(!isCorrect){
            return res.status(400).json({message : "Invalid credetials"})
        }

        generateToken(user._id, res)
        
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic,
            isAdmin : false,
        })

        
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge : 0})
        res.status(200).json({message : "Logged out successfully"})
    }catch(error){
        console.log("Error in logout controller", error.message)
        res.status(400).json({message : "Internal Server Error"})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({message : "Profile pic is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})

        res.status(200).json(updateUser)
    } catch (error) {
        console.log("Error in update profile : ", error.message)
        res.status(500).json({message : "Internal server error"})
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(res.user)
    } catch (error) {
        console.log("Error in checkAuth controller : ", error.message)
        res.status(500).json({message : "Internal server error"})
    }
}

export const adminSignup = async (req, res) => {
    const {fullName, email, password, admincode} = req.body
    try {

        if(!fullName || !email || !password || !admincode){
            return res.status(400).json({message : "All fields are required"})
        }
        if(admincode !== '#WoC_MSTC@2024') return res.status(400).json({message : "Wrong Admin Code"})
        if(password.length < 6){
            return res.status(400).json({message : "Password must be at least 6 characters"})
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message : "Email already exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName : fullName,
            email : email,
            password : hashedPwd,
            isAdmin : true
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic,
                isAdmin : true,
            })
            
        } else {
            if(user) return res.status(400).json({message : "Invalid user data"})         
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({message : "Internal server error "})
    }
}

export const adminLogin = async (req, res) => {
    const {email, password, admincode} = req.body
    try {
        if(admincode !== '#WoC_MSTC@2024') return res.status(400).json({message : "Wrong Admin Code"})
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "Invalid credentials"})
        } 
        const isCorrect = await bcrypt.compare(password, user.password);
        if(!isCorrect){
            return res.status(400).json({message : "Invalid credetials"})
        }

        generateToken(user._id, res)
        
        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            email : user.email,
            profilePic : user.profilePic,
            isAdmin : true,
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({message : "Internal Server Error"})
    }
}