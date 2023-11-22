import prisma from "@/libs/prisma";
import { createJWT } from "@/libs/token";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const requestedUser = await request.json();
	if (!requestedUser) return NextResponse.json({ message: `The searched user is not specified` }, { status: 404 });

	const foundUser = await prisma.user.findFirst({
		where: {
			id: requestedUser.id,
			role: requestedUser.role,
			createdAt: requestedUser.createdAt
		}
	});
	if (!foundUser) return NextResponse.json({ message: `User not found` }, { status: 404 });

	const token = await createJWT({
		id: foundUser.id,
		createdAt: foundUser.createdAt,
		role: foundUser.role,
	});

	const response = NextResponse.json({ message: `User successfully found`, user: foundUser, token }, { status: 200 });
	response.cookies.set({
		name: 'token',
		value: token,
		expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
		secure: process.env.NODE_ENV === 'production',
		path: '/'
	});
	return response;
}