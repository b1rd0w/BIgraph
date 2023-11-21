import Footer from '@/components/navigation/footer';
import Header from '@/components/navigation/header';
import '@/styles/globals.css';
import '@/styles/quill.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({
    subsets: ['latin', 'cyrillic-ext'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata: Metadata = {
    metadataBase: new URL(`${process.env.NEXT_URL}`),
    title: 'BIgraph',
    openGraph: {
        title: 'BIgraph',
        description: 'BIgraph is a minimalist publishing tool that allows you to create richly formatted posts and push them to the Web in just a click.',
        locale: 'ru_RU',
        type: 'website',
        url: process.env.NEXT_URL,
        siteName: 'BIgraph',
    },
    twitter: {
        title: 'BIgraph',
        description: 'BIgraph is a minimalist publishing tool that allows you to create richly formatted posts and push them to the Web in just a click.',
    },
    icons: {
        icon: '/favicon.svg',
    },
    description: 'BIgraph is a minimalist publishing tool that allows you to create richly formatted posts and push them to the Web in just a click.',
    keywords: 'BIgraph, Telegraph, BIRDOW, телеграф, биграф, bi-graph',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={`${inter.className} antialiased flex min-h-full flex-col h-screen overflow-x-hidden bg-white text-zinc-900 selection:bg-zinc-300 dark:selection:bg-zinc-700 dark:bg-zinc-900 dark:text-white`}>
                <Providers>
                    <Header />
                    <main>
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
