'use client'
import { AuthProvider } from '@/hooks/authProvider'
import { ThemeProvider } from 'next-themes'
import { ToastIcon, Toaster, resolveValue } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class">
			<Toaster position="top-left" containerClassName="sm:mt-16">
				{(t) => (
					<div className={`${t.visible ? 'animate-enter' : 'animate-leave'} grid grid-flow-col items-center px-2 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow`}>
						<ToastIcon toast={t} />
						<div className="px-2 text-zinc-900 dark:text-zinc-100 font-semibold">{resolveValue(t.message, t)}</div>
					</div>
				)}
			</Toaster>
			<AuthProvider>
				{children}
			</AuthProvider>
		</ThemeProvider>
	)
}