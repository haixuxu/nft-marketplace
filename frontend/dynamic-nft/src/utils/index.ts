import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ADDRESS, LOCAL_STORAGE } from 'consts';
export * from './form';
export * from './ipfs';

export const isLoggedIn = ({ address }: InjectedAccountWithMeta) => localStorage[LOCAL_STORAGE.ACCOUNT] === address;
export const getIpfsAddress = (cid: string) => `${ADDRESS.IPFS_GATEWAY}/${cid}`;

const cache: Record<string, any | undefined> = {};
type Task = { promise?: Promise<void>; response?: Response };

export function fetchData(input: RequestInfo | URL, init?: RequestInit) {
  const url = input.toString();
  if (!cache[url]) {
    let task: Task = {};
    task.promise = new Promise((resolve, reject) => {
      fetch(input, init)
        .then((resp) => {
          task.response = resp;
          resolve();
        })
        .catch((err) => {
          cache[url] = undefined;
          throw err;
        });
    });
    cache[url] = task;
  }
  const task = cache[url];
  return task.promise.then(() => task.response!.clone()) as Promise<any>;
}
