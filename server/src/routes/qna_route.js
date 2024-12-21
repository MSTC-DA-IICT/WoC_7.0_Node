import express from "express";
import {
    getQnAPerCategory,
    getCategoryList,
    addCategory,
    removeCategory,
    sendQuestion,
    sendAnswer,
    getAnswers,
    getQuestions
} from "../controllers/qna_controller.js"; 

const router = express.Router();

// Routes for categories
router.get("/categories", getCategoryList); // Fetch all categories
router.post("/categories/add", addCategory); // Add a new category
router.delete("/categories/:category/remove", removeCategory); // Remove a category

// Routes for Q&A within a category
router.post("/categories/:category/questions", sendQuestion); // Post a question
router.post("/categories/:category/answers", sendAnswer); // Post an answer

router.get("/categories/:categoryId/questions", getQuestions);
router.get("/categories/:categoryId/answers", getAnswers);


export default router;
