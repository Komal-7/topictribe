import Poll from "../components/Poll";  // Import Poll component

const PostPage = ({ postId }) => {
    const [post, setPost] = useState(null);

    useEffect(() => {
        // Fetch post from API and set state
        fetchPost(postId).then(data => setPost(data));
    }, [postId]);

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.poll && <Poll poll={post.poll} />}
        </div>
    );
};
