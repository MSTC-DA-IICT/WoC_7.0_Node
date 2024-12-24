import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore.js";

export const useQnAStore = create((set, get) => ({
    categories: [],
    questions: [],
    answers: [],
    isLoading: false,
    what : "",
    setWhat: (value) => set({ what: value }),
    setCategories: (value) => set({ categories: value }),
    setQuestions: (value) => set({ questions: value }),
    setAnswers: (value) => set({ answers: value }),
    setIsLoading: (value) => set({ isLoading: value }),


    // Fetch the list of categories
    getCategories: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/qna/categories");
            set({ categories: res.data });
            set({what : "category"})
        } catch (error) {
            toast.error("Failed to fetch categories.");
        } finally {
            set({ isLoading: false });
        }
    },

    // Add a new category
    addCategory: async (category) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/qna/categories/add", { category });
            set((state) => ({
                categories: [...state.categories, res.data.category],
            }));
            toast.success("Category added successfully.");
        } catch (error) {
            toast.error("Failed to add category.");
        } finally {
            set({ isLoading: false });
        }
    },

    // Remove a category
    removeCategory: async (category) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/qna/categories/${category}/remove`);
            set((state) => ({
                categories: state.categories.filter((cat) => cat !== category),
            }));
            toast.success("Category removed successfully.");
        } catch (error) {
            toast.error("Failed to remove category.");
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch questions for a specific category
    getQuestions: async (category) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/qna/categories/${category}/questions`);
            set({ questions: res.data });
            console.log(res.data)
            console.log("Updated questions:", get().questions);
        } catch (error) {
            toast.error("Failed to fetch questions.");
        } finally {
            set({ isLoading: false });
        }
    },

    // Fetch answers for a specific question
    getAnswers: async (category, questionId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/qna/categories/${category}/answers`, {
                questionId,
            });
            set({ answers: res.data });
            console.log("data")
            console.log(res.data)
        } catch (error) {
            toast.error("Failed to fetch answers.");
        } finally {
            set({ isLoading: false });
        }
    },

    // Send a new question
    sendQuestion: async (category, questionData) => {
        try {
            console.log("IT's a qdata")
            console.log(questionData.text)
            console.log(questionData.image)
            const res = await axiosInstance.post(
                `/qna/categories/${category}/questions`,
                questionData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            set((state) => ({
                questions: [...state.questions, res.data],
            }));
            toast.success("Question sent successfully.");
        } catch (error) {
            toast.error("Failed to send question.");
        }
    },

    // Send a new answer
    sendAnswer: async (category, answerData) => {
        try {
            const res = await axiosInstance.post(
                `/qna/categories/${category}/answers`,
                answerData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            set((state) => ({
                answers: [...state.answers, res.data],
            }));
            toast.success("Answer sent successfully.");
        } catch (error) {
            toast.error("Failed to send answer.");
        }
    },

    // Connect socket for real-time updates
    connectSocket: () => {
        const { socket } = useAuthStore.getState(); // Access shared socket instance from Auth store
        if (!socket) return;

        // Listen for real-time updates for QnA
        socket.on("newQuestion", (data) => {
            set((state) => ({
                questions: [...state.questions, data],
            }));
        });

        socket.on("newAnswer", ({ questionId, newAnswer }) => {
            set((state) => {
                const updatedQuestions = state.questions.map((question) =>
                    question._id === questionId
                        ? { ...question, answers: [...question.answers, newAnswer] }
                        : question
                );
                return { questions: updatedQuestions };
            });
        });
    },
}));
