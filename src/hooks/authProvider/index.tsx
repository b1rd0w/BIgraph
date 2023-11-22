"use client";
import { verifyJWT } from '@/libs/token';
import { User } from '@prisma/client';
import { getCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<User | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | undefined>();

	useEffect(() => {
		const cookieToken = getCookie("token")
		async function authorization() {
			const { user, token } = await verifyJWT(false, cookieToken)
			setUser(user)
			setCookie("token", token, {
				expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
				secure: process.env.NODE_ENV === 'production',
				path: '/'
			})
		};
		authorization();
	}, []);

	return (
		<AuthContext.Provider value={user}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);