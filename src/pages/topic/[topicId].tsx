import { useState } from 'react';
import { Input, Card, Button, Avatar } from '@nextui-org/react';
import Link from 'next/link';

// Post Component (UI Only)
const Post = ({ post, handleUpvote, handleDownvote, handleReply, replyInputState, setReplyInputState, handleReplySubmit }) => {
  const [replyText, setReplyText] = useState('');

  return (
    <Card
      variant="bordered"
      style={{
        marginBottom: '12px',
        padding: '15px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e1e1e1',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Avatar color="primary" text={post.author[0]} size="sm" />
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '16px' }}>{post.author}</strong>
          <p style={{ fontSize: '14px', marginTop: '6px', color: '#333' }}>{post.text}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px', color: '#0070f3', fontSize: '14px' }}>
        <span
          onClick={() => handleUpvote(post.id)}
          style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          ↑
        </span>
        <span>{post.upvotes}</span>
        <span
          onClick={() => handleDownvote(post.id)}
          style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          ↓
        </span>
        <span
          onClick={() => handleReply(post.id)}
          style={{ cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#0070f3' }}
        >
          Reply
        </span>
      </div>

      {/* Reply Section */}
      <div style={{ marginTop: '15px' }}>
        {post.replies.map((reply) => (
          <Card
            key={reply.id}
            variant="flat"
            style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f7f7f7' }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <Avatar color="secondary" text={reply.author[0]} size="sm" />
              <div>
                <strong>{reply.author}</strong>
                <p>{reply.text}</p>
              </div>
            </div>
          </Card>
        ))}

        {/* Input for Replying to a comment */}
        {replyInputState === post.id && (
          <div style={{ marginTop: '10px' }}>
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              fullWidth
              bordered
              clearable
              size="sm"
            />
            <Button
              onClick={() => handleReplySubmit(post.id, replyText)}
              size="sm"
              color="primary"
              style={{
                marginTop: '8px',
                height: '36px',
                padding: '0 15px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Post Reply
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Main UI Code (TopicTribe)
export default function TopicTribe() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      text: 'This is a post on the topic!',
      upvotes: 10,
      downvotes: 2,
      replies: [
        { id: 1, author: 'Jane Smith', text: 'Great post, thanks for sharing!' },
      ],
    },
    {
      id: 2,
      author: 'Alice Brown',
      text: 'This is another post with some thoughts.',
      upvotes: 5,
      downvotes: 1,
      replies: [],
    },
  ]);
  const [replyInputState, setReplyInputState] = useState(null);

  // Handle Upvote
  const handleUpvote = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post));
  };

  // Handle Downvote
  const handleDownvote = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post));
  };

  // Handle Reply
  const handleReply = (postId) => {
    setReplyInputState(postId); // Toggle the reply input state
  };

  // Submit Reply
  const handleReplySubmit = (postId, replyText) => {
    if (!replyText) return;

    const newReply = { id: Date.now(), author: 'You', text: replyText };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, replies: [...post.replies, newReply] };
      }
      return post;
    }));

    setReplyInputState(null); // Close the reply input after submission
  };

  return (
    <div style={{
      padding: '20px',
      color: '#333',
      backgroundColor: '#fff',
      maxWidth: '800px',
      margin: 'auto',
      fontFamily: 'Noto Sans, sans-serif',
    }}>
      <h2 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600',
      }}>
        Discussion Panel
      </h2>

      {/* New Post Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '12px' }}>Create a New Post</h3>

        <div style={{ marginBottom: '18px' }}>
          <Input
            placeholder="Post Title"
            fullWidth
            bordered
            clearable
            size="lg"
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <Input
            placeholder="Post Text"
            fullWidth
            bordered
            clearable
            size="lg"
            multiline
          />
        </div>

        <Button
          size="sm"
          color="primary"
          style={{
            marginTop: '10px',
            height: '36px',
            padding: '0 15px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Create Post
        </Button>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
          handleReply={handleReply}
          replyInputState={replyInputState}
          setReplyInputState={setReplyInputState}
          handleReplySubmit={handleReplySubmit}
        />
      ))}

      {/* Back Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/home">
          <Button auto color="secondary" size="sm">
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
