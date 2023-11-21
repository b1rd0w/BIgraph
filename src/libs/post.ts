import axios from "axios";

const NEXT_URL = process.env.NEXT_URL || "";

export async function createPost({ ...params }) {
	try {
		const response = await axios.post(`${NEXT_URL}/api/post/create`, params);
		if (response.status === 200) return response;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.status === 413) {
				throw 'Your post weighs too much. Try deleting the images';
			} else {
				if (error.response.data.message) throw error.response.data.message
				else throw `Post creation error: ${error.response.statusText} (${error.response.status})`
			}
		}
	}
}

export async function editPost({ ...params }) {
	try {
		const response = await axios.patch(`${NEXT_URL}/api/post/edit`, params);
		if (response.status === 200) return response;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.status === 413) {
				throw 'Your post weighs too much. Try deleting the images';
			} else {
				if (error.response.data.message) throw error.response.data.message
				else throw `Post change error: ${error.response.statusText} (${error.response.status})`
			}
		}
	}
}

export async function viewPost(slug: string) {
	try {
		const response = await axios.patch(`${NEXT_URL}/api/post/view?slug=${slug}`);
		if (response.status === 200) return response;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `Post view error: ${error.response.statusText} (${error.response.status})`
		}
	}
}

export async function changePostAccess({ ...params }) {
	try {
		const response = await axios.patch(`${NEXT_URL}/api/post/access`, params);
		if (response.status === 200) return response;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `Post change access error: ${error.response.statusText} (${error.response.status})`
		}
	}
}

export async function deletePost(slug: string) {
	try {
		const response = await axios.delete(`${NEXT_URL}/api/post/delete?slug=${slug}`);
		if (response.status === 200) return response;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `Post deleting error: ${error.response.statusText} (${error.response.status})`
		}
	}
}

export async function getPostsBySearch(search: string) {
	try {
		const response = await axios.get(`${NEXT_URL}/api/post/search?title=${search}`);
		if (response.status === 200) return response;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			if (error.response.data.message) throw error.response.data.message
			else throw `Post search error: ${error.response.statusText} (${error.response.status})`
		}
	}
}

export function checkPostLength(title: string, name: any, content: string) {
	if (title.length < 2 || title.length > 45) {
		return false;
	}
	if (name?.length > 45) {
		return false;
	}
	if (!content || content == "<p><br></p>") {
		return false;
	}
	return true;
}