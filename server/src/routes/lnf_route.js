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
    getReplies,
    sendReply,
} from "../controllers/lnf_controller.js";
import {protectRoute} from "../middleware/auth_mdw.js"
 
const router = express.Router();

router.get("/places", getPlacesList);
router.post("/places/add", addPlace);
router.delete("/places/:placeId/remove", removePlace);
router.post("/places/:place/messages/lost", protectRoute, sendLostMessage);
router.post("/places/:place/messages/found", protectRoute, sendFoundMessage);
router.delete("/places/:placeId/messages/lost/:messageId", deleteLostMessage);
router.delete("/places/:placeId/messages/found/:messageId", deleteFoundMessage);
router.get("/places/:placeId/messages/lost", getLostMessage);
router.get("/places/:placeId/messages/found", getFoundMessage);
router.post("/places/:placeId/reply",protectRoute, sendReply);
router.post("/places/:placeId/replies", getReplies);

export default router;
