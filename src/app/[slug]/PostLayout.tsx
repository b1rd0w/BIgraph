"use client";
import Loading from "@/app/loading";
import PostComponent from "@/components/post";
import { useAuth } from "@/hooks/authProvider";
import { viewPost } from "@/libs/post";
import { Post, User } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Forbidden from "../../components/forbidden";

export default function PostLayout({ post }: { post: Post }) {
	const [newPost, setPost] = useState(post);
	const user = useAuth();
	useEffect(() => {
		viewPost(post.slug)
			.then((res) => setPost(res?.data.post))
			.catch((error) => toast.error(error))
	}, [post])

	if (!user || !newPost) return <Loading />
	if (!userIsAllowedToView(user, newPost)) return <Forbidden />
	return <PostComponent post={newPost} user={user} />
}

function userIsAllowedToView(user: User | undefined, post: Post | undefined) {
	if (user && post && !post.published) {
		return user.role === 'ADMIN' || post.authorId === user.id
	}
	return true
}