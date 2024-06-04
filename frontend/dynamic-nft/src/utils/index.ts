import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ADDRESS, LOCAL_STORAGE } from 'consts';
export * from './form';
export * from './ipfs';

export const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;
export const getIpfsAddress = (cid: string) => `${ADDRESS.IPFS_GATEWAY}/${cid}`;


