// POST: Create a new post with poll
app.post("/posts", (req, res) => {
    const { title, content, poll } = req.body;
    const newPost = { title, content, poll };
    posts.push(newPost);  // In actual implementation, save to DB
    res.status(201).send(newPost);
});

// POST: Vote on a poll
app.post("/posts/:postId/vote", (req, res) => {
    const { postId } = req.params;
    const { optionIndex } = req.body;

    const post = posts.find(post => post.postId === postId);
    if (!post || !post.poll) {
        return res.status(404).send("Poll not found");
    }

    post.poll.options[optionIndex].votes += 1; // Update votes
    res.send(post);
});
