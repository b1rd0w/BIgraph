import { fetchUser } from '@/libs/authorization';
import prisma from '@/libs/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
	const { searchParams } = new URL(request.url);
	const slug = searchParams.get("slug") || "";

	const cookieToken = cookies().get('token')?.value;
	const { data: { user, token } } = await fetchUser(cookieToken);

	const post = await prisma.post.findUnique({ where: { slug } })

	if (!post) {
		return NextResponse.json({ message: `The requested post does not exist` }, { status: 404 });
	}

	try {
		const isPostPublished = post.published && !post.views.includes(user.id);
		const updatedPost = isPostPublished
			? await prisma.post.update({
				where: { slug: post.slug },
				data: {
					views: {
						push: user.id,
					},
				},
			}) : null;

		const responseMessage = isPostPublished ? `Post viewed successfully!` : `Post already viewed!`;
		const response = NextResponse.json({ message: responseMessage, post: updatedPost || post }, { status: 200 });
		response.cookies.set({
			name: 'token',
			value: token,
			expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		});
		return response;
	} catch (error) {
		return NextResponse.json({ message: `Failed to view the post` }, { status: 500 });
	}
}