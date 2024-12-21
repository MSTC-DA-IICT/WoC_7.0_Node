// Import dependencies
import Message from "../models/message_model.js";
import { io } from "../lib/socket.js"; // Adjust the path to your socket file
import cloudinary from "../lib/cloudinary.js"; // Adjust the path to your cloudinary setup

// Get Q&A messages for a specific category
export const getQnAPerCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const messages = await Message.findOne({ category });
        if (!messages) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(messages.messages);
    } catch (error) {
        console.error("Error in getQnAPerCategory:", error.message);
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


// Add a question to a specific category
export const sendQuestion = async (req, res) => {
    try {
        const { category } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const categoryEntry = await Message.findOne({ category });
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        const newQuestion = { senderId, text, image: imageUrl, answers: [] };
        categoryEntry.messages.push(newQuestion);
        await categoryEntry.save();

        io.emit("newQuestion", newQuestion); // Real-time update via socket.io
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error("Error in sendQuestion:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add an answer to a specific question
export const sendAnswer = async (req, res) => {
    try {
        const { category } = req.params;
        const { questionId, text, image } = req.body;
        const senderId = req.user._id;

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const categoryEntry = await Message.findOne({ category });
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        const question = categoryEntry.messages.id(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const newAnswer = { senderId, text, image: imageUrl };
        question.answers.push(newAnswer);
        await categoryEntry.save();

        io.emit("newAnswer", { questionId, newAnswer }); // Real-time update via socket.io
        res.status(201).json(newAnswer);
    } catch (error) {
        console.error("Error in sendAnswer:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all questions for a category
export const getQuestions = async (req, res) => {
    try {
        const { category } = req.params;

        const categoryEntry = await Message.findOne({ category });
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        const questions = categoryEntry.messages.map((message) => ({
            _id: message._id,
            senderId: message.senderId,
            text: message.text,
            image: message.image,
        }));

        res.status(200).json(questions);
    } catch (error) {
        console.error("Error in getQuestions:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get answers for a specific question
export const getAnswers = async (req, res) => {
    try {
        const { category } = req.params;
        const { questionId } = req.body;

        const categoryEntry = await Message.findOne({ category });
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        const question = categoryEntry.messages.id(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question.answers);
    } catch (error) {
        console.error("Error in getAnswers:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
