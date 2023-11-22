import axios from "axios";

const NEXT_URL = process.env.NEXT_URL || "";

function handleAxiosError(operation: string, error: unknown) {
	if (axios.isAxiosError(error) && error.response) {
		if (error.response.status === 413) {
			throw 'Your post is too large. Try removing images.';
		} else {
			throw error.response.data.message || `${operation} error: ${error.response.statusText} (${error.response.status})`;
		}
	}
}

export async function createPost({ ...params }) {
	try {
		const response = await axios.post(`${NEXT_URL}/api/post/create`, params);
		if (response.status === 200) return response;
	} catch (error) {
		handleAxiosError("Post creation", error);
	}
}

export async function editPost({ ...params }) {
	try {
		const response = await axios.patch(`${NEXT_URL}/api/post/edit`, params);
		if (response.status === 200) return response;
	} catch (error) {
		handleAxiosError("Post editing", error);
	}
}

export async function viewPost(slug: string) {
	try {
		const response = await axios.patch(`${NEXT_URL}/api/post/view?slug=${slug}`);
		if (response.status === 200) return response;
	} catch (error) {
		handleAxiosError("Post viewing", error);
	}
}

export async function changePostAccess({ ...params }) {
	try {
		const response = await axios.patch(`${NEXT_URL}/api/post/access`, params);
		if (response.status === 200) return response;
	} catch (error) {
		handleAxiosError("Post access change", error);
	}
}

export async function deletePost(slug: string) {
	try {
		const response = await axios.delete(`${NEXT_URL}/api/post/delete?slug=${slug}`);
		if (response.status === 200) return response;
	} catch (error) {
		handleAxiosError("Post deletion", error);
	}
}

export async function getPostsBySearch(search: string) {
	try {
		const response = await axios.get(`${NEXT_URL}/api/post/search?title=${search}`);
		if (response.status === 200) return response;
	} catch (error) {
		handleAxiosError("Post search", error);
	}
}

export function isValidPost(title: string, name: any, content: string): boolean {
	if (title.length < 2 || title.length > 45) return false;
	if (name?.length > 45) return false;
	if (!content || content == "<p><br></p>") return false;
	return true;
}