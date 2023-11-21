import { getUser } from '@/libs/authorization';
import prisma from '@/libs/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
	const { searchParams } = new URL(request.url);
	const slug = searchParams.get("slug") || "";

	const cookieToken = cookies().get('token')?.value;
	const { data: { user, token } } = await getUser(cookieToken);

	const post = await prisma.post.findUnique({ where: { slug } })

	if (!post) {
		return NextResponse.json({ message: `This post doesn't exist` }, { status: 404 });
	}

	try {
		if (post.published && !post.views.includes(user.id)) {
			const updatedPost = await prisma.post.update({
				where: { slug: post.slug },
				data: {
					views: {
						push: user.id,
					},
				},
			})
			let response = NextResponse.json({ message: `Post viewed!`, post: updatedPost }, { status: 200 });
			response.cookies.set({
				name: 'token',
				value: token,
				expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
				secure: process.env.NODE_ENV == 'production',
				path: '/'
			})
			return response;
		} else {
			let response = NextResponse.json({ message: `Post already viewed!`, post }, { status: 200 });
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
		return NextResponse.json({ message: `Failed to view post` }, { status: 500 });
	}
}