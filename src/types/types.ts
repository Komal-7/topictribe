import { RawDraftContentState } from "draft-js";

export type Forum = {
    forum_id?: string;
    forum_name: string;
    description: string;
    created_by_user_id: string | null;
    created_by_user: string | null;
    created_at?: string | null;
};

export interface RichEditorProps {
    onSubmit: (editorState: RawDraftContentState ) => void;
    confirmLabel: string;
}

export type Post = {
    content: string;
    downvotes: number;
    upvotes: number;
    post_id: string;
    user_name: string;
    created_at: string;
    user_vote: string | null;
}

export type VotesPayload = {
    forum_id: string;
    user_id: string | null;
    post_id: string;
}