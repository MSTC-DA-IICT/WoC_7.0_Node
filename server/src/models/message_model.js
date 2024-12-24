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
                file: {
                    type: String,
                },

                answers: [
                    {
                        senderId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User",
                            required: true,
                        },
                        text: {
                            type: String,
                        },
                        file: {
                            type: String,
                        },
                    },
                ]
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
