"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SearchButton() {
	const pathname = usePathname()
	return (
		<Link className="group rounded-full p-1 transition order-first md:order-last"
			href={pathname == "/search" ? "/" : "/search"}>
			<svg className="h-6 w-6 group-hover:fill-current group-hover:text-zinc-800 dark:group-hover:text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
				{pathname == "/search" ? (
					<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
				) : (
					<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
				)}
			</svg>
		</Link>
	)
}