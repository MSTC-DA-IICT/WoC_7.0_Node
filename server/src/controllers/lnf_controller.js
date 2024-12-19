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
        await LnF.findByIdAndDelete(placeId);
        res.status(200).json({ message: "Place deleted successfully" });
    } catch (err) {
        console.error("Error in removePlace: ", err.message);
        res.status(500).json({ error: "Failed to remove place" });
    }
};

export const sendLostMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { place } = req.params;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const lnfEntry = await LnF.findOne({ place });
        if (!lnfEntry) {
            const newLnF = new LnF({
                place,
                messages: [{ senderId, text, image: imageUrl, type: "lost" }],
            });
            await newLnF.save();
            io.emit("newLostMessage", newLnF);
            return res.status(201).json(newLnF);
        }

        lnfEntry.messages.push({ senderId, text, image: imageUrl, type: "lost" });
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
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { place } = req.params;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const lnfEntry = await LnF.findOne({ place });
        if (!lnfEntry) {
            return res.status(404).json({ message: "Place not found" });
        }

        lnfEntry.messages.push({ senderId, text, image: imageUrl, type: "found" });
        await lnfEntry.save();

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

        const place = await LnF.findById(placeId);
        if (!place) return res.status(404).json({ error: "Place not found" });

        const message = place.messages.id(messageId);
        if (!message || message.type !== "lost")
            return res.status(404).json({ error: "Lost message not found" });

        message.remove();
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

        const place = await LnF.findById(placeId);
        if (!place) return res.status(404).json({ error: "Place not found" });

        const message = place.messages.id(messageId);
        if (!message || message.type !== "found")
            return res.status(404).json({ error: "Found message not found" });

        message.remove();
        await place.save();

        res.status(200).json({ message: "Found message deleted successfully" });
    } catch (err) {
        console.error("Error in deleteFoundMessage: ", err.message);
        res.status(500).json({ error: "Failed to delete found message" });
    }
};

export const getLostMessage = async (req, res) => {
    try {
        const { placeId } = req.params;

        const place = await LnF.findById(placeId);
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

        const place = await LnF.findById(placeId);
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
