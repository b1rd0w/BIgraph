import { getUser } from '@/libs/authorization';
import { checkPostLength } from '@/libs/post';
import prisma from '@/libs/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const apiCooldown = 5000;
const lastExecutionTime: { [key: string]: number } = {};

export async function PATCH(request: Request) {
	const body = await request.json();
	const { slug, title, name, content } = body;

	const cookieToken = cookies().get('token')?.value;
	const { data: { user, token } } = await getUser(cookieToken);

	const now = Date.now();
	if (lastExecutionTime[user.id] && now - lastExecutionTime[user.id] < apiCooldown) {
		return NextResponse.json({ message: `Cooldown! Please wait...` }, { status: 429 });
	} lastExecutionTime[user.id] = now;

	const post = await prisma.post.findUnique({ where: { slug } })

	if (!post) {
		return NextResponse.json({ message: `This post doesn't exist` }, { status: 404 });
	}
	if (!checkPostLength(title, name, content)) {
		return NextResponse.json({ message: `Failed to edit a post. Check post length` }, { status: 500 });
	}

	try {
		if (post.authorId === user.id || user.role === "ADMIN") {
			const updatedPost = await prisma.post.update({
				where: { slug },
				data: {
					title,
					name,
					content,
				},
			})
			let response = NextResponse.json({ message: `Post updated!`, updatedPost }, { status: 200 });
			response.cookies.set({
				name: 'token',
				value: token,
				expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
				secure: process.env.NODE_ENV == 'production',
				path: '/'
			})
			return response;
		} else {
			let response = NextResponse.json({ message: `You are not authorized to edit this post` }, { status: 403 });
			response.cookies.set({
				name: 'token',
				value: token,
				expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
				secure: process.env.NODE_ENV == 'production',
				path: '/'
			})
			return response;
		}
	} catch (error) {
		return NextResponse.json({ message: `Failed to edit a post` }, { status: 500 });
	}
}