"use server";
import { User } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { createUserAccount, verifyUserAccount } from "./authorization";

const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function createJWT(userData: User) {
	return new SignJWT(userData)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1d')
		.sign(JWT_SECRET_KEY);
}

export async function verifyJWT(strongValidation: boolean, tokenToVerify: string | undefined) {
	try {
		if (!tokenToVerify) {
			throw new Error("No token provided!");
		}

		const userFromToken = (await jwtVerify(tokenToVerify, JWT_SECRET_KEY)).payload as User;

		if (strongValidation) {
			const { user, token } = await verifyUserAccount(userFromToken).catch((error) => {
				throw new Error(error);
			});

			return { user, token };
		} else {
			return {
				user: userFromToken,
				token: tokenToVerify
			};
		}
	} catch (error) {
		const { user, token } = await createUserAccount();
		return { user, token };
	}
}