import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Forum, Post } from '@/types/types';
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Skeleton } from '@nextui-org/react';
import RichEditor from '@/components/RichEditor';
import { EditorState, RawDraftContentState, convertFromRaw, convertToRaw } from 'draft-js';
import { useUser } from '@/components/UserContext';
import { stateToHTML } from 'draft-js-export-html';
import Votes from '@/components/Votes';

export default function ForumPage() {
  const router = useRouter();
  const { forumId } = router.query;
  const { username, userId } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [currentForum, setCurrentForum] = useState<Forum>()
  const [topics, setTopics] = useState<Post[]>([]);

  const fetchCurrentForum = async () => {
    try {
      const forumIdReq = (forumId as string)?.replace('#','%23')
      setIsLoading(true);
      const forumResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}get_forums?forum_id=${forumIdReq}`);
      setCurrentForum(forumResponse.data?.forum);
      fetchTopics();
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  }
  const fetchTopics = async () => {
    try {
      const forumIdReq = (forumId as string)?.replace('#','%23')
      const result = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}get_posts?forum_id=${forumIdReq}&user_id=${userId}`);
      setTopics(result.data);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    if(forumId && userId)
      fetchCurrentForum();
  }, [forumId, userId]);

  const handleEditorSubmit = async (content: RawDraftContentState ) => {
    try {
      const payload = {
        user_id : userId,
        user_name :username,
        content : JSON.stringify(content),
        forum_id : forumId
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}create_post`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const postId = response.data?.post_id?.replace('#','%23')
      router.push(`/forum/${(forumId as string)?.replace('#','%23')}/post/${postId}`)
    }catch(e) {
      console.error(e)
    }
  };

  const getHtml = (savedContent: string) => {
    const rawContent = JSON.parse(savedContent);
    const contentState = convertFromRaw(rawContent);
    const htmlContent = stateToHTML(contentState);
    return htmlContent;
  }
  return (
    <div className="px-20 py-2 flex flex-col min-h-[calc(100vh-65px)]">
      {isLoading ? (
        <>
          <div className="pb-10 flex flex-col items-center justify-center">
            <Skeleton className="w-[500px] rounded-lg text-center">
              <div className="h-8 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="mt-2 w-[500px] rounded-lg text-center">
              <div className="h-8 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
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
        <div className="flex flex-col flex-grow">
          <div className="pb-10 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-center">
              {currentForum?.forum_name}
            </div>
            <div className="mt-2 text-lg text-center">
              {currentForum?.description}
            </div>
          </div>


          <div className="flex flex-col flex-grow">
            <RichEditor onSubmit={handleEditorSubmit} confirmLabel={'Start Discussion'}/>
            <div className="flex-grow flex flex-col">
              {topics.length ? (
                topics.map((topic) => (
                  <Card className="mt-5" key={topic.post_id}>
                    <CardHeader className="flex justify-between items-center">
                      <div className="flex gap-3 items-center flex-grow">
                        <Avatar showFallback src="https://images.unsplash.com/broken" />
                        <div className="flex flex-col">
                          <p className="text-md">{topic.user_name}</p>
                          <p className="text-small text-default-500">{topic.created_at}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                      <div dangerouslySetInnerHTML={{ __html: getHtml(topic.content) }} />
                    </CardBody>
                    <Divider/>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex gap-3 items-center flex-grow">
                        <Votes uservote={topic.user_vote} upvotes={topic.upvotes} downvotes={topic.downvotes} voted={fetchTopics} payload={{forum_id:forumId,user_id:userId,post_id:topic.post_id}}/>
                      </div>
                      <div className="flex flex-col items-end">
                        <Link href={`/forum/${(forumId as string)?.replace('#','%23')}/post/${(topic.post_id)?.replace('#','%23')}`} showAnchorIcon className='text-blue-500 underline hover:text-blue-700'>
                          Explore the Discussion 
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div>No Discussions Yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )  
}