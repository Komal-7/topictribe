import axios from 'axios';
import { useEffect, useState } from 'react';
import {Card, CardHeader, CardBody, CardFooter, Divider, Textarea, Input, Skeleton, Avatar,Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Link } from "@nextui-org/react";
import { useUser } from './UserContext';


type Forum = {
    forum_id?: string;
    forum_name: string;
    description: string;
    created_by_user_id: string | null;
    created_by_user: string | null;
    created_at?: string | null;
  };
export default function ForumList() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { username, userId } = useUser();
  const [forumData, setForumData] = useState<Forum>({
    forum_name: '',
    description: '',
    created_by_user_id: '',
    created_by_user: ''
  });

  useEffect(()=>{
    setForumData({
      ...forumData,
      created_by_user_id: userId,
      created_by_user: username
    })
  },[username,userId])

  const [isLoading, setIsLoading] = useState(false)
  const [forums, setForums] = useState<Forum[]>([]);

  // Fetch forums from the API
  const fetchForums = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get('https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/get_forums');
      setForums(result.data?.forums || []);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  // Call fetchForums when component mounts
  useEffect(() => {
    fetchForums();
  }, []);
  

  const handleSubmit = async () => {
    try {
      await axios.post('https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/create_forum', forumData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchForums();
      setForumData({...forumData, forum_name: '', description: ''})
    } catch (error) { console.error(error) }
  };

  return (
    <div className='px-20 py-10'>
      {isLoading ? (
        <>
          <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <Skeleton className="rounded-lg">
              <div className="h-24 rounded-lg bg-default-300"></div>
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">  
                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </Card>
        </>
      ) : (
        <div>
          <div className='flex justify-end pb-10'><Button onPress={onOpen}>Create Forum</Button></div>
        <div className='flex flex-row flex-wrap gap-4 justify-center'>
         {forums.length > 0 && (
            forums.map((forum) => (
                <Card className="w-[400px]" key={forum.forum_id}>
                  <CardHeader className="flex gap-3">
                    <Avatar showFallback src='https://images.unsplash.com/broken' />
                    <div className="flex flex-col">
                      <p className="text-md">{forum.created_by_user}</p>
                      <p className="text-small text-default-500">{forum.created_at}</p>
                    </div>
                  </CardHeader>
                  <Divider/>
                  <CardBody>
                    <p className='font-bold'>{forum.forum_name}</p>
                    <p>
                      {forum.description}
                    </p>
                  </CardBody>
                  <Divider/>
                  <CardFooter>
                  <Link href={"/forum/"+forum.forum_id} showAnchorIcon className='text-blue-500 underline hover:text-blue-700'>
                    Explore the Forum 
                  </Link>
                  </CardFooter>
                </Card>
              ))
            )
          }
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Forum</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus 
                  label="Name"
                  labelPlacement="outside"
                  placeholder=" "
                  value={forumData.forum_name}
                  onValueChange={(value: string)=> setForumData({...forumData, forum_name: value})}
                  variant="bordered"/>
                  <Textarea
                    label="Description"
                    variant="bordered"
                    labelPlacement="outside"
                    value={forumData.description}
                    onValueChange={(value: string)=> setForumData({...forumData, description: value})}
                    placeholder=""
                    defaultValue=""
                  />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={()=>{handleSubmit();onClose()}}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        </div>
      )}
      
    </div>
  );
}
