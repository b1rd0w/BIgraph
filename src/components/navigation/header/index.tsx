"use client";
import { useAuth } from "@/hooks/authProvider";
import SearchButton from "./SearchButton";
import ThemeButton from "./ThemeButton";

export default function Header() {
	const user = useAuth();
	if (!user) return null;
	return (
		<header className="grid grid-flow-col gap-3 fixed z-50 mt-11 md:ml-5 md:mr-0 mr-5 select-none right-0 md:right-auto items-center">
			{user.role === 'ADMIN' ? (
				<SearchButton />
			) : <></>}
			<ThemeButton />
		</header>
	)
}