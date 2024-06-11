const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  IPFS: process.env.REACT_APP_IPFS_ADDRESS as string,
  AUTH_HEADER: process.env.REACT_APP_CRUST_AUTH_HEADER as string,
  IPFS_GATEWAY: process.env.REACT_APP_IPFS_GATEWAY_ADDRESS as string,
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`,
  TICKET_CONTRACT_ADDRESS: process.env.REACT_APP_TICKET_CONTRACT_ADDRESS as `0x${string}`,
};

console.log(process.env);

if (process.env.NODE_ENV === 'development') {
  ADDRESS.CONTRACT_ADDRESS = '0x405cc486e49810362722fcc85b96a475557f3cdcdd4429cc9076456933056709';
  ADDRESS.TICKET_CONTRACT_ADDRESS = '0xa570c078c9ad09cef0dab6a6c070f40d7eda959e3c9852f9e3aba6cc19c60801';
}

console.log('address==',ADDRESS);

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const FILTERS = ['All', 'My', 'Approved'];

export { ADDRESS, LOCAL_STORAGE, FILTERS };
