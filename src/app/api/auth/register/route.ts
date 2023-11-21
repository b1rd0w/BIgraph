import prisma from "@/libs/prisma";
import { createJWT } from "@/libs/token";
import { NextResponse } from "next/server";

export async function POST() {
	const user = await prisma.user.create({
		data: {
			role: 'USER',
			createdAt: new Date()
		}
	})
	const token = await createJWT({
		id: user.id,
		createdAt: user.createdAt,
		role: user.role,
	})
	return NextResponse.json({ message: 'Account successfully created!', user, token }, { status: 200 })
}