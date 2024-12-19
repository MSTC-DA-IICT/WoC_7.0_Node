import express from "express";
import {
  addCategory,
  removeCategory,
  addEmail,
  removeEmail,
  getCategories,
  getEmails,
} from "../controllers/email_controller.js"; 

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:categoryId/emails", getEmails);
router.post("/categories/add", addCategory);
router.delete("/categories/:categoryId/remove", removeCategory);
router.post("/categories/:categoryId/emails/add", addEmail);
router.delete("/categories/:categoryId/emails/:emailId/remove", removeEmail);

export default router;
