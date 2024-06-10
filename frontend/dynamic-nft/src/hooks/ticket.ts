import { useAccount, useReadWasmState, useSendMessageWithGas } from '@gear-js/react-hooks';
import { ADDRESS } from 'consts';
import { useMetadata, useWasmMetadata } from './useMetadata';
import ftTicketStateMeta from 'contracts/fungible_token_state.meta.wasm';
import ftTicketMetaTxt from 'contracts/fungible_token.meta.txt';
// const ftTicketWasm = '/static/fungible_token_state.meta.wasm';
const ftMetaTxt = '/static/fungible_token.meta.txt';

function useTicketState<T>(functionName: string, argument?: any) {
  const { buffer } = useWasmMetadata(ftTicketStateMeta);
  const programMetadata = useMetadata(ftTicketMetaTxt);

  const result = useReadWasmState<T>({
    programId: ADDRESS.TICKET_CONTRACT_ADDRESS,
    wasm: buffer,
    programMetadata,
    functionName,
    argument,
    payload: '0x',
  });

  return result;
}

function useTicketName() {
  const ret = useTicketState<string>('name','');
  console.log('useTicketName:', ret);
  let result = { name: '', isReadOk: false };
  if (ret.error) {
    result.name = '';
    result.isReadOk = true;
  } else {
    result.name = ret.state?.replace(/^\s+/, '') || '';
    result.isReadOk = ret.isStateRead;
  }

  return result;
}

function useTicketBalance() {
  const { account } = useAccount();
  const owner = account?.decodedAddress;
  const ret2 = useTicketState<number>('balances_of', owner);
  if (ret2.error) {
    return 0;
  }
  console.log('useTicketBalance:', ret2);
  return ret2.state;
}

function useSendTicketMessage() {
  const meta = useMetadata(ftTicketMetaTxt);
  return useSendMessageWithGas(ADDRESS.TICKET_CONTRACT_ADDRESS, meta);
}

export { useTicketName, useTicketBalance, useSendTicketMessage };
