import axios from 'axios';
import { useEffect, useState } from 'react';
import {Card, CardHeader, CardBody, CardFooter, Divider, Textarea, Input, Skeleton, Avatar,Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Link } from "@nextui-org/react";
import { useUser } from './UserContext';
import { Forum } from '@/types/types';

export default function ForumList(props: { upvotes: number; downvotes: number; payload: any}) {
    const { upvotes, downvotes, payload } = props;
    const { username, userId } = useUser();
    
    const postVote = async (type: string) => {
        try {
            const response = await axios.post('https://pi45ah2e94.execute-api.us-west-1.amazonaws.com/discussion_forum/vote', {...payload, type}, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }catch(e) {
            console.error(e)
          }
    }
    return (
        <>
        <div className="flex items-center gap-2 mt-1">
            <Button
            onPress={()=>postVote('upvote')}
            isIconOnly
            variant="light"
            className="text-green-500 hover:text-green-700"
            aria-label="Upvote"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            </Button>

            <p className="text-md font-medium">{upvotes}</p>

            <Button
            onPress={()=>postVote('downvote')}
            isIconOnly
            variant="light"
            className="text-red-500 hover:text-red-700"
            aria-label="Downvote"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            </Button>
            <p className="text-md font-medium">{downvotes}</p>
        </div>
        </>
    );
}
