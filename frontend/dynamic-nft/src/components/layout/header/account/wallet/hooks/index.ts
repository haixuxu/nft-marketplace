import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { WALLET } from '../consts';

function useWallet() {
  const { account, accounts } = useAccount();

  const [walletId, setWalletId] = useState(account?.meta.source as string | undefined);
  const wallet = walletId ? WALLET[walletId] : undefined;

  const getWalletAccounts = (id: string) => accounts?.filter(({ meta }) => meta.source === id);
  const walletAccounts = walletId ? getWalletAccounts(walletId) : undefined;

  const resetWalletId = () => setWalletId(undefined);

  return { wallet, walletAccounts, setWalletId, resetWalletId, getWalletAccounts };
}

export { useWallet };
