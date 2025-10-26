import { Post } from "@/lib/api/post/post.types";

export interface PostReplyProps {
    post: Post
}

export interface ReplyTextareaProps {
    post: Post;
    onSuccess?: () => void;
}