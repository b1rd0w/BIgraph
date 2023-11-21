"use server";
import { User } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { createUser, verifyUser } from "./authorization";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function createJWT(data: User) {
	return new SignJWT(data)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1d')
		.sign(JWT_SECRET);
}

export async function verifyJWT(strong: boolean, token: string | undefined) {
	try {
		if (!token) throw new Error("No token!");
		const user = (await jwtVerify(token, JWT_SECRET)).payload as User;
		if (strong) {
			const data = await verifyUser(user).catch((error) => {
				throw new Error(error)
			})
			return {
				user: data.user,
				token: data.token
			}
		} else {
			return { user, token }
		}
	} catch (error) {
		const data = await createUser()
		return {
			user: data.user,
			token: data.token
		}
	}
}