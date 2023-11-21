"use client";
import PostComponent from "@/components/post";
import { useAuth } from "@/hooks/authProvider";

export default function PostCreatePage() {
    const user = useAuth();
    return <PostComponent user={user} />
}
