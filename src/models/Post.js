const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    question: String,
    options: [
        {
            text: String,
            votes: { type: Number, default: 0 },
        },
    ],
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    poll: pollSchema,  // New field to store poll data
});

module.exports = mongoose.model("Post", postSchema);
