import prisma from "@/libs/prisma";
import { createJWT } from "@/libs/token";
import { NextResponse } from "next/server";

export async function POST() {
	const newUser = await prisma.user.create({
		data: {
			role: 'USER',
			createdAt: new Date()
		}
	});
	const token = await createJWT({
		id: newUser.id,
		createdAt: newUser.createdAt,
		role: newUser.role,
	});
	return NextResponse.json({ message: 'Account successfully created!', user: newUser, token }, { status: 200 })
}