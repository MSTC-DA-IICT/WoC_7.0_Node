import mongoose from "mongoose";

const acadSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    courceTofile_map: [
      {
        course: {
          type: String, // Course name or identifier
          required: true,
        },
        files: [
          {
            url: {
              type: String, // File URL or path
              required: true,
            },
            name: {
              type: String, // File name
              required: true,
            },
          },
        ],
      },
    ],
  }
);

export default mongoose.model("Academic", acadSchema);
