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
        const { text, file } = req.body; // Access text and Base64 file directly

        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }
        const senderId = req.user._id;

        let fileUrl = null;

        // If a file is provided, upload it to Cloudinary
        if (file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(`data:;base64,${file}`, {
                    resource_type: "auto", // Automatically detect the file type (e.g., image, video, PDF)
                });
                fileUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("File upload error:", uploadError.message);
                return res.status(500).json({ message: "Failed to upload file" });
            }
        } else {
            console.log("No file provided");
        }

        // Find the category in the database
        const categoryEntry = await Message.findOne({ category });
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Create the new question
        const newQuestion = { senderId, text, file: fileUrl, answers: [] };
        categoryEntry.messages.push(newQuestion);
        await categoryEntry.save();

        // Emit the new question event
        io.emit("newQuestion", newQuestion);

        // Respond with the created question
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
        const { questionId, text, file } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }
        const senderId = req.user._id;

        let fileUrl = null;
        if (file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(`data:;base64,${file}`, {
                    resource_type: "auto",
                });
                fileUrl = uploadResponse.secure_url;
                console.log("File URL:", fileUrl);
            } catch (uploadError) {
                console.error("File upload error:", uploadError.message);
                return res.status(500).json({ message: "Failed to upload file" });
            }
        }
        console.log("anyone here")
        const categoryEntry = await Message.findOne({ category });
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }
        console.log("OR here")
        const question = categoryEntry.messages.id(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        console.log("finally here")
        const newAnswer = { senderId, text, file: fileUrl };
        console.log("New Answer:", newAnswer);

        question.answers.push(newAnswer); // Debug this if it silently fails
        console.log("Answer added to question:", question);

        try {
            await categoryEntry.save();
            console.log("Save successful");
        } catch (saveError) {
            console.error("Save Error:", saveError.message);
            return res.status(500).json({ message: "Failed to save answer" });
        }

        console.log("About to emit 'sendAnswer':", { questionId, newAnswer });
        io.emit("newAnswer", { questionId, newAnswer });
        console.log("'sendAnswer' emitted");


        res.status(201).json(newAnswer);
    } catch (error) {
        console.error("Error in sendAnswer:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

};


// Get all questions for a category
export const getQuestions = async (req, res) => {
    try {
        const { categoryId } = req.params; // Use categoryId to match the route

        // Find the category in the database
        const categoryEntry = await Message.findOne({ category: categoryId }); // Use categoryId for the query
        if (!categoryEntry) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Extract questions from the category
        const questions = categoryEntry.messages.map((message) => ({
            _id: message._id,
            senderId: message.senderId,
            text: message.text,
            file: message.file, // Correct key for file
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
        const { categoryId } = req.params;
        const { questionId } = req.body;
        console.log("categoryId:", categoryId);
        console.log("questionId:", questionId);

        const categoryEntry = await Message.findOne({ category: categoryId });
        console.log(categoryEntry)
        if (!categoryEntry) {
            console.log("hii")
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
