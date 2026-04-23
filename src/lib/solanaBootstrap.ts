import { createClient, type SolanaClient } from '@solana/client';
import { connectorKit } from '@solana/client/connectorkit';

// const walletConnectProjectId = (
//   import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? ''
// ).trim();

export async function createSolanaClient(): Promise<SolanaClient> {
  const { ready } = await import('@solana/connector/headless');
  await ready;

  const walletConnectors = connectorKit({
    defaultConfig: {
      appName: 'Solana Client Toolkit',
      network: 'mainnet-beta',
      enableMobile: true,
      walletConnect: { projectId: '275757b20b0a7c2eaa6b813e7bbb0d8b' },
    },
  });

  return createClient({
    commitment: 'confirmed',
    cluster: 'mainnet-beta',
    walletConnectors,
  });
}
