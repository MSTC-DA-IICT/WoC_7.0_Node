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

const Academic = mongoose.model("Academic", acadSchema);

export default Academic;

