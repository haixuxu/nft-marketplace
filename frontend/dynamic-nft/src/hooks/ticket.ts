import { useAccount, useReadWasmState, useSendMessageWithGas } from '@gear-js/react-hooks';
import { ADDRESS } from 'consts';
import stateMetaWasm from 'contracts/fungible_token_state.meta.wasm';
import metaTxt from 'contracts/fungible_token.meta.txt';
import { useMetadata, useWasmMetadata } from './useMetadata';

function useTicketState<T>(functionName: string, argument?: any) {
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const programMetadata = useMetadata(metaTxt);

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
  const ret = useTicketState<string>('name', 'test');
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
  const meta = useMetadata(metaTxt);
  return useSendMessageWithGas(ADDRESS.TICKET_CONTRACT_ADDRESS, meta);
}

export { useTicketName, useTicketBalance, useSendTicketMessage };
