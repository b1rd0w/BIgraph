export default function Loading() {
	return (
		<section className="container mx-auto sm:px-10 px-4 mt-10 mb-24 w-screen sm:max-w-xl md:max-w-2xl lg:max-w-3xl grid gap-9">
			<div className="w-4/6 h-8 animate-pulse bg-zinc-300/20 dark:bg-zinc-700/20 rounded-xl shadow-sm" />
			<div className="grid grid-flow-row gap-4">
				<div className="w-full h-32 animate-pulse bg-zinc-300/20 dark:bg-zinc-700/20 rounded-lg shadow-sm" />
				<div className="w-full h-32 animate-pulse bg-zinc-300/20 dark:bg-zinc-700/20 rounded-lg shadow-sm" />
				<div className="w-full h-32 animate-pulse bg-zinc-300/20 dark:bg-zinc-700/20 rounded-lg shadow-sm" />
				<div className="w-full h-32 animate-pulse bg-zinc-300/20 dark:bg-zinc-700/20 rounded-lg shadow-sm" />
			</div>
		</section>
	)
}