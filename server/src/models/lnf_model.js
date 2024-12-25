import mongoose from "mongoose";

const lnfSchema = new mongoose.Schema(
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
                type: {
                    type: String, // "lost" or "found"
                    required: true,
                },
                replies: [
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
        place: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const LnF = mongoose.model("LnF", lnfSchema);

export default LnF;
