import { fetchUser } from '@/libs/authorization';
import prisma from '@/libs/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_COOLDOWN = 800;
const lastExecutionTime: { [key: string]: number } = {};

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title");

	const cookieToken = cookies().get('token')?.value;
	const { data: { user, token } } = await fetchUser(cookieToken);

	const now = Date.now();
	if (lastExecutionTime[user.id] && now - lastExecutionTime[user.id] < API_COOLDOWN) {
		return NextResponse.json({ message: `Too many requests! Please wait...` }, { status: 429 });
	} lastExecutionTime[user.id] = now;

	if (user.role !== "ADMIN") {
		return NextResponse.json({ message: `You are not authorized to search posts` }, { status: 403 });
	}

	try {
		let posts = [];
		if (title) {
			posts = await prisma.post.findMany({
				where: {
					title: {
						contains: title,
						mode: 'insensitive'
					},
				},
				orderBy: {
					createdAt: 'desc'
				}
			})
		} else {
			posts = await prisma.post.findMany({
				orderBy: {
					createdAt: 'desc'
				}
			})
		}
		let response = NextResponse.json({ message: `Posts searched successfully!`, posts }, { status: 200 });
		response.cookies.set({
			name: 'token',
			value: token,
			expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
			secure: process.env.NODE_ENV === 'production',
			path: '/'
		})
		return response;
	} catch (error) {
		return NextResponse.json({ message: `Failed to find posts` }, { status: 500 });
	}
}