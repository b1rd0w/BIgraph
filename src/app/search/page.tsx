"use client";
import Forbidden from "@/components/forbidden";
import SearchComponent from "@/components/search";
import { useAuth } from "@/hooks/authProvider";
import Loading from "./loading";

export default function SearchPage() {
	const user = useAuth();
	if (!user) return <Loading />
	if (user.role === "USER") return <Forbidden />;
	return <SearchComponent />
}