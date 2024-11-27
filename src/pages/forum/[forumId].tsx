import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Avatar, Button, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from "@nextui-org/react";
import NextLink from 'next/link'; // Import NextLink for the Link component

export default function TopicTribe() {
  const [posts, setPosts] = useState([
    {
      post_id: 1,
      forum_id: 1,
      parent_post_id: null,
      user_id: 1,
      content: "This is a sample topic for discussion. Feel free to share your thoughts.",
      created_at: "2024-11-25 08:30:00",
      upvotes: 15,
      downvotes: 3,
      username: "John Doe",
    },
    {
      post_id: 2,
      forum_id: 1,
      parent_post_id: null,
      user_id: 2,
      content: "Here's another interesting topic. Let's dive deep into this subject.",
      created_at: "2024-11-24 14:00:00",
      upvotes: 20,
      downvotes: 5,
      username: "Jane Doe",
    },
    {
      post_id: 3,
      forum_id: 1,
      parent_post_id: null,
      user_id: 3,
      content: "I'm curious about your opinions on this particular issue. Let me know!",
      created_at: "2024-11-23 11:45:00",
      upvotes: 10,
      downvotes: 1,
      username: "Alice Smith",
    },
  ]);
  const [isOpen, setIsOpen] = useState(false); // Modal visibility state
  const [forumData, setForumData] = useState({
    name: "",
    description: "",
  });

  const handleUpvote = (postId) => {
    console.log(`Upvoted post: ${postId}`);
  };

  const handleDownvote = (postId) => {
    console.log(`Downvoted post: ${postId}`);
  };

  const handleSubmit = () => {
    console.log("Forum Data:", forumData);
    setForumData({ name: "", description: "" }); // Reset the form after submission
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "#333",
        backgroundColor: "#fff",
        maxWidth: "900px", // Increased max width for more space
        margin: "auto",
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: "26px", // Increased font size for title
          marginBottom: "15px",
          color: "#333",
          fontWeight: "600",
        }}
      >
        Topics in Forum
      </h2>

      {/* Button to open the "Create Forum" modal */}
      <Button
        auto
        color="primary"
        onPress={() => setIsOpen(true)}
        style={{ marginBottom: "20px" }}
      >
        Create Post
      </Button>

      {/* Grid Layout for the Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // Two columns for larger screens
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {posts.map((post) => (
          <Card
            key={post.post_id}
            variant="bordered"
            style={{
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <CardHeader style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                showFallback
                src="https://images.unsplash.com/broken"
                size="sm"
                style={{ marginRight: "10px" }}
              />
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "16px", // Increased font size for username
                    fontWeight: "500",
                    color: "#444",
                  }}
                >
                  {post.username}
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: "#777",
                    fontSize: "14px", // Increased font size for post details
                  }}
                >
                  Post ID: {post.post_id} | Created At: {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody style={{ padding: "8px 0" }}>
              <p
                style={{
                  fontSize: "15px", // Increased font size for post content
                  color: "#555",
                  fontWeight: "bold", // Bold content
                }}
              >
                {post.content}
              </p>
            </CardBody>
            <Divider />
            <CardFooter
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "8px",
              }}
            >
              <div>
                <Button
                  size="xs"
                  auto
                  style={{ marginRight: "8px", fontSize: "14px" }} // Increased font size for buttons
                  onClick={() => handleUpvote(post.post_id)}
                >
                  ↑ {post.upvotes}
                </Button>
                <Button
                  size="xs"
                  auto
                  style={{ fontSize: "14px" }} // Increased font size for buttons
                  onClick={() => handleDownvote(post.post_id)}
                >
                  ↓ {post.downvotes}
                </Button>
              </div>

              {/* Wrap the View Topic Button with NextLink */}
              <NextLink href={"/topic/"+post.post_id} passHref>
                <Button
                  size="xs"
                  color="primary"
                  style={{ fontSize: "14px" }}
                >
                  View Topic
                </Button>
              </NextLink>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Back Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link href="/home">
          <Button auto color="primary" size="sm" style={{ fontSize: "14px" }}>
            Back to Homepage
          </Button>
        </Link>
      </div>

      {/* Create Forum Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Post</ModalHeader>
              <ModalBody>
                <Textarea
                  label="Description"
                  variant="bordered"
                  labelPlacement="outside"
                  value={forumData.description}
                  onValueChange={(value) => setForumData({ ...forumData, description: value })}
                  placeholder="Enter the Topic description"
                  defaultValue=""
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleSubmit();
                    onClose();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
