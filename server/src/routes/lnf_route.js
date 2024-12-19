import express from "express";
import {
    getPlacesList,
    addPlace,
    removePlace,
    sendLostMessage,
    sendFoundMessage,
    deleteLostMessage,
    deleteFoundMessage,
    getLostMessage,
    getFoundMessage,
} from "../controllers/lnf_controller.js";

const router = express.Router();

router.get("/places", getPlacesList);
router.post("/places/add", addPlace);
router.delete("/places/:placeId/remove", removePlace);
router.post("/places/:placeId/messages/lost", sendLostMessage);
router.post("/places/:placeId/messages/found", sendFoundMessage);
router.delete("/places/:placeId/messages/lost/:messageId", deleteLostMessage);
router.delete("/places/:placeId/messages/found/:messageId", deleteFoundMessage);
router.get("/places/:placeId/messages/lost", getLostMessage);
router.get("/places/:placeId/messages/found", getFoundMessage);

export default router;
