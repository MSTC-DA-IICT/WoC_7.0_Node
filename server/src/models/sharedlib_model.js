import mongoose from "mongoose";

const acadSchema = new mongoose.Schema(
  {
    category: 
    { 
      type: String, 
      required: true 
    },
    courses: [
      {
        name: 
        { 
          type: String,
          required: true 
        },
        files: [
          {
            name: 
            { 
              type: String, 
              required: true 
            },
            url: 
            { 
              type: String, 
              required: true 
            },

            public_id : {
              type: String, 
              required: true
            }
          },
        ],
      },
    ],
  }
);

export default mongoose.model("Academic", acadSchema);
