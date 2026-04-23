import { useWalletConnection } from '@solana/react-hooks';
import { useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

function formatError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === 'string') {
		return error;
	}
	return JSON.stringify(error);
}

export function WalletControls() {
	const { connect, connectors, connectorId, connected, connecting, disconnect, error, status, wallet } =
		useWalletConnection();

	const handleConnect = useCallback(
		async (connectorId: string) => {
			try {
				await connect(connectorId, { allowInteractiveFallback: true });
			} catch {
				// Store will expose the error state; nothing else to do here.
			}
		},
		[connect],
	);

	const handleDisconnect = useCallback(async () => {
		try {
			await disconnect();
		} catch {
			// Store already captures the error in wallet state.
		}
	}, [disconnect]);

	let statusLabel = 'No wallet connected.';
	if (status === 'connected' && wallet) {
		statusLabel = `Connected to ${connectorId}: ${wallet.account.address.toString()}`;
	} else if (status === 'connecting') {
		statusLabel = `Connecting to ${connectorId ?? 'wallet'}…`;
	} else if (status === 'error') {
		statusLabel = `Error connecting to ${connectorId ?? 'wallet'}.`;
	}

	const formattedError = status === 'error' && error ? formatError(error) : null;

	return (
		<Card>
			<CardHeader>
				<div className="space-y-1.5">
					<CardTitle>Wallets</CardTitle>
					<CardDescription>
						Connect with configured wallet connectors, and disconnect with a single helper call.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-2 sm:grid-cols-2" aria-live="polite">
					{connectors.length === 0 ? (
						<span className="rounded-md border border-dashed border-border/70 px-3 py-2 text-sm text-muted-foreground sm:col-span-2">
							No wallet connectors detected. On mobile, open this page from the wallet app's
							in-app browser (Phantom / Solflare / Backpack) or set
							<code className="mx-1">VITE_WALLETCONNECT_PROJECT_ID</code>
							to enable WalletConnect.
						</span>
					) : null}
					{connectors.map((connector) => {
						const isActive = connected && connector.id === connectorId;
						const isBusy = connecting && connector.id === connectorId;
						const icon = 'icon' in connector ? (connector as { icon?: string }).icon : undefined;
						return (
							<Button
								key={connector.id}
								disabled={isActive || isBusy}
								onClick={() => handleConnect(connector.id)}
								title={connector.name}
								type="button"
								variant={isActive ? 'secondary' : 'outline'}
								className="justify-start gap-2"
							>
								{icon ? (
									<img src={icon} alt="" aria-hidden className="h-4 w-4" />
								) : null}
								<span className="truncate">
									{isActive ? `✓ ${connector.name}` : connector.name}
								</span>
							</Button>
						);
					})}
				</div>
				{wallet ? (
					<div className="flex flex-wrap gap-2">
						<Button disabled={connecting} onClick={handleDisconnect} type="button" variant="ghost">
							Disconnect
						</Button>
					</div>
				) : null}
			</CardContent>
			<CardFooter className="flex flex-col gap-3 text-sm">
				<p className="text-muted-foreground">{statusLabel}</p>
				{formattedError ? (
					<span aria-live="polite" className="status-badge" data-state="error">
						{formattedError}
					</span>
				) : null}
			</CardFooter>
		</Card>
	);
}
