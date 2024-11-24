import { useState } from 'react';
import { Input, Card, Button, Avatar } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Dummy Topics Data
const topics = [
  { id: 1, title: 'Topic 1', forumId: 1 },
  { id: 2, title: 'Topic 2', forumId: 1 },
  { id: 3, title: 'Topic 3', forumId: 2 },
];

// Sample Post Data
const samplePost = {
  id: 1,
  author: 'John Doe',
  text: 'This is a sample post in the discussion forum. What are your thoughts on the topic?',
  upvotes: 10,
  downvotes: 2,
  replies: [
    { id: 1, author: 'Jane Doe', text: 'I agree with the points mentioned here!' },
    { id: 2, author: 'Alice Smith', text: 'This is a very interesting discussion.' },
  ],
};

// Post Component (UI Only)
const Post = ({ post, handleUpvote, handleDownvote, handleReply, replyInputState, setReplyInputState }) => {
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
              onClick={() => handleReply(post.id)}
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
  const router = useRouter();
  const { forumId } = router.query;
  const forumTopics = topics.filter(topic => topic.forumId === Number(forumId));

  const handleUpvote = (postId) => {
    // Logic for upvoting a post
    console.log(`Upvoted post: ${postId}`);
  };

  const handleDownvote = (postId) => {
    // Logic for downvoting a post
    console.log(`Downvoted post: ${postId}`);
  };

  const handleReply = (postId) => {
    // Logic for showing the reply input
    console.log(`Replying to post: ${postId}`);
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
        Topics in Forum {forumId}
      </h2>

      {/* List of Topics */}
      <div style={{ marginBottom: '30px' }}>
        {forumTopics.length > 0 ? (
          forumTopics.map(topic => (
            <Card key={topic.id} variant="bordered" style={{ marginBottom: '12px' }}>
              <Link href={`/forum/${forumId}/topic/${topic.id}`}>
                <a style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '500' }}>{topic.title}</h3>
                </a>
              </Link>
            </Card>
          ))
        ) : (
          <p>No topics available in this forum.</p>
        )}
      </div>

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

      {/* Sample Post Display */}
      <Post
        post={samplePost}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
        handleReply={handleReply}
        replyInputState={1} // showing the reply input for this post
        setReplyInputState={() => {}}
      />

      {/* Back Button */}
<div style={{ marginTop: '20px', textAlign: 'center' }}>
  <Link href="/home">
    <Button auto color="primary" size="sm">
      Back to Homepage
    </Button>
  </Link>
</div>
    </div>
  );
}
