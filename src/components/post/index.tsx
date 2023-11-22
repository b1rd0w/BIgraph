import { changePostAccess, createPost, deletePost, editPost, isValidPost } from '@/libs/post';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const modules = {
	toolbar: {
		container: [
			[{ 'header': 1 }, { 'header': 2 }, 'blockquote'],
			['bold', 'italic', 'underline'],
			['link', 'image', 'video'],
		],
	}
}

export default function PostComponent({ ...props }) {
	const { post, user } = props;
	const isNewPost = !post;

	const [title, setTitle] = useState(isNewPost && typeof window !== "undefined" ? (window.localStorage.getItem("title") || "") : post?.title);
	const [name, setName] = useState(isNewPost && typeof window !== "undefined" ? (window.localStorage.getItem("name") || "") : post?.name);
	const [content, setContent] = useState(isNewPost && typeof window !== "undefined" ? (window.localStorage.getItem("post") || "") : post?.content);

	const [isPublic, setPublic] = useState(isNewPost ? true : post?.published);
	const [isEditing, setEdititng] = useState(isNewPost);
	const canEdit = isNewPost ? true : post?.authorId == user.id || user.role == "ADMIN";

	const [postButtonToggled, setPostButtonToggled] = useState(false);
	const [publicButtonToggled, setPublicButtonToggled] = useState(false);
	const [deleteButtonToggled, setDeleteButtonToggled] = useState(false);

	const [isPostBig, setPostBig] = useState(false);

	const { push } = useRouter();

	function handleChange(fieldName: string, event: string) {
		switch (fieldName) {
			case 'title':
				setTitle(event);
				if (isNewPost) localStorage.setItem('title', event);
				break;
			case 'name':
				setName(event);
				if (isNewPost) localStorage.setItem('name', event);
				break;
			case 'content':
				setContent(event);
				if (isNewPost) {
					try {
						localStorage.setItem('post', event);
						if (isPostBig) setPostBig(false);
					} catch (error) {
						toast.error("Your post weighs too much. Try deleting the images")
						if (!isPostBig) setPostBig(true);
					}
				}
				break;
			default:
				break;
		}
	}

	function handlePublic() {
		setPublicButtonToggled(true);
		changePostAccess({
			slug: post?.slug,
			published: !isPublic
		}).then(() => setPublic(!isPublic))
			.catch((error) => toast.error(error))
			.finally(() => setPublicButtonToggled(false));
	}

	async function handlePost() {
		if (!isValidPost(title, name, content)) {
			return toast.error("Check the length of the title, name or content");
		}
		if (isPostBig) {
			return toast.error("Your post weighs too much. Try deleting the images");
		}
		setPostButtonToggled(true);
		if (isNewPost) {
			createPost({
				title,
				name,
				content
			}).then((res) => {
				localStorage.removeItem('title');
				localStorage.removeItem('name');
				localStorage.removeItem('post');
				push(`/${res?.data.post.slug}`);
			}).catch((error) => toast.error(error))
				.finally(() => setPostButtonToggled(false));
		} else {
			setPostButtonToggled(true);
			editPost({
				slug: post?.slug,
				title,
				name,
				content
			}).then(() => setEdititng(false))
				.catch((error) => toast.error(error))
				.finally(() => setPostButtonToggled(false));
		}
	}

	function handleDelete() {
		setDeleteButtonToggled(true);
		deletePost(post?.slug).then(() => push('/'))
			.catch((error) => toast.error(error))
			.finally(() => setDeleteButtonToggled(false));
	}

	return (
		<section className="container mx-auto sm:px-10 px-4 mt-10 mb-24 w-screen sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-zinc-800 dark:text-zinc-100">
			<input className="w-full h-10 text-3xl font-bold focus:outline-none whitespace-pre-wrap break-words bg-transparent"
				type='text'
				disabled={!isEditing}
				defaultValue={title}
				onChange={(e) => handleChange("title", e.target.value)}
				maxLength={45}
				placeholder="Title"

			/>

			<div className='text-zinc-500 text-sm mt-2'>
				{post?.updatedAt && !isEditing ?
					<div className='grid grid-flow-col justify-start items-center'>
						<p className='break-all'>
							{name != "" ?
								`${name} • ${convertDate(post?.updatedAt)}`
								:
								`${convertDate(post?.updatedAt)}`
							}
							{isPublic ?
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
					:
					<input className="w-full whitespace-pre-wrap break-words bg-transparent focus:outline-none"
						type='text'
						disabled={!isEditing}
						defaultValue={name}
						onChange={(e) => handleChange("name", e.target.value)}
						maxLength={45}
						placeholder="Your name"
					/>
				}
			</div>

			<ReactQuill placeholder='Your story...'
				readOnly={!isEditing}
				modules={modules}
				value={content}
				onChange={(e) => handleChange("content", e)}
				theme='bubble'
			/>

			{canEdit ?
				<aside className='grid grid-flow-col gap-2 w-fit top-0 right-0 lg:fixed lg:left-1/2 lg:ml-[376px] lg:mt-12 mt-4'>
					<button className={`border-2 rounded-full px-3 py-[2px] ${postButtonToggled ? 'gray-button-toggled' : 'gray-button'}`}
						disabled={postButtonToggled}
						onClick={() => isEditing ? handlePost() : setEdititng(true)}>
						<p className='uppercase font-bold select-none'>
							{isEditing ? "Publish" : "Edit"}
						</p>
					</button>
					{!isEditing ? <>
						<button className={`border-2 rounded-full p-1 ${publicButtonToggled ? 'gray-button-toggled' : 'gray-button'}`}
							disabled={publicButtonToggled}
							onClick={handlePublic}>
							{isPublic ?
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
									<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
								</svg>
								:
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
									<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							}
						</button>
						<button className={`border-2 rounded-full p-1 ${deleteButtonToggled ? 'red-button-toggled' : 'red-button'}`}
							disabled={deleteButtonToggled}
							onClick={handleDelete}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
							</svg>
						</button>
					</> : <></>}
				</aside>
				: <></>
			}
		</section>
	)
}

export function convertDate(date: string) {
	let formattedDate = new Date(date);
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	}).format(formattedDate);
}