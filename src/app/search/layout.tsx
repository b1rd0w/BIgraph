import type { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Search - BIgraph',
	openGraph: {
		title: 'Search - BIgraph',
		description: 'BIgraph - Post search',

	},
	twitter: {
		title: 'Search - BIgraph',
		description: 'BIgraph - Post search',
	},
	description: 'BIgraph - Post search',
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
	return children
}