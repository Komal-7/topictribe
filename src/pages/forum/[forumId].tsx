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
  const [newDiscussion, setNewDiscussion] = useState<any>({
    user_id : '',
    user_name :'',
    content : '',
    forum_id : ''
  });
  
  useEffect(()=>{
    setNewDiscussion({
      ...newDiscussion,
      user_id: userId,
      user_name: username
    })
  },[username,userId])

  const fetchTopics = async () => {
    try {
      setNewDiscussion({
        ...newDiscussion,
        forum_id : forumId
      })
      const forumIdReq = (forumId as string)?.replace('#','%23')
      setIsLoading(true);
      const forumResponse = await axios.get(`https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/get_forums?forum_id=${forumIdReq}`);
      setCurrentForum(forumResponse.data?.forum);
      const result = await axios.get(`https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/get_posts?forum_id=${forumIdReq}`);
      setTopics(result.data);
      console.log(result.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  useEffect(() => {
    if(forumId)
    fetchTopics();
  }, [forumId]);

  const handleEditorSubmit = (content: RawDraftContentState ) => {
    setNewDiscussion({
      ...newDiscussion,
      content: JSON.stringify(content)
    })
    postDiscusion();
  };

  const postDiscusion = async () => {
    try {
      const response = await axios.post('https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/create_post', newDiscussion, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const postId = response.data?.post_id?.replace('#','%23')
      router.push(`/topic/${postId}`)
    }catch(e) {
      console.error(e)
    }
  }

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

            <div className="flex-grow flex flex-col">
              {topics.length ? (
                topics.map((topic) => (
                  <Card className="" key={topic.post_id}>
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
                        <Votes upvotes={topic.upvotes} downvotes={topic.downvotes} payload={{forum_id:forumId,user_id:userId,post_id:topic.post_id}}/>
                      </div>
                      <div className="flex flex-col items-end">
                        <Link href={"/topic/"+(topic.post_id)?.replace('#','%23')} showAnchorIcon className='text-blue-500 underline hover:text-blue-700'>
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

            <div className="flex-none mx-auto">
              <RichEditor onSubmit={handleEditorSubmit} />
            </div>
          </div>
        </div>
      )}
    </div>
  )  
}