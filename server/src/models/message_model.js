import mongoose from "mongoose";

const qnaSchema = new mongoose.Schema(
    {
        messages: [
            {
                senderId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                text: {
                    type: String,
                },
                image: {
                    type: String,
                },
                type: {
                    type: String, // "question" or "answer"
                    required: true,
                },
            },
        ],
        category: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", qnaSchema);

export default Message;
