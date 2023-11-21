import Link from "next/link";

export default function Footer() {
	return (
		<footer className="z-50 mt-auto inset-x-0 bottom-0 w-full border-t py-3 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150">
			<div className="container px-4 mx-auto grid grid-flow-col gap-x-3 justify-center text-center items-center text-zinc-500">
				<p>Developed by <Link href="https://github.com/B1RDOW" className="underline hover:decoration-wavy decoration-dashed decoration-1 font-medium dark:text-zinc-200 text-zinc-800 transition" target="_blank" rel="noreferrer noopener">BIRDOW</Link></p>
				<p className="select-none">|</p>
				<p>Source on <Link href="https://github.com/B1RDOW/bi-graph" className="underline hover:decoration-wavy decoration-dashed decoration-1 font-medium dark:text-zinc-200 text-zinc-800 transition" target="_blank" rel="noreferrer noopener">GitHub</Link></p>
			</div>
		</footer>
	)
}