"use client";
import Loading from "@/app/search/loading";
import { deletePost, getPostsBySearch } from "@/libs/post";
import { Post } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { debounce } from 'throttle-debounce';
import { convertDate } from "../post";

export default function SearchComponent() {
	const [posts, setPosts] = useState([]);
	const [deleteButtonToggled, setDeleteButtonToggled] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getPostsBySearch("")
			.then((res) => setPosts(res?.data.posts))
			.catch((error) => toast.error(error))
			.finally(() => setLoading(false));
	}, [])

	const debouncedGetPostsBySearch = debounce(1000, (title: string) => {
		getPosts(title)
	});

	function getPosts(title: string) {
		getPostsBySearch(title)
			.then((res) => setPosts(res?.data.posts))
			.catch((error) => toast.error(error))
			.finally(() => setLoading(false));
	}

	function onPostDelete(event: React.SyntheticEvent, slug: string) {
		event.preventDefault();
		event.stopPropagation();
		setDeleteButtonToggled(true);
		deletePost(slug).then(() => {
			const updatedPosts = posts.filter((post: Post) => post.slug !== slug);
			setPosts(updatedPosts)
		}).catch((error) => toast.error(error))
			.finally(() => setDeleteButtonToggled(false));
	}

	if (loading) return <Loading />

	return (
		<div className="container mx-auto sm:px-10 px-4 mt-10 mb-24 w-screen sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-zinc-800 dark:text-zinc-100">
			<input className="w-full h-10 px-3 text-3xl font-bold focus:outline-none whitespace-pre-wrap break-words bg-transparent"
				type='text'
				maxLength={45}
				onChange={(e) => debouncedGetPostsBySearch(e.target.value)}
				placeholder="Search..."
			/>
			<div className="grid grid-flow-row gap-4 mt-8 w-full">
				{posts.length > 0 ? (
					posts.map((post: Post) => (
						<Link key={post.id} href={post.slug} className="group grid grid-flow-col rounded-lg shadow">
							<div className="grid grid-flow-row px-3 py-3">
								<div className="grid grid-flow-col justify-between w-full">
									<h1 className="font-bold text-2xl whitespace-pre-wrap break-words justify-start">{post.title}</h1>
									<button className={`border-2 w-fit h-fit rounded-full p-1 z-20 opacity-0 group-hover:opacity-100 ${deleteButtonToggled ? 'red-button-toggled' : 'red-button'}`} tabIndex={-1}
										disabled={deleteButtonToggled}
										onClick={(e) => onPostDelete(e, post.slug)}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
											<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
										</svg>
									</button>
								</div>
								<div className='grid grid-flow-col justify-start items-center text-zinc-500 text-sm mt-1 mb-2'>
									<p className='break-all'>
										{post.name != "" ?
											`${post.name} • ${convertDate(String(post?.updatedAt))}`
											:
											`${convertDate(String(post?.updatedAt))}`
										}
										{post.published ?
											<>
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2 inline-block relative align-sub">
													<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
													<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												</svg>{post?.views.length}
											</>
											: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2 inline-block relative align-sub">
												<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
											</svg>
										}
									</p>
								</div>
								<p className="whitespace-pre-wrap break-words line-clamp-3">
									{`${clearHtml(post.content)}`}
								</p>
							</div>
						</Link>
					))) : (
					<div className="grid grid-flow-row justify-center text-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-32 h-32 mx-auto">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
						</svg>
						<p>Post not found</p>
						<Link href="/" className="w-fit mx-auto mt-4 border-2 rounded-full px-3 py-[2px] gray-button">
							<p className='uppercase font-bold select-none'>
								Create new
							</p>
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export function clearHtml(html: string) {
	const cheerio = require('cheerio');
	const $ = cheerio.load(html);
	return $.text();
}