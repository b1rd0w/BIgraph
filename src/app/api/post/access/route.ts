import { fetchUser } from '@/libs/authorization';
import prisma from '@/libs/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_COOLDOWN = 1000;
const lastExecutionTime: { [key: string]: number } = {};

export async function PATCH(request: Request) {
	const requestBody = await request.json();
	const { slug, published } = requestBody;

	const cookieToken = cookies().get('token')?.value;
	const { data: { user, token } } = await fetchUser(cookieToken);

	const now = Date.now();
	if (lastExecutionTime[user.id] && now - lastExecutionTime[user.id] < API_COOLDOWN) {
		return NextResponse.json({ message: `Too many requests! Please wait...` }, { status: 429 });
	} lastExecutionTime[user.id] = now;

	const post = await prisma.post.findUnique({ where: { slug } })

	if (!post) {
		return NextResponse.json({ message: `The requested post does not exist` }, { status: 404 });
	}

	try {
		if (post.authorId === user.id || user.role === "ADMIN") {
			const updatedPost = await prisma.post.update({
				where: { slug },
				data: { published }
			})
			let response = NextResponse.json({ message: `Post updated successfully!`, updatedPost }, { status: 200 });
			response.cookies.set({
				name: 'token',
				value: token,
				expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				secure: process.env.NODE_ENV === 'production',
				path: '/'
			})
			return response;
		} else {
			let response = NextResponse.json({ message: `You are not authorized to change access to this post` }, { status: 403 });
			response.cookies.set({
				name: 'token',
				value: token,
				expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				secure: process.env.NODE_ENV === 'production',
				path: '/'
			})
			return response;
		}
	} catch (error) {
		return NextResponse.json({ message: `Failed to change post access` }, { status: 500 });
	}
}