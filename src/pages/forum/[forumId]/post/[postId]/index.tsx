import { useRouter } from 'next/router';
// import { useState } from 'react';
import RichEditor from '../../../../../components/RichEditor';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';
import { useEffect, useState } from 'react';
import { Post } from '@/types/types';
import axios from 'axios';
import { convertFromRaw, RawDraftContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Skeleton } from '@nextui-org/react';
import Votes from '@/components/Votes';

export default function TopicPage() {
  const router = useRouter();
  const { forumId, postId } = router.query;
  const { username, userId } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState<Post>()
  const [comments, setComments] = useState<Post[]>([]);

  const fetchCurrentPost = async () => {
    try {
      const forumIdReq = (forumId as string)?.replace('#','%23')
      const postIdReq = (postId as string)?.replace('#','%23')
      const postResponse = await axios.get(`https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/get_posts?forum_id=${forumIdReq}&post_id=${postIdReq}&user_id=${userId}`);
      setCurrentPost(postResponse.data);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }
  const fetchComments = async () => {
    try {
      const forumIdReq = (forumId as string)?.replace('#','%23')
      const postIdReq = (postId as string)?.replace('#','%23')
      const result = await axios.get(`https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/get_posts?forum_id=${forumIdReq}&&parent_post_id=${postIdReq}&user_id=${userId}`);
      setComments(result.data);
      
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if(postId && userId)
      fetchCurrentPost();
      fetchComments();
  }, [postId, userId]);

  const handleEditorSubmit = async (content: RawDraftContentState ) => {
    try {
      const payload = {
        user_id : userId,
        user_name :username,
        content : JSON.stringify(content),
        forum_id : forumId,
        parent_post_id: postId
      }
      await axios.post('https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/create_post', payload, {
        headers: {
        'Content-Type': 'application/json'
        }
      });
      fetchComments();
    }catch(e) {
      console.error(e)
    }
  };

  const getHtml = (savedContent: string) => {
    if(savedContent){
      const rawContent = JSON.parse(savedContent);
      const contentState = convertFromRaw(rawContent);
      const htmlContent = stateToHTML(contentState);
      return htmlContent;
    }
    return <></>
  }

  return (
    <div className="px-20 py-2 flex flex-col min-h-[calc(100vh-65px)]">
    <Link href={`/forum/${(forumId as string)?.replace('#','%23')}`} className='text-blue-500 underline hover:text-blue-700 mb-2'>
      Back to Discussions
    </Link>
    {isLoading ? (
      <>
        <Card className="space-y-5 p-4" radius="lg">
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
        </Card>
      </>
    ) : (
      <>
        <Card className="mb-5" key={currentPost?.post_id}>
            <CardHeader className="flex justify-between items-center">
              <div className="flex gap-3 items-center flex-grow">
                <Avatar showFallback src="https://images.unsplash.com/broken" />
                <div className="flex flex-col">
                  <p className="text-md">{currentPost?.user_name}</p>
                  <p className="text-small text-default-500">{currentPost?.created_at}</p>
                </div>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div dangerouslySetInnerHTML={{ __html: getHtml(currentPost?.content || '') }} />
            </CardBody>
            <Divider/>
            <CardFooter className="flex justify-between items-center">
              <Votes uservote={currentPost?.user_vote || null} upvotes={currentPost?.upvotes || 0} downvotes={currentPost?.downvotes || 0} voted={fetchCurrentPost} payload={{forum_id:forumId,user_id:userId,post_id:currentPost?.post_id}}/>
            </CardFooter>
          </Card>
      
        <RichEditor onSubmit={handleEditorSubmit} confirmLabel={'Comment'}/>
        <div className="flex-grow flex flex-col px-10">
          {
            comments.map((comment) => (
              <Card className="mt-5" key={comment.post_id}>
                <CardHeader className="flex justify-between items-center">
                  <div className="flex gap-3 items-center flex-grow">
                    <Avatar showFallback src="https://images.unsplash.com/broken" />
                    <div className="flex flex-col">
                      <p className="text-md">{comment.user_name}</p>
                      <p className="text-small text-default-500">{comment.created_at}</p>
                    </div>
                  </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                  <div dangerouslySetInnerHTML={{ __html: getHtml(comment.content) }} />
                </CardBody>
                <Divider/>
                <CardFooter className="flex justify-between items-center">
                  <Votes uservote={comment.user_vote} upvotes={comment.upvotes} downvotes={comment.downvotes} voted={fetchComments} payload={{forum_id:forumId,user_id:userId,post_id:comment.post_id}}/>
                </CardFooter>
              </Card>
            ))
          }
        </div>
      </>
    )}
  </div>
  );
}
