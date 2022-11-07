const mongoose = require("mongoose");

const { model, Schema } = mongoose;

const postModel = Schema(
  {
    title: {
      type: String,
      required: [true, "please provide post title"],
      minLength: 5,
      maxLength: 200,
      trim: true,
      unique: true,
    },
    body: {
      type: String,
      required: [true, "please provide the body of your post"],
      maxLength: 2000000,
      minLength: 200,
    },
    description: {
      type: String,
      required: true,
      maxLength: 400,
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
    },
    state: {
      type: String,
      required: [true, "please provide a post state"],
      enum: ["draft", "published"],
      default: "draft",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = model("Post", postModel);
