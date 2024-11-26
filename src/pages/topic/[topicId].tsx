import { useRouter } from 'next/router';
import RichEditor from '../../components/RichEditor';
import Link from 'next/link';

// Mock data for topics
const topics = [
  { id: 1, title: 'Topic 1', description: 'Discussion on Topic 1' },
  { id: 2, title: 'Topic 2', description: 'Discussion on Topic 2' },
  { id: 3, title: 'Topic 3', description: 'Discussion on Topic 3' },
];

export default function TopicPage() {
  const router = useRouter();
  const { topicId } = router.query;

  return (
    <div>
      <h1>Comments for Topic {topicId}</h1>
      {/* RichEditor Component */}
      <RichEditor />
      <Link href={`/forum/${topicId}`}>Back to Topics</Link>

      {/* Cards Section */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {topics.map((topic) => (
          <div
            key={topic.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              width: '250px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <Link href={`/topic/${topic.id}`}>
              <a style={{ color: '#0070f3', textDecoration: 'none' }}>View Topic</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
