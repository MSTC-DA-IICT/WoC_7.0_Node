import LnF from "../models/lnf_model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

export const getPlacesList = async (req, res) => {
    try {
        const places = await LnF.find({}, { place: 1 });
        res.status(200).json(places);
    } catch (err) {
        console.error("Error in getPlacesList: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addPlace = async (req, res) => {
    try {
        const { place } = req.body;
        const newPlace = new LnF({ place, messages: [] });
        await newPlace.save();
        res.status(201).json(newPlace);
    } catch (err) {
        console.error("Error in addPlace: ", err.message);
        res.status(500).json({ error: "Failed to add place" });
    }
};

export const removePlace = async (req, res) => {
    try {
        const { placeId } = req.params;
        await LnF.deleteMany({place : placeId});
        res.status(200).json({ message: "Place deleted successfully" });
    } catch (err) {
        console.error("Error in removePlace: ", err.message);
        res.status(500).json({ error: "Failed to remove place" });
    }
};

export const sendLostMessage = async (req, res) => {
    try {
        const { text, file } = req.body;
        const { place } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }
        const senderId = req.user._id;

        let fileUrl = null;

        // If a file is provided, upload it to Cloudinary
        if (file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(`data:;base64,${file}`, {
                    resource_type: "auto", // Automatically detect the file type (e.g., file, video, PDF)
                });
                fileUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("File upload error:", uploadError.message);
                return res.status(500).json({ message: "Failed to upload file" });
            }
        } else {
            console.log("No file provided");
        }


        const lnfEntry = await LnF.findOne({ place : place });
        if (!lnfEntry) {
            const newLnF = new LnF({
                place,
                messages: [{ senderId, text, file: fileUrl, type: "lost" }],
            });
            await newLnF.save();
            io.emit("newLostMessage", newLnF);
            return res.status(201).json(newLnF);
        }

        lnfEntry.messages.push({ senderId, text, file: fileUrl, type: "lost" });
        await lnfEntry.save();

        io.emit("newLostMessage", lnfEntry);
        res.status(201).json(lnfEntry);
    } catch (error) {
        console.error("Error in sendLostMessage:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendFoundMessage = async (req, res) => {
    try {
        const { text, file } = req.body;
        const { place } = req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not authenticated" });
        }
        const senderId = req.user._id;

        let fileUrl = null;
        // console.log(file)
        // If a file is provided, upload it to Cloudinary
        if (file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(`data:;base64,${file}`, {
                    resource_type: "auto", // Automatically detect the file type (e.g., file, video, PDF)
                });
                fileUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("File upload error:", uploadError.message);
                return res.status(500).json({ message: "Failed to upload file" });
            }
        } else {
            console.log("No file provided");
        }

        console.log(place)
        const lnfEntry = await LnF.findOne({ place : place });
        if (!lnfEntry) {
            return res.status(404).json({ message: "Place not found" });
        }
        console.log("or here")
        lnfEntry.messages.push({ senderId, text, file: fileUrl, type: "found" });
        await lnfEntry.save();
        console.log("finally here")
        io.emit("newFoundMessage", lnfEntry);
        res.status(201).json(lnfEntry);
    } catch (error) {
        console.error("Error in sendFoundMessage:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteLostMessage = async (req, res) => {
    try {
        const { placeId, messageId } = req.params;

        // Find the LnF document by place
        const place = await LnF.findOne({ place: placeId });
        if (!place) {
            return res.status(404).json({ error: "Place not found" });
        }

        // Find the index of the message in the messages array
        const messageIndex = place.messages.findIndex(
            (message) => message._id.toString() === messageId && message.type === "lost"
        );

        // If the message is not found or it's not of type "lost"
        if (messageIndex === -1) {
            return res.status(404).json({ error: "Lost message not found" });
        }

        // Remove the message from the messages array
        place.messages.splice(messageIndex, 1);

        // Save the updated document
        await place.save();

        res.status(200).json({ message: "Lost message deleted successfully" });
    } catch (err) {
        console.error("Error in deleteLostMessage: ", err.message);
        res.status(500).json({ error: "Failed to delete lost message" });
    }
};


export const deleteFoundMessage = async (req, res) => {
    try {
        const { placeId, messageId } = req.params;

        // Find the LnF document by place
        const place = await LnF.findOne({ place: placeId });
        if (!place) {
            return res.status(404).json({ error: "Place not found" });
        }

        const messageIndex = place.messages.findIndex(
            (message) => message._id.toString() === messageId && message.type === "found"
        );

        if (messageIndex === -1) {
            return res.status(404).json({ error: "Lost message not found" });
        }

        place.messages.splice(messageIndex, 1);

        await place.save();

        res.status(200).json({ message: "Lost message deleted successfully" });
    } catch (err) {
        console.error("Error in deleteLostMessage: ", err.message);
        res.status(500).json({ error: "Failed to delete lost message" });
    }
};

export const getLostMessage = async (req, res) => {
    try {
        const { placeId } = req.params;

        const place = await LnF.findOne({ place: placeId });
        if (!place) return res.status(404).json({ error: "Place not found" });

        const lostMessages = place.messages.filter(
            (msg) => msg.type === "lost"
        );

        res.status(200).json(lostMessages);
    } catch (err) {
        console.error("Error in getLostMessage: ", err.message);
        res.status(500).json({ error: "Failed to fetch lost messages" });
    }
};

export const getFoundMessage = async (req, res) => {
    try {
        const { placeId } = req.params;

        const place = await LnF.findOne({ place: placeId });
        if (!place) return res.status(404).json({ error: "Place not found" });

        const foundMessages = place.messages.filter(
            (msg) => msg.type === "found"
        );

        res.status(200).json(foundMessages);
    } catch (err) {
        console.error("Error in getFoundMessage: ", err.message);
        res.status(500).json({ error: "Failed to fetch found messages" });
    }
};

export const getReplies = async (req, res) => {
    try {
        const { placeId } = req.params;
        const { msgId } = req.body;
        console.log("placeId:", placeId);
        console.log("msgId:", msgId);

        const placeEntry = await LnF.findOne({ place: placeId });
        console.log(placeEntry)
        if (!placeEntry) {
            console.log("hii")
            return res.status(404).json({ message: "Category not found" });
        }

        const msg = placeEntry.messages.id(msgId);
        if (!msg) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(msg.replies);
    } catch (error) {
        console.error("Error in getReplies:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendReply = async (req, res) => {
    try {
        const { placeId } = req.params;
        const { msgId, text, file } = req.body;

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
        const placeEntry = await LnF.findOne({ place: placeId });
        if (!placeEntry) {
            return res.status(404).json({ message: "Category not found" });
        }
        console.log("OR here")
        const msg = placeEntry.messages.id(msgId);
        if (!msg) {
            return res.status(404).json({ message: "Question not found" });
        }
        console.log("finally here")
        const newReply = { senderId, text, file: fileUrl };
        console.log("New Reply:", newReply);

        msg.replies.push(newReply);
        console.log("Reply added to msg:", msg);

        try {
            await placeEntry.save();
            console.log("Save successful");
        } catch (saveError) {
            console.error("Save Error:", saveError.message);
            return res.status(500).json({ message: "Failed to save answer" });
        }

        console.log(newReply.senderId)
        io.emit("newReply", { msgId, newReply });
        console.log("Emit successful");

        res.status(201).json(newReply);
    } catch (error) {
        console.error("Error in sendReply:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};