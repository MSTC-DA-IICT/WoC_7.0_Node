import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    nameTomail_map: [
      {
        name: {
          type: String, // Course name or identifier
          required: true,
        },
        mailId: {
          type: String, // File path, URL, or identifier
          required: true,
        },
      },
    ],
  }
);

export default mongoose.model("Imp_mails", mailSchema);
