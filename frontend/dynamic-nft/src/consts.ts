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
  ADDRESS.CONTRACT_ADDRESS = '0xbadd6eb9b2d81fb705ea29c6d747a6d7471ff2b3b3a9c9bf4f00d1bbd1016ce3';
  ADDRESS.TICKET_CONTRACT_ADDRESS = '0xa13a385944dc70f507a76494707d735d0c99bb72619dad472302e94dc53e7be2';
}

console.log('address==',ADDRESS);

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const FILTERS = ['All', 'My', 'Approved'];

export { ADDRESS, LOCAL_STORAGE, FILTERS };
