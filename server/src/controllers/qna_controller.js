// Import dependencies
import Message from "../models/message_model.js";
import { io } from "../lib/socket.js"; // Adjust the path to your socket file
import cloudinary from "../lib/cloudinary.js"; // Adjust the path to your cloudinary setup

// Get Q&A messages for a specific category
export const getQnAPerCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const messages = await Message.find({ category });
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getQnAPerCategory:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a list of unique categories
export const getCategoryList = async (req, res) => {
    try {
        const categories = await Message.distinct("category");
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error in getCategoryList:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add a new category
export const addCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const newMessage = new Message({
            category,
            messages: [],
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in addCategory:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove a category
export const removeCategory = async (req, res) => {
    try {
        const { category } = req.params;
        await Message.deleteMany({ category });
        res.status(200).json({ message: "Category removed successfully" });
    } catch (error) {
        console.log("Error in removeCategory:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendQuestion = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { category } = req.params;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const qnaEntry = await Message.findOne({ category });
        if (!qnaEntry) {
            const newQnA = new QnA({
                category,
                messages: [{ senderId, text, image: imageUrl, type: "question" }],
            });
            await newQnA.save();
            io.emit("newQuestion", newQnA);
            return res.status(201).json(newQnA);
        }

        qnaEntry.messages.push({ senderId, text, image: imageUrl, type: "question" });
        await qnaEntry.save();

        io.emit("newQuestion", qnaEntry);
        res.status(201).json(qnaEntry);
    } catch (error) {
        console.error("Error in sendQuestion:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendAnswer = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { category } = req.params;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const qnaEntry = await Message.findOne({ category });
        if (!qnaEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        qnaEntry.messages.push({ senderId, text, image: imageUrl, type: "answer" });
        await qnaEntry.save();

        io.emit("newAnswer", qnaEntry);
        res.status(201).json(qnaEntry);
    } catch (error) {
        console.error("Error in sendAnswer:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Get all questions for a specific category
export const getQuestions = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Message.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const questions = category.messages.filter(
            (message) => message.type === "question"
        );

        res.status(200).json(questions);
    } catch (err) {
        console.error("Error in getQuestions: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all answers for a specific category
export const getAnswers = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Message.findById(categoryId);
        if (!category) return res.status(404).json({ error: "Category not found" });

        const answers = category.messages.filter(
            (message) => message.type === "answer"
        );

        res.status(200).json(answers);
    } catch (err) {
        console.error("Error in getAnswers: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};