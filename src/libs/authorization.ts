import { User } from '.prisma/client';
import axios from 'axios';

const NEXT_URL = process.env.NEXT_URL || "";

function handleAxiosError(operation: string, error: unknown) {
	if (axios.isAxiosError(error) && error.response) {
		throw error.response.data.message || `${operation} error: ${error.response.statusText} (${error.response.status})`;
	}
}

export async function fetchUser(token: string | undefined) {
	try {
		const response = await axios.post(`${NEXT_URL}/api/auth/login`, token);
		if (response.status === 200) return response.data;
	} catch (error) {
		handleAxiosError("User authorization", error);
	}
}

export async function createUserAccount() {
	try {
		const response = await axios.post(`${NEXT_URL}/api/auth/register`);
		if (response.status === 200) return response.data;
	} catch (error) {
		handleAxiosError("User registration", error);
	}
}

export async function verifyUserAccount(userData: User) {
	try {
		const response = await axios.post(`${NEXT_URL}/api/auth/verify`, userData);
		if (response.status === 200) return response.data;
	} catch (error) {
		handleAxiosError("User verification", error);
	}
}