import prisma from "@/libs/prisma";
import { createJWT } from "@/libs/token";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const requestedUser = await request.json();
	if (!requestedUser) return NextResponse.json({ message: `The searched user is not specified` }, { status: 404 });

	const foundUser = await prisma.user.findFirst({
		where: {
			id: requestedUser.id,
			createdAt: requestedUser.createdAt
		}
	});

	if (!foundUser) return NextResponse.json({ message: `User not found` }, { status: 404 });

	const token = await createJWT({
		id: foundUser.id,
		createdAt: foundUser.createdAt,
		role: foundUser.role,
	});

	return NextResponse.json({ message: `User successfully found`, user: foundUser, token }, { status: 200 });
}