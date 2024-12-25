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
        mail: {
          type: String, // File path, URL, or identifier
          required: true,
        },
      },
    ],
  }
);
 
const ImpMail = mongoose.model("ImpMail", mailSchema);

export default ImpMail;

