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
                        image: {
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
