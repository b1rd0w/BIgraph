import prisma from "@/libs/prisma";
import { createJWT } from "@/libs/token";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const user = await request.json();
	if (!user) return NextResponse.json({ message: `The searched user is not specified` }, { status: 404 });
	const userFind = await prisma.user.findFirst({
		where: {
			id: user.id,
			createdAt: user.createdAt
		}
	})
	if (!userFind) return NextResponse.json({ message: `User not found` }, { status: 404 });
	const token = await createJWT({
		id: userFind.id,
		createdAt: userFind.createdAt,
		role: userFind.role,
	})
	return NextResponse.json({ message: 'User successfully found', user, token }, { status: 200 })
}