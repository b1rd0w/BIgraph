import { User } from '.prisma/client';
import axios from 'axios';

const NEXT_URL = process.env.NEXT_URL || "";

export async function getUser(token: string | undefined) {
	try {
		const response = await axios.post(`${NEXT_URL}/api/auth/login`, token);
		if (response.status === 200) return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `Authorization error: ${error.response.statusText} (${error.response.status})`
		}
	}
}

export async function createUser() {
	try {
		const response = await axios.post(`${NEXT_URL}/api/auth/register`);
		if (response.status === 200) return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `Registration error: ${error.response.statusText} (${error.response.status})`
		}
	}
}

export async function verifyUser(user: User) {
	try {
		const response = await axios.post(`${NEXT_URL}/api/auth/verify`, user);
		if (response.status === 200) return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `User verification error: ${error.response.statusText} (${error.response.status})`
		}
	}
}