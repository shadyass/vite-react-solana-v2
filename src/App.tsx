import type { SolanaClient } from '@solana/client';
import { SolanaProvider } from '@solana/react-hooks';
import { useEffect, useState } from 'react';

import { DemoApp } from './DemoApp.tsx';
import { createSolanaClient } from './lib/solanaBootstrap.ts';

function BootstrapShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen">
			<div className="container mx-auto flex min-h-screen max-w-3xl items-center justify-center py-12">
				<div className="log-panel text-center text-sm text-muted-foreground">{children}</div>
			</div>
		</div>
	);
}

export default function App() {
	const [client, setClient] = useState<SolanaClient | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		createSolanaClient()
			.then((next) => {
				if (!cancelled) setClient(next);
			})
			.catch((e) => {
				if (!cancelled) setError(e instanceof Error ? e.message : String(e));
			});
		return () => {
			cancelled = true;
		};
	}, []);

	if (error) {
		return <BootstrapShell>Failed to initialize wallets: {error}</BootstrapShell>;
	}

	if (!client) {
		return <BootstrapShell>Loading wallets…</BootstrapShell>;
	}

	return (
		<SolanaProvider client={client} query={{ suspense: true }}>
			<DemoApp />
		</SolanaProvider>
	);
}
