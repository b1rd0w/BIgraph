import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="grid grid-flow-row gap-4 text-center pt-4 sm:pt-20 overflow-y-hidden">
			<h1 className="text-9xl font-bold">404</h1>
			<p>Page does not exist</p>
			<Link href="/" className="w-fit mx-auto mt-4 border-2 rounded-full px-3 py-[2px] gray-button">
				<p className='uppercase font-bold select-none'>
					Create new
				</p>
			</Link>
		</div>
	)
}