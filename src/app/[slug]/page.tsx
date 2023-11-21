import prisma from "@/libs/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PostLayout from "./PostLayout";

type SlugParams = { params: { slug: string } }

export const getPost = cache(async (slug: string) => {
	const post = await prisma.post.findUnique({
		where: { slug }
	})
	return post ? post : null
})

export async function generateMetadata({ params: { slug } }: SlugParams): Promise<Metadata> {
	const post = await getPost(slug);
	return {
		title: `${post?.title} - BIgraph`,
		openGraph: {
			title: `${post?.title} - BIgraph`,
			description: post?.content.replace(/<[^>]+>/g, ''),
		},
	}
}

export default async function PostEditPage({ params: { slug } }: SlugParams) {
	const post = await getPost(slug);
	if (!post) return notFound();
	return <PostLayout post={post} />
}