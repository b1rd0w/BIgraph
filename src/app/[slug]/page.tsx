import prisma from "@/libs/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PostLayout from "./PostLayout";

type SlugParams = { params: { slug: string } }

function clearHtml(html: string) {
	const cheerio = require('cheerio');
	const $ = cheerio.load(html);
	return $.text();
}

export const getPost = cache(async (slug: string) => {
	const post = await prisma.post.findUnique({
		where: { slug }
	})
	return post ? post : null
})

export async function generateMetadata({ params: { slug } }: SlugParams): Promise<Metadata> {
	const post = await getPost(slug);
	const description = clearHtml(post?.content || "");
	return {
		title: `${post?.title} - BIgraph`,
		openGraph: {
			title: `${post?.title} - BIgraph`,
			description,
		},
		twitter: {
			title: `${post?.title} - BIgraph`,
			description,
		},
	}
}

export default async function PostEditPage({ params: { slug } }: SlugParams) {
	const post = await getPost(slug);
	if (!post) return notFound();
	return <PostLayout post={post} />
}